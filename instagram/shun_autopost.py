"""旬どらのお知らせ自動投稿（2026-11-09 本人指示）。MacBook の launchd から1日数回呼ばれる。

1. Safari で Instagram @dorayama_jp を見て、まだ取り込んでいない投稿を探す（fetch_latest.py）
2. 本文に「旬どら」を含む投稿だけ、AIが決まりどおりにお知らせ用の文章（4か国語）に整える（make_news_item.py）
3. お知らせを作り直して本番 dorayama.com と試作版へ公開（publish_all.sh）
   → build_news.py が旬どらを最新1件だけにし、過去の旬どら記事は自動で削除（空ページ化）
   → トップの商品欄の旬どらも最新に切り替わる
4. 二重確認: 組み立て結果の読み直し＋本番をお客様側から確認（check_live.py）
5. 結果を Vault（mini経由）とMacの通知に残す。旬どら以外の新着投稿は触らない（記録だけ）。
使い方: shun_autopost.py [--dry]（--dry は公開せずに下書きまで）"""
import datetime, json, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
WORK = os.path.join(HERE, '.work')
os.makedirs(WORK, exist_ok=True)
LOG = os.path.join(WORK, 'autopost.log')
STATE = os.path.join(WORK, 'state.json')
ALL = os.path.join(HERE, 'raw', 'all_posts.json')
DRY = '--dry' in sys.argv
VAULT_LOG = 'Knowledge/dorayama-hp-news-autopost.md'
VAULT_PROPOSALS = 'Knowledge/inbox/proposals.md'
now = datetime.datetime.now()
stamp = now.strftime('%Y-%m-%d %H:%M')


def log(msg):
    line = f'{stamp} {msg}'
    print(line)
    open(LOG, 'a').write(line + '\n')


def run(cmd, timeout=1800):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, cwd=ROOT)
    return r.returncode, (r.stdout + r.stderr).strip()


def to_vault(rel, text):
    """Vault へ1行追記（launchd からは Dropbox に書けないため、Vault を持つ mini に書いてもらう）。"""
    try:
        r = subprocess.run(['ssh', '-o', 'ConnectTimeout=10', 'mini',
                            f'cat >> "$HOME/Library/CloudStorage/Dropbox-Detale/D& W/社内/Vault/{rel}"'],
                           input=text + '\n', text=True, capture_output=True, timeout=60)
        return r.returncode == 0
    except Exception:
        return False


def notify(title, msg):
    subprocess.run(['osascript', '-e', f'display notification {json.dumps(msg)} with title {json.dumps(title)}'],
                   capture_output=True)


def load_state():
    try:
        return json.load(open(STATE))
    except Exception:
        return {'fail': {}, 'seen_other': []}


def fail(key, msg, login=False):
    st = load_state()
    n = st['fail'].get(key, 0) + 1
    st['fail'][key] = n
    json.dump(st, open(STATE, 'w'), ensure_ascii=False)
    log(f'失敗({n}回目) {msg}')
    if n == 1 or n % 6 == 0:  # 初回と、続くときは2〜3日に1回だけ知らせる
        head = '🔑 ログインをお願いします：Instagram https://www.instagram.com/ （MacBookのSafari）\n' if login else ''
        to_vault(VAULT_PROPOSALS, f'\n- [ ] {stamp} 【HPお知らせ自動投稿】{head}{msg}（{n}回目・記録: ~/dorayama-hp/instagram/.work/autopost.log）')
        to_vault(VAULT_LOG, f'- {stamp} ❌ {msg}')
        notify('HPお知らせ自動投稿：止まっています', msg[:120])
    sys.exit(1)


def ok(key):
    st = load_state()
    if st['fail'].pop(key, None):
        json.dump(st, open(STATE, 'w'), ensure_ascii=False)


# 1. 新着を探す
new_file = os.path.join(WORK, 'new_posts.json')
code, out = run(['/usr/bin/python3', os.path.join(HERE, 'fetch_latest.py'), new_file], timeout=600)
log(out.splitlines()[-1] if out else '取得の出力なし')
if code != 0:
    fail('fetch', f'Instagramの新着を読めませんでした（{out[-160:]}）', login='ログイン' in out)
ok('fetch')
new = json.load(open(new_file))
shun = [p for p in new if '旬どら' in p['caption']]
other = [p for p in new if p not in shun]
st = load_state()
for p in other:
    if p['code'] not in st['seen_other']:
        st['seen_other'].append(p['code'])
        log(f'旬どら以外の新着（お知らせには載せない）: {p["code"]} {p["caption"][:30]!r}')
json.dump(st, open(STATE, 'w'), ensure_ascii=False)
if not shun:
    log('新しい旬どらの投稿なし')
    sys.exit(0)

# 2. お知らせ用に整える（古い投稿から順に）
shun.sort(key=lambda p: int(p['taken_at']))
added = []
for p in shun:
    pf = os.path.join(WORK, f'post_{p["code"]}.json')
    json.dump(p, open(pf, 'w'), ensure_ascii=False)
    dst = os.path.join(WORK if DRY else os.path.join(HERE, 'news_items'), p['code'] + '.json')
    c, o = run(['/usr/bin/python3', os.path.join(HERE, 'make_news_item.py'), pf, dst], timeout=1500)
    log(o.replace('\n', ' / ')[:300])
    if c != 0:
        fail('draft_' + p['code'], f'旬どらの投稿 {p["code"]} をお知らせ文に整えられませんでした（{o[-160:]}）')
    ok('draft_' + p['code'])
    added.append((p, json.load(open(dst))))

if DRY:
    log('（試し運転のため公開しません）')
    sys.exit(0)

# 取り込み済みの投稿として記録（次回から新着扱いしない）
posts = json.load(open(ALL))
known = {q['code'] for q in posts}
for p, _ in added:
    if p['code'] not in known:
        posts.append(p)
posts.sort(key=lambda q: int(q['taken_at']), reverse=True)
json.dump(posts, open(ALL, 'w'), ensure_ascii=False)

# 3. 公開（他の会話の公開と重ならないよう publish_all.sh 側で順番待ち）
latest = added[-1][1]
c, o = run(['/bin/zsh', os.path.join(ROOT, 'publish_all.sh'), f'お知らせ自動更新：{latest["title"]}'], timeout=3600)
log('公開: ' + ' / '.join(o.splitlines()[-4:]))
if c != 0:
    fail('publish', f'「{latest["title"]}」をHPに公開できませんでした（{o[-200:]}）')
ok('publish')

# 4. 二重確認（1回目: 組み立てたデータの読み直し / 2回目: 本番をお客様側から）
data = json.load(open(os.path.join(ROOT, 'lib', 'news-data.json')))
s_items = [x for x in data if x['category'] == '旬どら']
if len(s_items) != 1 or s_items[0]['slug'] != latest['code']:
    fail('verify', f'公開データの旬どらが想定と違います（{[x["title"] for x in s_items]}）')
res = ''
for i in range(6):  # 本番の反映待ち（最大約5分）
    c, res = run(['/usr/bin/python3', os.path.join(HERE, 'check_live.py'), latest['code']], timeout=300)
    if c == 0:
        break
    time.sleep(60)
if c != 0:
    fail('verify', f'公開後の本番確認で食い違い: {res.splitlines()[-1] if res else "応答なし"}')
ok('verify')

msg = f'新しい旬どら「{latest["title"]}」をHPのお知らせに載せ、過去の旬どら記事を削除しました（本番を外から確認済み）'
log('✅ ' + msg)
to_vault(VAULT_LOG, f'- {stamp} ✅ {msg}｜https://dorayama.com/news/{latest["code"]}/')
notify('HPお知らせを自動更新しました', latest['title'])
