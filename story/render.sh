#!/bin/zsh
# ストーリー用HTMLを 1080×1920 のPNGに書き出す（本人のChromeとは別の使い捨てプロファイルで描画）
set -e
cd ~/dorayama-hp/story
IN=${1:-story_hp_open.html}
OUT=${IN:r}.png
P=$(mktemp -d)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir="$P" --force-device-scale-factor=1 --window-size=1080,1920 \
  --virtual-time-budget=8000 --screenshot="$PWD/$OUT" "file://$PWD/$IN" >/dev/null 2>&1
rm -rf "$P"
sips -g pixelWidth -g pixelHeight "$OUT" | grep pixel | tr '\n' ' '; echo
echo "書き出し: ~/dorayama-hp/story/$OUT"
