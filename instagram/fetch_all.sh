#!/bin/zsh
# Safari（Instagramにログイン済み）で @dorayama_jp の投稿を全ページ取得し、raw/ にページごとのJSONで保存する。
# 使い方: fetch_all.sh [最大ページ数]   （新着だけなら 1）
set -e
cd ~/dorayama-hp/instagram
MAXP=${1:-20}
rm -rf raw && mkdir -p raw
R=$(python3 ~/dw-safari/sf.py open "https://www.instagram.com/dorayama_jp/" | tail -1)
sleep 3
for i in $(seq 1 $MAXP); do
  python3 ~/dw-safari/sf.py js "$R" ig_fetch_page.js >/dev/null
  out=""
  for t in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1.5
    out=$(python3 ~/dw-safari/sf.py js "$R" ig_read.js)
    [[ -n "$out" ]] && break
  done
  print -r -- "$out" > raw/page_$i.json
  python3 page_info.py raw/page_$i.json || { python3 ~/dw-safari/sf.py close "$R" >/dev/null 2>&1; exit 1; }
  grep -q '"more":true' raw/page_$i.json || break
  sleep 2
done
python3 ~/dw-safari/sf.py close "$R" >/dev/null 2>&1 || true
