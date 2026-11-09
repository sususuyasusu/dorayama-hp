"""確認用: 変更前（git HEAD）のお知らせと今のお知らせを比べ、消えた記事が旬どらだけか、件数が合うかを見る。"""
import json, os, subprocess
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
old = json.loads(subprocess.run(['git', '-C', ROOT, 'show', 'HEAD:lib/news-data.json'], capture_output=True, text=True).stdout)
new = json.load(open(os.path.join(ROOT, 'lib', 'news-data.json')))
ret = json.load(open(os.path.join(ROOT, 'lib', 'retired-news.json')))
olds = {x['slug']: x for x in old}
news = {x['slug'] for x in new}
gone = [s for s in olds if s not in news]
print('変更前', len(old), '件 / 変更後', len(new), '件 / 消えた', len(gone), '件 / 削除扱いリスト', len(ret), '件')
print('変更前の旬どら', sum(1 for x in old if x['category'] == '旬どら'), '件（重複を除く', len({x['slug'] for x in old if x['category'] == '旬どら'}), '件）')
print('消えた中で旬どら以外:', [olds[s]['title'] for s in gone if olds[s]['category'] != '旬どら'])
print('消えたのにリストに無い:', [s for s in gone if s not in ret])
print('リストにあるのに残っている:', [s for s in ret if s in news])
