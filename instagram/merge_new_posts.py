"""ブラウザで取った最新投稿（~/Downloads/dorayama_ig_latest*.json）を raw/all_posts.json に足す。
新しく増えた投稿コードを表示し、取り込んだダウンロードファイルは消す。"""
import glob, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ALL = os.path.join(HERE, 'raw', 'all_posts.json')
posts = json.load(open(ALL))
known = {p['code'] for p in posts}
new = []
for f in sorted(glob.glob(os.path.expanduser('~/Downloads/dorayama_ig_latest*.json'))):
    for p in json.load(open(f)):
        if p['code'] not in known:
            posts.append(p); known.add(p['code']); new.append(p['code'])
        else:
            # keep the newest caption (posts are sometimes corrected after publishing)
            for q in posts:
                if q['code'] == p['code'] and p.get('caption') and q.get('caption') != p['caption']:
                    q['caption'] = p['caption']; q['images'] = p['images']
                    old = os.path.join(HERE, 'news_items', p['code'] + '.json')
                    if os.path.exists(old):
                        os.rename(old, old + '.before_edit')
                    new.append(p['code'] + '（本文修正）')
    os.remove(f)
posts.sort(key=lambda p: p['taken_at'], reverse=True)
json.dump(posts, open(ALL, 'w'), ensure_ascii=False)
print('新しい投稿:', '、'.join(new) if new else 'なし', f'（全{len(posts)}件）')
