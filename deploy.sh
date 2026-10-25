#!/bin/zsh
# 組み立てた out/ を GitHub Pages（gh-pages ブランチ）へ公開する
set -e
cd ~/dorayama-hp
REPO=sususuyasusu/dorayama-hp
zsh build.sh
touch out/.nojekyll

# ソース一式を main へ
if [[ ! -d .git ]]; then
  git init -q -b main
  printf "\nnode_modules/\n.next/\nout/\n_preview/\n" >> .gitignore
fi
git add -A
git commit -qm "${1:-どら山HP 更新 $(date '+%Y-%m-%d %H:%M')}" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
if ! gh repo view $REPO >/dev/null 2>&1; then
  gh repo create $REPO --public --description "門仲どらやき どら山 公式HP" --source . --push -r origin >/dev/null
else
  git remote get-url origin >/dev/null 2>&1 || git remote add origin https://github.com/$REPO.git
  git push -q origin main
fi

# 書き出し結果を gh-pages へ
T=$(mktemp -d)
cp -R out/. "$T"
cd "$T"
git init -q -b gh-pages
git add -A
git commit -qm "公開 $(date '+%Y-%m-%d %H:%M')"
git push -qf https://github.com/$REPO.git gh-pages
cd ~/dorayama-hp
rm -rf "$T"

# Pages を gh-pages から配信（初回のみ作成）
gh api repos/$REPO/pages >/dev/null 2>&1 || gh api -X POST repos/$REPO/pages -f "source[branch]=gh-pages" -f "source[path]=/" >/dev/null
echo "公開先: https://sususuyasusu.github.io/dorayama-hp/"
