#!/bin/zsh
# ログインなしで @dorayama_jp の最新投稿が取れるか試す（件数と先頭の日時だけ表示）
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
OUT=/tmp/ig_probe.json
code=$(curl -s -m 30 -o $OUT -w '%{http_code}' -A "$UA" -H 'x-ig-app-id: 936619743392459' \
  'https://i.instagram.com/api/v1/users/web_profile_info/?username=dorayama_jp')
echo "応答 $code / $(wc -c < $OUT) バイト"
python3 ~/dorayama-hp/instagram/summarize_probe.py $OUT
