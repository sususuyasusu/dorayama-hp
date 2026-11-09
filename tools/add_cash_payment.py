"""店舗情報の「お支払い」と説明文に現金を加える（4言語）。各置換がちょうど1か所にあることを確かめてから書き換える。"""
import os

F = os.path.expanduser('~/dorayama-hp/lib/i18n.ts')
REPL = [
    ("payment: 'クレジットカード・交通系IC'", "payment: '現金・クレジットカード・交通系IC'"),
    ('店頭ではクレジットカードと交通系ICがご利用いただけます', '店頭では現金のほか、クレジットカードと交通系ICがご利用いただけます'),
    ("payment: 'Credit cards, transit IC cards'", "payment: 'Cash, credit cards, transit IC cards'"),
    ('in the shop we accept credit cards and transit IC cards', 'in the shop we accept cash, credit cards and transit IC cards'),
    ("payment: '信用卡・交通IC卡'", "payment: '现金・信用卡・交通IC卡'"),
    ('店内可使用信用卡和交通IC卡', '店内可使用现金、信用卡和交通IC卡'),
    ("payment: '신용카드・교통계 IC카드'", "payment: '현금・신용카드・교통계 IC카드'"),
    ('매장에서는 신용카드와 교통계 IC카드를 이용하실 수 있습니다', '매장에서는 현금, 신용카드, 교통계 IC카드를 이용하실 수 있습니다'),
]
s = open(F, encoding='utf-8').read()
for old, new in REPL:
    n = s.count(old)
    if n != 1:
        raise SystemExit(f'見つからない／複数: {old}（{n}件）')
    s = s.replace(old, new)
open(F, 'w', encoding='utf-8').write(s)
print(f'{len(REPL)}か所を書き換えました')
