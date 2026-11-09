#!/bin/zsh
# 本番と試作版の4言語で、お支払い欄と説明文に現金が載っているかを数える
for base in https://dorayama.com https://sususuyasusu.github.io/dorayama-hp; do
  for p in "" en/ zh/ ko/; do
    h=$(curl -s -m 30 "$base/$p?v=$RANDOM")
    n=$(print -r -- "$h" | grep -o -e '現金・クレジットカード・交通系IC' -e '店頭では現金のほか' -e 'Cash, credit cards, transit IC cards' -e 'accept cash, credit cards' -e '现金・信用卡・交通IC卡' -e '店内可使用现金' -e '현금・신용카드・교통계 IC카드' -e '매장에서는 현금' | wc -l | tr -d ' ')
    echo "$base/$p : 現金の記載 ${n}か所"
  done
done
