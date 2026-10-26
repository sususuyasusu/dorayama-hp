#!/bin/zsh
# 直近の make_bundle.sh で置いた zip 一式を、dorayama.com の更新口に取りに行かせる
set -e
cd ~/dorayama-hp
read SHA FILES < bundle_last.txt
[[ -z "$FILES" ]] && { echo "本番: 変わった束なし（送る物なし）"; exit 0; }
K=$(tr -d '\n' < .sync_secret)
echo "合言葉なしの呼び出し（断られるのが正常）: $(curl -s -o /dev/null -w '%{http_code}' 'https://dorayama.com/_sync.php?k=x')"
R=$(curl -s -m 900 "https://dorayama.com/_sync.php?k=$K&sha=$SHA&files=$FILES")
echo "本番の更新口: $(echo "$R" | tr '\n' ' ')"
[[ "$R" == ok* ]]
