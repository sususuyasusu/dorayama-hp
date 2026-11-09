"""news_items/*.json（Instagram投稿を加工したもの）と manual_news.json（手で書いたお知らせ）から、
サイトが読む lib/news-data.json を作る。新しい順に並べる。"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
items = []
for f in os.listdir(os.path.join(HERE, 'news_items')):
    if not f.endswith('.json'):
        continue
    it = json.load(open(os.path.join(HERE, 'news_items', f)))
    if not it.get('publish'):
        continue
    code = it['code']
    if not os.path.exists(os.path.join(ROOT, 'public', 'images', 'ig', code + '.jpg')):
        continue
    items.append({
        'slug': code,
        'date': it['date'],
        'category': it.get('category') or 'その他',
        'title': it['title'],
        'body': it.get('body') or [],
        'image': f'images/ig/{code}.jpg',
        'alt': it['title'],
        'media': it.get('media'),
        'instagram': f'https://www.instagram.com/p/{code}/',
        'i18n': {k: it[k] for k in ('en', 'zh', 'ko') if it.get(k)},
        'shun': it.get('shun'),
    })
manual = json.load(open(os.path.join(HERE, 'manual_news.json')))
items.extend(manual)
items.sort(key=lambda x: (x['date'], x['slug']), reverse=True)

# 旬どらは最新の1件だけ載せる（2026-11-09 本人指示: 過去の旬どらのお知らせは自動で削除）。
# 外した記事は lib/retired-news.json に残し、組み立て後に retire_pages.py が本番の古いページを消す。
RETIRED = os.path.join(ROOT, 'lib', 'retired-news.json')
retired = set(json.load(open(RETIRED))) if os.path.exists(RETIRED) else set()
kept, latest_shun = [], None
for x in items:
    if x['category'] == '旬どら':
        if latest_shun is None:
            latest_shun = x
        else:
            retired.add(x['slug'])
            continue
    kept.append(x)
retired -= {x['slug'] for x in kept}
items = kept
json.dump(sorted(retired), open(RETIRED, 'w'), ensure_ascii=False, indent=1)
json.dump(items, open(os.path.join(ROOT, 'lib', 'news-data.json'), 'w'), ensure_ascii=False, indent=1)
media = [i for i in items if i.get('media')]
print(f'お知らせ {len(items)} 件（うちメディア掲載 {len(media)} 件）を lib/news-data.json に書き出し')
print(f'旬どらは最新1件のみ: {latest_shun["title"] if latest_shun else "なし"}（過去分 {len(retired)} 件は削除扱い）')
