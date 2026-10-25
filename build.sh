#!/bin/zsh
# 公開用に組み立てる（out/ に書き出し）
set -e
cd ~/dorayama-hp
export PATH=~/.local/node/bin:$PATH
rm -rf out .next
npm run build 2>&1 | grep -E "error|Error|✓ Generating|Failed" | grep -v "security vulnerability" || true
test -f out/index.html && echo "組み立て成功"
