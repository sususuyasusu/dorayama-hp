#!/usr/bin/env python3
"""出店情報（lib/events.json）が、日付ごとに何を・どの印で出すかを一覧表示する点検用。"""
import json, os, datetime
B = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ev = json.load(open(os.path.join(B, 'lib', 'events.json'), encoding='utf-8'))
for e in ev:
    for k in ('show', 'start', 'end'):
        datetime.date.fromisoformat(e[k])
    assert e['show'] <= e['start'] <= e['end'], e['id']
    for lang in ('ja', 'en', 'zh', 'ko'):
        assert e[lang]['name'] and e[lang]['period'], (e['id'], lang)
for d in ['2026-11-18', '2026-12-19', '2026-12-20', '2027-01-19', '2027-01-20', '2027-01-26', '2027-01-27', '2027-04-04', '2027-04-05']:
    shown = [(e['ja']['name'], '催事中' if d >= e['start'] else '開催予定') for e in ev if e['show'] <= d <= e['end']]
    print(d, shown or '（表示なし）')
