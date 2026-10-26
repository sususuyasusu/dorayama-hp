#!/bin/zsh
# 公開用に組み立てる（out/ に書き出し）
# Googleフォントは一度取れたら .next/cache に取り置いて使い回す（回線が遅くても組み立てが止まらないように）。
# 取得がまれに失敗するので、最大5回までやり直す（取れた分は取り置かれるので回を追うごとに通りやすくなる）
set -e
cd ~/dorayama-hp
export PATH=~/.local/node/bin:$PATH
export NODE_OPTIONS="--dns-result-order=ipv4first"
for try in 1 2 3 4 5; do
  rm -rf out
  [[ -d .next ]] && find .next -mindepth 1 -maxdepth 1 ! -name cache -exec rm -rf {} +
  npm run build 2>&1 | grep -E "error|Error|✓ Generating|Failed" | grep -v -e "security vulnerability" -e "timed out when requesting" | sort -u || true
  [[ -f out/index.html ]] && break
  echo "組み立て失敗（${try}回目）。やり直します"
  sleep 5
done
test -f out/index.html && echo "組み立て成功"
