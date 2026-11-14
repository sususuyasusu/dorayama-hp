#!/bin/zsh
# 本番のお問い合わせフォームに、試験と分かる1件を送って、店のメールに届くかを確かめる（2026-11-14）
# 使い方: zsh tools/contact_live_check.sh
set -e
T=$(curl -s "https://dorayama.com/api/contact.php?ticket=1" | python3 -c 'import sys,json;print(json.load(sys.stdin)["ticket"])')
sleep 4
curl -s -X POST "https://dorayama.com/api/contact.php" \
  -H "Origin: https://dorayama.com" \
  --data-urlencode "ticket=$T" \
  --data-urlencode "kind=other" \
  --data-urlencode "name=【試験】Claude（フォームの動作確認）" \
  --data-urlencode "email=formtest@example.com" \
  --data-urlencode "message=【テスト送信】公式サイトのお問い合わせフォームの動作確認です。返信は不要です。" \
  --data-urlencode "agree=1"
echo
