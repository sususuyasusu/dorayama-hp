#!/bin/zsh
# V0の書き出しを GitHub Pages（/dorayama-hp/）向けに整え、写真を組み込む
set -e
cd ~/dorayama-hp
# 写真を public/images へ
mkdir -p public/images
cp "/Users/suzuki3/Library/CloudStorage/Dropbox-Detale/D& W/どら山/HP制作_v0/site_images/"* public/images/
# 写真の参照を相対パスに（/dorayama-hp/ 配下でも表示されるように）
for f in components/site/*.tsx; do
  sed -i '' -e "s#'/images/#'images/#g" -e 's#"/images/#"images/#g' "$f"
done
# Vercel専用のアクセス解析を外す（GitHub Pagesでは動かない）
sed -i '' -e "/@vercel\/analytics/d" -e "/<Analytics \/>/d" app/layout.tsx
# 公開先のパスを設定
if ! grep -q basePath next.config.mjs; then
  sed -i '' "s#output: 'export',#output: 'export',\n  basePath: '/dorayama-hp',\n  trailingSlash: true,#" next.config.mjs
fi
rm -rf out .next
echo "images: $(ls public/images | wc -l)"
grep -rn "/images/" components app | grep -v "images/'" | head
