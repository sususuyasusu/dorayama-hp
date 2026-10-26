import json, sys, datetime
# 取得した1ページの件数と日付の範囲を1行で表示。失敗なら終了コード1
try:
    d = json.load(open(sys.argv[1]))
except Exception as e:
    print('読み取れない応答', sys.argv[1], e); sys.exit(1)
if 'error' in d:
    print('取得失敗', d['error']); sys.exit(1)
it = d.get('items', [])
if not it:
    print('0件'); sys.exit(0)
f = lambda t: datetime.datetime.fromtimestamp(t).strftime('%Y-%m-%d')
print(sys.argv[1].split('/')[-1], len(it), '件', f(it[-1]['taken_at']), '〜', f(it[0]['taken_at']), '続きあり' if d.get('more') else '最後')
