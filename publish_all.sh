#!/bin/zsh
# お知らせデータを作り直し、試作確認用（GitHub Pages）と本番（dorayama.com）の両方へ公開する。
# 本番は、サーバーの更新口（_sync.php）が GitHub の bundle ブランチから自分で取りに行く。
# 使い方: publish_all.sh "変更の説明"
set -e
cd ~/dorayama-hp
# 同時に2つの公開が走ると途中の変更が混ざるため、順番待ちにする（2026-11-09 実際に混ざった）
LOCK=~/dorayama-hp/.publish.lock
for i in {1..120}; do
  mkdir $LOCK 2>/dev/null && break
  # 2時間以上前の鍵は前回の異常終了の残り物として外す
  [[ -n $(find $LOCK -maxdepth 0 -mmin +120 2>/dev/null) ]] && rmdir $LOCK && continue
  (( i == 1 )) && echo "他の公開が終わるのを待っています"
  sleep 15
done
[[ -d $LOCK ]] || { echo "公開の順番待ちが30分を超えたので中止"; exit 1; }
trap 'rmdir $LOCK 2>/dev/null' EXIT
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
