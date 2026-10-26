#!/bin/zsh
# フォルダの中身を GitHub のブランチへ「差分だけ」送る。
# 使い方: push_dir.sh 送るフォルダ ブランチ名
# 作業用の写し（.deploy/<ブランチ名>）を残しておき、前回からの変更分だけをコミットして送る。
# 全部を毎回送り直すと回線が遅いときに途中で切れるため。
set -e
SRC=$1
BRANCH=$2
REPO=https://github.com/sususuyasusu/dorayama-hp.git
W=~/dorayama-hp/.deploy/$BRANCH
mkdir -p ~/dorayama-hp/.deploy
if [[ ! -d $W/.git ]]; then
  rm -rf $W
  git clone -q --depth 1 --branch $BRANCH $REPO $W 2>/dev/null || { mkdir -p $W && git -C $W init -q -b $BRANCH && git -C $W remote add origin $REPO; }
fi
rsync -a --delete --exclude .git "$SRC"/ "$W"/
cd $W
git add -A
if git diff --cached --quiet; then
  echo "$BRANCH: 変更なし"
else
  git commit -qm "公開 $(date '+%Y-%m-%d %H:%M')"
  ok=0
  for try in 1 2 3; do
    # 履歴が合わない（以前に丸ごと送り直した）ときもあるので上書きで送る（このブランチは公開専用）
    if git push -qf origin $BRANCH 2>/dev/null; then ok=1; break; fi
    echo "$BRANCH: 送信に失敗（${try}回目）。やり直します"; sleep 10
  done
  [[ $ok == 1 ]] || { echo "$BRANCH: 送信できませんでした"; exit 1; }
  echo "$BRANCH: 送信済み $(git rev-parse --short HEAD)"
fi
git rev-parse HEAD > ~/dorayama-hp/.deploy/$BRANCH.sha
