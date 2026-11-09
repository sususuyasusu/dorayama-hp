#!/bin/zsh
# 試験: 11月の旬どら投稿を「まだ取り込んでいない」ことにして、自動投稿を試し運転（公開しない）。
# 終わったら取り込み済みの記録を元に戻し、元に戻ったことを件数とハッシュで確かめる。
cd ~/dorayama-hp/instagram
cp raw/all_posts.json .work/all_posts.backup.json
before=$(shasum raw/all_posts.json | cut -c1-12)
/usr/bin/python3 test_remove_post.py DfJf249kp_9
/usr/bin/python3 shun_autopost.py --dry
cp .work/all_posts.backup.json raw/all_posts.json
after=$(shasum raw/all_posts.json | cut -c1-12)
echo "取り込み記録 元に戻した: $before → $after $([[ $before == $after ]] && echo 一致 || echo 不一致)"
