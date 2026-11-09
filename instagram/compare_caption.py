"""確認用: 新方式で読んだ投稿（/tmp/ig_one.json）と、以前の方式で保存済みの本文（raw/all_posts.json）を比べる。"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
one = json.load(open('/tmp/ig_one.json'))[0]
old = {p['code']: p for p in json.load(open(os.path.join(HERE, 'raw', 'all_posts.json')))}[one['code']]
a, b = one['caption'].strip(), old['caption'].strip()
print('新方式の本文', len(a), '字 / 保存済み', len(b), '字 / 一致' if a == b else '/ 不一致')
if a != b:
    i = next((k for k in range(min(len(a), len(b))) if a[k] != b[k]), min(len(a), len(b)))
    print('最初の違い', i, '字目: 新', repr(a[i-20:i+40]), ' 旧', repr(b[i-20:i+40]))
print('日時 新', one['taken_at'], '旧', old['taken_at'])
print('写真', (one['images'] or ['なし'])[0][:90])
