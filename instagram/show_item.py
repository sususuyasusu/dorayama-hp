"""指定した投稿コードの、元の投稿文と加工結果を並べて表示する（確認用）"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
posts = {p['code']: p for p in json.load(open(os.path.join(HERE, 'raw', 'all_posts.json')))}
for code in sys.argv[1:]:
    print('=====', code)
    print('[元の投稿]'); print(posts[code]['caption'][:700])
    it = json.load(open(os.path.join(HERE, 'news_items', code + '.json')))
    print('[加工後]', it.get('category'), '|', it.get('title'))
    for b in it.get('body', []):
        print('  ', b)
    print('  media:', it.get('media'))
    print('  en:', (it.get('en') or {}).get('title'))
