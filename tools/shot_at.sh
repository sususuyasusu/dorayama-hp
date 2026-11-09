#!/bin/zsh
# Safariで URL を開き、指定の要素まで移動して撮影する。 使い方: shot_at.sh URL 要素ID 出力PNG [待ち秒]
R=$(python3 ~/dw-safari/sf.py open "$1" | tail -1)
sleep ${4:-8}
if [[ -n "$2" && "$2" != "-" ]]; then
  python3 ~/dw-safari/sf.py js "$R" -e "var e=document.getElementById('$2');if(e){e.scrollIntoView({block:'start'});window.scrollBy(0,700);}'ok'" >/dev/null
  sleep 3
fi
python3 ~/dw-safari/sf.py shot "$R" "$3" >/dev/null
python3 ~/dw-safari/sf.py close "$R" >/dev/null 2>&1
echo "$3"
