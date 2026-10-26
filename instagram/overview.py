"""全投稿の一覧を1行ずつ出す（日付・コード・種類・注意語・1行目）。分類の下見用。"""
import json, os, re, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
posts = json.load(open(os.path.join(HERE, 'raw', 'all_posts.json')))
MEDIA = re.compile(r'放送|テレビ|TV|番組|掲載|雑誌|取材|出演|紹介され|メディア|新聞|ラジオ|ウェブ版|記事|PR TIMES|じゅん散歩|ヒルナンデス|王様のブランチ|ZIP|めざまし|news|NHK|日テレ|フジ|TBS|テレ東|テレ朝|BS', re.I)
WARN = re.compile(r'日本一|浅草|0\d{1,4}-\d{2,4}-\d{3,4}')
for p in posts:
    d = datetime.datetime.fromtimestamp(p['taken_at']).strftime('%Y-%m-%d')
    cap = p['caption'] or ''
    first = next((l.strip() for l in cap.split('\n') if l.strip()), '')[:46]
    tags = []
    if MEDIA.search(cap): tags.append('MEDIA')
    w = sorted(set(WARN.findall(cap)))
    if w: tags.append('注意:' + '/'.join(x if not x[0].isdigit() else '電話' for x in w))
    print(d, p['code'], p.get('product') or p['type'], len(cap), ','.join(tags), '|', first)
