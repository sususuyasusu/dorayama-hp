"""新しい旬どらのInstagram投稿1件を、EDITING_RULES.md に沿って「お知らせ」用のJSONに整える（AIが下書き）。
使い方: make_news_item.py 投稿JSONファイル 出力先(news_items/<code>.json)
AIの出力は、決まりごと（分類・必須項目・圓・電話番号なし・旬どら情報など）を機械で点検し、
1つでも外れていれば保存しない（終了コード1）。"""
import json, os, re, subprocess, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
post = json.load(open(sys.argv[1]))
dst = sys.argv[2]
rules = open(os.path.join(HERE, 'EDITING_RULES.md')).read()
date = datetime.datetime.fromtimestamp(int(post['taken_at'])).strftime('%Y-%m-%d')
# 手本: 直近の旬どら記事（文体と項目をそろえる）
sample = json.load(open(os.path.join(HERE, 'news_items', 'DfJf249kp_9.json')))

prompt = f"""あなたは門仲どらやき どら山の公式HP「お知らせ」の編集係です。下の決まりに厳密に従い、
Instagram投稿1件を、お知らせ用のJSON 1個に整えてください。出力はJSONだけ（前後に説明や```を付けない）。

# 決まり
{rules}

# 今回の追加の決まり
- これは月替わり（または期間限定）の「旬どら」の告知なので category は必ず "旬どら"、publish は true。
- 次の項目を必ず加える: "shun": {{"month": 販売する月の数字, "ja": "日本語の商品名（『』や【】を付けない）", "en": "英語の商品名", "zh": "簡体字の商品名", "ko": "韓国語の商品名"}}
  販売する月は、本文の販売期間から読む（投稿日の翌月の告知のことが多い）。読めないときは見出しの「◯月」から。
- code は "{post['code']}"、date は "{date}" をそのまま入れる。
- 価格・期間・原材料など、投稿に無い事実を足さない。

# 手本（前回の旬どら記事。形と文体をそろえる）
{json.dumps(sample, ensure_ascii=False, indent=2)}

# 今回の投稿
{json.dumps({'code': post['code'], 'date': date, 'caption': post['caption']}, ensure_ascii=False, indent=2)}
"""

def ask_claude():
    r = subprocess.run([os.path.expanduser('~/.local/bin/claude'), '-p', '--model', 'sonnet', prompt],
                       capture_output=True, text=True, timeout=600)
    return r.returncode == 0, r.stdout.strip() or r.stderr.strip()


def ask_codex():
    last = dst + '.codex.txt'
    r = subprocess.run([os.path.expanduser('~/.local/bin/codex'), 'exec', '--skip-git-repo-check',
                        '--sandbox', 'read-only', '-o', last, prompt],
                       capture_output=True, text=True, timeout=900, cwd='/tmp')
    text = open(last).read().strip() if os.path.exists(last) else ''
    if os.path.exists(last):
        os.remove(last)
    return r.returncode == 0 and bool(text), text or r.stderr.strip()[-300:]


# Claude（手元のコマンド版）が使えなければ Codex で下書きする。どちらでも下の点検は同じ。
m, why = None, []
for name, ask in (('Claude', ask_claude), ('Codex', ask_codex)):
    try:
        ok, text = ask()
    except Exception as e:
        ok, text = False, str(e)
    m = re.search(r'\{.*\}', text, re.S) if ok else None
    if m:
        print('下書き担当:', name)
        break
    why.append(f'{name}: {text[:160]}')
if not m:
    print('AIの下書きに失敗:', ' / '.join(why)); sys.exit(1)
try:
    it = json.loads(m.group(0))
except Exception as e:
    print('AIの出力がJSONとして読めない:', e); sys.exit(1)

ng = []
if it.get('code') != post['code']: ng.append('投稿コードが違う')
if it.get('date') != date: ng.append('日付が違う')
if it.get('category') != '旬どら': ng.append('分類が旬どらでない')
if it.get('publish') is not True: ng.append('公開になっていない')
if not it.get('title') or len(it['title']) > 40: ng.append('見出しが無いか長すぎる')
if not it.get('body') or not all(isinstance(b, str) and b for b in it['body']): ng.append('本文が無い')
for k in ('en', 'zh', 'ko'):
    if not (it.get(k) or {}).get('title') or not (it.get(k) or {}).get('summary'): ng.append(f'{k}の翻訳が無い')
s = it.get('shun') or {}
if not isinstance(s.get('month'), int) or not 1 <= s['month'] <= 12: ng.append('旬どらの月が無い')
for k in ('ja', 'en', 'zh', 'ko'):
    if not s.get(k): ng.append(f'旬どらの商品名({k})が無い')
alltext = it['title'] + ''.join(it.get('body') or [])
if re.search(r'\d円', alltext): ng.append('価格が「円」のまま（圓にする決まり）')
if re.search(r'0\d{1,4}-?\d{2,4}-?\d{3,4}', alltext): ng.append('電話番号らしきものがある')
if '日本一' in alltext or '浅草' in alltext: ng.append('使わない言葉（日本一・浅草）がある')
if s.get('ja') and s['ja'] not in post['caption'].replace(' ', '') and s['ja'].replace(' ', '') not in post['caption'].replace(' ', ''):
    ng.append(f'商品名「{s.get("ja")}」が投稿文に見当たらない')
if ng:
    print('点検で不合格（保存しません）:', ' / '.join(ng)); sys.exit(1)

it['media'] = None
json.dump(it, open(dst, 'w'), ensure_ascii=False, indent=2)
back = json.load(open(dst))
print('保存:', back['title'], '｜', back['shun'])
