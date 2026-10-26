#!/bin/zsh
# 組み立てた out/ を GitHub Pages（gh-pages ブランチ）へ公開する（試作確認用）
# 送るのは前回からの差分だけ（push_dir.sh）
set -e
cd ~/dorayama-hp
REPO=sususuyasusu/dorayama-hp
zsh build.sh
touch out/.nojekyll

# ソース一式を main へ
git add -A
git commit -qm "${1:-どら山HP 更新 $(date '+%Y-%m-%d %H:%M')}" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
for try in 1 2 3; do git push -q origin main 2>/dev/null && break; echo "main: 送信やり直し（${try}回目）"; sleep 10; done

# 書き出し結果を gh-pages へ（差分だけ）
zsh push_dir.sh ~/dorayama-hp/out gh-pages

# Pages を gh-pages から配信（初回のみ作成）
gh api repos/$REPO/pages >/dev/null 2>&1 || gh api -X POST repos/$REPO/pages -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null
echo "公開先: https://sususuyasusu.github.io/dorayama-hp/"
