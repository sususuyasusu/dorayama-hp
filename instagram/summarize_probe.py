import json, sys, datetime
# web_profile_info の応答から、投稿数・取れた件数・先頭3件の日時と1行目を出す
try:
    d = json.load(open(sys.argv[1]))
except Exception as e:
    print('JSONでない応答', e); sys.exit()
u = d.get('data', {}).get('user') or {}
m = u.get('edge_owner_to_timeline_media', {})
print('総投稿数', m.get('count'), '/ 取れた件数', len(m.get('edges', [])), '/ 次ページあり', m.get('page_info', {}).get('has_next_page'))
for e in m.get('edges', [])[:3]:
    n = e['node']
    cap = (n.get('edge_media_to_caption', {}).get('edges') or [{'node': {'text': ''}}])[0]['node']['text']
    print(datetime.datetime.fromtimestamp(n['taken_at_timestamp']).strftime('%Y-%m-%d'), n['shortcode'], cap.split('\n')[0][:40])
