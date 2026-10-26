#!/bin/zsh
# dorayama.com 用の版（out_root/）を、さくらへ送る zip に分けて GitHub の bundle ブランチへ置く。
# 1つ25MB未満に収める（さくらのアップロード上限）。Instagram写真は60枚ずつに分ける。
# 最後に「コミット番号 ファイル名,ファイル名…」を bundle_last.txt に書く（_sync.php 呼び出し用）。
set -e
cd ~/dorayama-hp
test -f out_root/index.html
T=$(mktemp -d)
cd out_root
zip -qrX "$T/site_main.zip" . -x 'images/*' -x 'video/*'
zip -qrX "$T/site_images.zip" images -x 'images/ig/*'
zip -qrX "$T/site_video.zip" video
i=1
ls images/ig | split -l 60 - "$T/iglist_"
for l in "$T"/iglist_*; do
  sed 's#^#images/ig/#' "$l" | zip -qX "$T/site_ig$i.zip" -@
  rm "$l"; i=$((i + 1))
done
cd "$T"
ls -l *.zip | awk '{printf "%s %.1fMB\n", $9, $5/1048576}'
git init -q -b bundle
git add -A
git commit -qm "dorayama.com 送付用 $(date '+%Y-%m-%d %H:%M')"
git push -qf https://github.com/sususuyasusu/dorayama-hp.git bundle 2>/dev/null
SHA=$(git rev-parse HEAD)
FILES=$(ls *.zip | paste -sd, -)
cd ~/dorayama-hp
rm -rf "$T"
echo "$SHA $FILES" > bundle_last.txt
echo "置き場: $SHA"
