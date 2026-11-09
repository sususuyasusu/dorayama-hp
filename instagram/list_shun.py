"""lib/news-data.json と news_items の旬どら記事を一覧表示する（確認用）。"""
import json, os, glob
HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, '..', 'lib', 'news-data.json')))
print('サイトに載っている旬どら:')
for x in d:
    if x['category'] == '旬どら':
        print(' ', x['date'], x['slug'], x['title'])
print('news_items の旬どら（公開対象）:')
for f in sorted(glob.glob(os.path.join(HERE, 'news_items', '*.json'))):
    it = json.load(open(f))
    if it.get('category') == '旬どら' and it.get('publish'):
        print(' ', it['date'], it['code'], it['title'], '｜shun' if it.get('shun') else '')
r = os.path.join(HERE, '..', 'lib', 'retired-news.json')
if os.path.exists(r):
    print('削除済み扱い:', json.load(open(r)))
