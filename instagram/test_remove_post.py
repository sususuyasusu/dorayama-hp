"""試験用: raw/all_posts.json から指定の投稿を一時的に外す（test_autopost_dry.sh が元に戻す）。"""
import json, os, sys
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'raw', 'all_posts.json')
d = json.load(open(p))
d = [x for x in d if x['code'] != sys.argv[1]]
json.dump(d, open(p, 'w'), ensure_ascii=False)
print('一時的に外した後の件数', len(d))
