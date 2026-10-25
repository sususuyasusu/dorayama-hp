#!/bin/zsh
# 背景を炭色から深い緑へ（在庫アプリの #1d5b37 と同系統のさらに深い緑）
set -e
cd ~/dorayama-hp
sed -i '' \
  -e 's/#121212/#12301f/g' \
  -e 's/#9a958c/#a3ad9f/g' \
  -e 's/#1a1612 0%, #0e0d0c 100%/#1a3d29 0%, #0c2216 100%/' \
  app/globals.css
sed -i '' 's/#121212/#12301f/g' app/layout.tsx
sed -i '' 's#bg-black/45#bg-[\#0a1d12]/50#' components/site/intro-section.tsx
grep -rn "121212" app components lib || echo "炭色の残りなし"
