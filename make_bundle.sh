#!/bin/zsh
# dorayama.com 用の版（out_root/）を、さくらへ送る zip 3つにまとめ、
# GitHub の bundle ブランチへ置く（さくらの管理画面から取りに行くため）
set -e
cd ~/dorayama-hp
test -f out_root/index.html
T=$(mktemp -d)
cd out_root
zip -qrX "$T/site_main.zip" . -x 'images/*' -x 'video/*'
zip -qrX "$T/site_images.zip" images
zip -qrX "$T/site_video.zip" video
cd "$T"
ls -l *.zip | awk '{printf "%s %.1fMB\n", $9, $5/1048576}'
git init -q -b bundle
git add -A
git commit -qm "dorayama.com 送付用 $(date '+%Y-%m-%d %H:%M')"
git push -qf https://github.com/sususuyasusu/dorayama-hp.git bundle
cd ~/dorayama-hp
rm -rf "$T"
echo "置き場: https://raw.githubusercontent.com/sususuyasusu/dorayama-hp/bundle/"
