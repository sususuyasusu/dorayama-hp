"""news_items/*.json を点検する。
- 壊れたファイル・必須項目の欠け・未加工の投稿
- 禁止表現（日本一・浅草・電話番号・絵文字・ハッシュタグ・「円」の価格表記）
- 元の投稿にメディア関連語があるのに メディア 扱いでないもの（取りこぼし候補）
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
posts = {p['code']: p for p in json.load(open(os.path.join(HERE, 'raw', 'all_posts.json')))}
D = os.path.join(HERE, 'news_items')
MEDIA = re.compile(r'放送|テレビ|TV|番組|掲載|雑誌|取材|出演|紹介され|メディア|新聞|ラジオ|記事|PR TIMES|じゅん散歩|ブランチ|FM', re.I)
BAD = [('日本一', re.compile('日本一')), ('浅草', re.compile('浅草')), ('電話', re.compile(r'0\d{1,4}-\d{2,4}-\d{3,4}')),
       ('絵文字', re.compile('[\U0001F300-\U0001FAFF☀-➿]')), ('ハッシュタグ', re.compile(r'#\S')), ('円表記', re.compile(r'\d円'))]
ok = pub = hid = 0
problems, media, maybe = [], [], []
cats = {}
for code in posts:
    f = os.path.join(D, code + '.json')
    if not os.path.exists(f):
        problems.append(f'{code}: 未加工'); continue
    try:
        it = json.load(open(f))
    except Exception as e:
        problems.append(f'{code}: 壊れている {e}'); continue
    ok += 1
    if not it.get('publish'):
        hid += 1; continue
    pub += 1
    for k in ('title', 'body', 'category', 'en', 'zh', 'ko'):
        if not it.get(k):
            problems.append(f'{code}: {k} が無い')
    cats[it.get('category')] = cats.get(it.get('category'), 0) + 1
    text = it.get('title', '') + '\n'.join(it.get('body', []))
    for name, rx in BAD:
        if rx.search(text):
            problems.append(f'{code}: {name} → {rx.search(text).group(0)}')
    if it.get('category') == 'メディア':
        media.append(f"{it['date']} {(it.get('media') or {}).get('outlet')} | {it['title']}")
    elif MEDIA.search(posts[code]['caption'] or ''):
        m = MEDIA.search(posts[code]['caption'])
        s = posts[code]['caption']
        maybe.append(f"{it['date']} {code} [{it.get('category')}] {it['title']} ← …{s[max(0, m.start() - 25):m.end() + 25].replace(chr(10), ' ')}…")
print(f'読めた {ok} / 公開 {pub} / 非公開 {hid}')
print('分類:', ', '.join(f'{k} {v}' for k, v in sorted(cats.items(), key=lambda x: -x[1])))
print('--- 問題', len(problems)); print('\n'.join(problems))
print('--- メディア', len(media)); print('\n'.join(media))
print('--- 取りこぼし候補', len(maybe)); print('\n'.join(maybe))
