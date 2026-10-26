"""all_posts.json を、加工担当に渡す入力ファイル（batch_1〜4.json）に分ける。
既に news_items/<code>.json がある投稿は入れない（新着だけ加工するため）。"""
import json, os, datetime, sys

HERE = os.path.dirname(os.path.abspath(__file__))
posts = json.load(open(os.path.join(HERE, 'raw', 'all_posts.json')))
done_dir = os.path.join(HERE, 'news_items')
os.makedirs(done_dir, exist_ok=True)
todo = [p for p in posts if not os.path.exists(os.path.join(done_dir, p['code'] + '.json'))]
n = int(sys.argv[1]) if len(sys.argv) > 1 else 4
os.makedirs(os.path.join(HERE, 'batches'), exist_ok=True)
for f in os.listdir(os.path.join(HERE, 'batches')):
    os.remove(os.path.join(HERE, 'batches', f))
size = (len(todo) + n - 1) // n if todo else 0
for i in range(n):
    part = todo[i * size:(i + 1) * size]
    if not part:
        continue
    rows = [{'code': p['code'],
             'date': datetime.datetime.fromtimestamp(p['taken_at']).strftime('%Y-%m-%d'),
             'kind': p.get('product') or p['type'],
             'image_count': len(p.get('images') or []),
             'caption': p['caption']} for p in part]
    json.dump(rows, open(os.path.join(HERE, 'batches', f'batch_{i + 1}.json'), 'w'), ensure_ascii=False, indent=1)
    print(f'batch_{i + 1}.json', len(rows), '件', rows[-1]['date'], '〜', rows[0]['date'])
