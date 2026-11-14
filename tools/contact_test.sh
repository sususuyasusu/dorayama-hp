#!/bin/zsh
# お問い合わせ受付（public/api/contact.php）の攻撃を含む試験。メールは実際には送らない（試験用PHPには送信機能が無い）。
# 使い方: zsh tools/contact_test.sh <php-wasm-cli のあるフォルダ>
set -u
W=$1
export PATH=~/.local/node/bin:$PATH
# 試験用PHPは自分のフォルダの中しか触れないので、作業場所もその中に作る
T=$W/case_$$
rm -rf $T; mkdir -p $T
cp ~/dorayama-hp/tools/contact_case.php $T/
mkdir -p $T/public/api && cp ~/dorayama-hp/public/api/contact.php $T/public/api/
mkdir -p $T/tools && mv $T/contact_case.php $T/tools/
run() { (cd $W && npx php-wasm-cli $T/tools/contact_case.php $T "$@" 2>/dev/null) }
O=https://dorayama.com
OK='{"kind":"order","name":"試験 太郎","email":"test@example.com","tel":"03-1234-5678","message":"これは試験の送信です。","agree":"1","ticket":"MAKE"}'
pass=0; fail=0
check() { if print -r -- "$2" | grep -q -- "$3"; then echo "合格: $1"; pass=$((pass+1)); else echo "不合格: $1 → $2"; fail=$((fail+1)); fi }

check "受付票を渡す" "$(run GET '' '{"ticket":"1"}')" '"ticket":"'
check "よそのサイトからは断る" "$(run POST https://evil.example "$OK" 10)" '"error":"origin"'
check "罠の欄が埋まっていたら何もせず受付済みのふり" "$(run POST $O '{"website":"http://spam","ticket":"x"}')" '{"ok":true}'
check "表示から3秒未満の送信は断る" "$(run POST $O "$OK" 0)" '"error":"ticket"'
check "古すぎる受付票は断る" "$(run POST $O "$OK" 9000)" '"error":"ticket"'
check "正しい送信は受け付ける（試験なのでメールは送らない）" "$(run POST $O "$OK" 10)" '"dry_run":true'
check "同じ受付票は二度使えない" "$(run POST $O "${OK/MAKE/LAST}")" '"error":"ticket"'
check "メールの見出しを書き換える細工は断る" "$(run POST $O '{"kind":"order","name":"x","email":"a@example.com\r\nBcc: victim@example.com","message":"hello hello","agree":"1","ticket":"MAKE"}' 10)" '"email"'
check "決まっていない種類は断る" "$(run POST $O '{"kind":"<script>","name":"x","email":"a@example.com","message":"hello hello","agree":"1","ticket":"MAKE"}' 10)" '"kind"'
check "リンクだらけの宣伝は断る" "$(run POST $O '{"kind":"other","name":"x","email":"a@example.com","message":"http://a http://b http://c","agree":"1","ticket":"MAKE"}' 10)" '"spam"'
check "同意が無いと断る" "$(run POST $O '{"kind":"other","name":"x","email":"a@example.com","message":"hello hello","ticket":"MAKE"}' 10)" '"agree"'
run POST $O "$OK" 10 >/dev/null
run POST $O "$OK" 10 >/dev/null
check "同じ所からの連投（10分に4回目）は断る" "$(run POST $O "$OK" 10)" '"error":"rate"'
check "控えは本人だけが読める権限" "$(stat -f %Lp $T/dorayama_contact/inbox.jsonl)" '^600$'
check "控えに受け付けた内容が残る" "$(cat $T/dorayama_contact/inbox.jsonl | head -1)" '試験 太郎'
check "合言葉は公開フォルダの外" "$(ls $T/www 2>/dev/null | wc -l | tr -d ' ')" '^0$'
echo "合格 $pass ／ 不合格 $fail"
rm -rf $T
