"""本番 dorayama.com のお知らせと旬どらの状態を、外から（お客様と同じ見え方で）確かめる。
使い方: check_live.py [期待する旬どらの投稿コード]
終了コード: 0=期待どおり / 1=食い違いあり"""
import json, os, sys, urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BASE = 'https://dorayama.com'


def get(path):
    req = urllib.request.Request(BASE + path + ('&' if '?' in path else '?') + 'nocache=1', headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, r.read().decode('utf-8', 'replace')
    except urllib.error.HTTPError as e:
        return e.code, ''


data = json.load(open(os.path.join(ROOT, 'lib', 'news-data.json')))
retired = json.load(open(os.path.join(ROOT, 'lib', 'retired-news.json')))
latest = next((x for x in data if x['category'] == '旬どら'), None)
want = sys.argv[1] if len(sys.argv) > 1 else (latest['slug'] if latest else None)
ng = []

st, news = get('/news/')
print('お知らせ一覧', st)
shun_titles = [x['title'] for x in data if x['category'] == '旬どら']
if latest and latest['title'] not in news.replace('&#x27;', "'"):
    ng.append(f'一覧に最新の旬どら「{latest["title"]}」が無い')
old_titles = []
for f in os.listdir(os.path.join(ROOT, 'instagram', 'news_items')):
    if f.endswith('.json'):
        it = json.load(open(os.path.join(ROOT, 'instagram', 'news_items', f)))
        if it.get('code') in retired:
            old_titles.append(it['title'])
left = [t for t in old_titles if t in news]
if left:
    ng.append(f'一覧に過去の旬どらが {len(left)} 件残っている（例: {left[0]}）')
print('一覧に残っている過去の旬どら', len(left), '件 / 調べた', len(old_titles), '件')

if want:
    st, page = get(f'/news/{want}/')
    print('最新の旬どら記事', want, st)
    if st != 200 or (latest and latest['title'] not in page):
        ng.append('最新の旬どら記事ページが開けない')
sample = retired[:3] + retired[-2:]
for s in sample:
    st, page = get(f'/news/{s}/')
    ok = '掲載を終了しました' in page
    print('過去記事', s, st, '空ページ化済み' if ok else '中身が残っている')
    if not ok:
        ng.append(f'過去記事 {s} が消えていない')

st, top = get('/')
if latest and latest.get('shun'):
    name = latest['shun']['ja']
    hit = f'{latest["shun"]["month"]}月は「{name}」' in top
    print('トップの商品欄', '最新の旬どらを表示' if hit else '古いまま')
    if not hit:
        ng.append('トップの商品欄の旬どらが古いまま')

print('結果:', '問題なし' if not ng else ' / '.join(ng))
sys.exit(1 if ng else 0)
