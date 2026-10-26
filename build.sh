#!/bin/zsh
# 公開用に組み立てる（out/ に書き出し）
# Googleフォントの取得がまれに失敗するので、最大3回までやり直す
set -e
cd ~/dorayama-hp
export PATH=~/.local/node/bin:$PATH
export NODE_OPTIONS="--dns-result-order=ipv4first"
for try in 1 2 3; do
  rm -rf out .next
  npm run build 2>&1 | grep -E "error|Error|✓ Generating|Failed" | grep -v "security vulnerability" | sort -u || true
  [[ -f out/index.html ]] && break
  echo "組み立て失敗（${try}回目）。やり直します"
  sleep 5
done
test -f out/index.html && echo "組み立て成功"
