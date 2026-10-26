#!/bin/zsh
# dorayama.com（サイトの一番上の階層）用に組み立てる → out_root/
set -e
cd ~/dorayama-hp
export PATH=~/.local/node/bin:$PATH
export NODE_OPTIONS="--dns-result-order=ipv4first"
export SITE_BASE='' NEXT_PUBLIC_SITE_BASE='' NEXT_PUBLIC_VIDEO_URL='https://sususuyasusu.github.io/dorayama-hp/video/top.mp4'
rm -rf out_root
zsh build.sh >/dev/null
test -f out/index.html
mv out out_root
chmod -R a+rX out_root
grep -q '/dorayama-hp' out_root/index.html && { echo "旧パスが残っています"; exit 1; }
echo "組み立て成功（dorayama.com用）: $(du -sh out_root | cut -f1)"
