#!/bin/zsh
# dorayama.com 用の版（out_root/）を、さくらの更新口（_sync.php）が取りに行く zip に分けて
# GitHub の bundle ブランチへ置く。中身が前回と同じ zip は作り直さず、送らない（回線の節約）。
# 最後に「コミット番号 今回変わったファイル名,…」を bundle_last.txt に書く（sakura_sync.sh が読む）。
set -e
cd ~/dorayama-hp
test -f out_root/index.html
B=~/dorayama-hp/.deploy/bundle_src
mkdir -p $B
changed=()

# 名前, 対象（out_root からの相対）, 除外
pack() {
  local name=$1; shift
  local list=$(mktemp)
  (cd out_root && eval "find $* -type f -print" | sed "s:^\./::" | LC_ALL=C sort) > $list
  local sum=$( (cd out_root && tr "\n" "\0" < $list | xargs -0 shasum -a 1) | shasum -a 1 | cut -c1-40)
  if [[ -f $B/$name.sent && "$(cat $B/$name.sent)" == "$sum" && -f $B/$name ]]; then
    rm $list; return
  fi
  rm -f $B/$name
  (cd out_root && zip -qX $B/$name -@ < $list)
  echo $sum > $B/$name.sum
  rm $list
  changed+=($name)
}

pack site_main.zip ". -path ./images -prune -o -path ./video -prune -o"
pack site_images.zip "images -path images/ig -prune -o"
pack site_video.zip "video"
# Instagram 写真は投稿コードの順に60枚ずつ（新しい投稿が増えても古い束は変わりにくい）
ls out_root/images/ig | LC_ALL=C sort > $B/iglist.txt
rm -f $B/igpart_*(N)
split -l 60 $B/iglist.txt $B/igpart_
i=1
for l in $B/igpart_*; do
  pack site_ig$i.zip "$(sed 's#^#images/ig/#' $l | tr '\n' ' ')"
  i=$((i + 1))
done
rm -f $B/igpart_*(N) $B/iglist.txt
# 使われなくなった束は消す
for z in $B/site_ig*.zip(N); do
  n=${${z:t}#site_ig}; n=${n%.zip}
  (( n >= i )) && rm -f $z $z.sum
done

mkdir -p ~/dorayama-hp/.deploy/bundle_out
rsync -a --delete --include '*.zip' --exclude '*' $B/ ~/dorayama-hp/.deploy/bundle_out/
zsh push_dir.sh ~/dorayama-hp/.deploy/bundle_out bundle
SHA=$(cat ~/dorayama-hp/.deploy/bundle.sha)
FILES=${(j:,:)changed}
echo "$SHA $FILES" > bundle_last.txt
echo "置き場: ${SHA:0:7} / 今回変わった束: ${FILES:-なし}"
