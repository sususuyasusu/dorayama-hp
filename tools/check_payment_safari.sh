#!/bin/zsh
# Safariで本番の4言語ページを開き、画面に描かれた店舗情報のお支払い欄と説明文を読み取る
for p in "" en/ zh/ ko/; do
  R=$(python3 ~/dw-safari/sf.py open "https://dorayama.com/$p?v=$RANDOM" | tail -1)
  sleep 6
  echo "/$p $(python3 ~/dw-safari/sf.py js "$R" ~/dorayama-hp/tools/read_payment.js)"
  python3 ~/dw-safari/sf.py close "$R" >/dev/null 2>&1
done
