"""確認用: 10/31時点（deea093）の旬どら記事のうち、削除扱いにも現在の掲載にも入っていないものを出す。"""
import json, os, subprocess
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
old = json.loads(subprocess.run(['git', '-C', ROOT, 'show', 'deea093:lib/news-data.json'], capture_output=True, text=True).stdout)
new = {x['slug']: x for x in json.load(open(os.path.join(ROOT, 'lib', 'news-data.json')))}
ret = set(json.load(open(os.path.join(ROOT, 'lib', 'retired-news.json'))))
shun = [x for x in old if x['category'] == '旬どら']
print('10/31時点の旬どら', len(shun), '件 / 全体', len(old), '件')
for x in shun:
    if x['slug'] not in ret and x['slug'] not in new:
        print('どちらにも無い:', x['slug'], x['title'])
    elif x['slug'] in new and new[x['slug']]['category'] != '旬どら':
        print('分類が変わって残っている:', x['slug'], x['title'], '→', new[x['slug']]['category'])
    elif x['slug'] in new:
        print('残っている:', x['slug'], x['title'])
gone_other = [x['title'] for x in old if x['slug'] not in new and x['category'] != '旬どら']
print('旬どら以外で消えたもの:', gone_other)
