#!/bin/zsh
# お知らせデータを作り直し、試作確認用（GitHub Pages）と本番（dorayama.com）の両方へ公開する。
# 本番は、サーバーの更新口（_sync.php）が GitHub の bundle ブランチから自分で取りに行く。
# 使い方: publish_all.sh "変更の説明"
set -e
cd ~/dorayama-hp
python3 instagram/download_images.py
python3 instagram/build_news.py
python3 instagram/check_items.py | sed -n '1,3p'
zsh deploy.sh "${1:-お知らせ更新 $(date '+%Y-%m-%d %H:%M')}" | tail -1
zsh build_root.sh
zsh make_bundle.sh | tail -1
zsh sakura_sync.sh || { echo "本番への反映に失敗しました"; exit 1; }
sleep 2
code=$(curl -s -o /dev/null -w '%{http_code}' https://dorayama.com/)
echo "dorayama.com 応答: $code"
