"""all_posts.json の各投稿の1枚目の画像を取得し、横1200pxのJPEGで public/images/ig/<投稿コード>.jpg に保存する。
既にあるものは取り直さない（毎回の自動更新でも新着分だけ取る）。"""
import json, os, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'raw', 'all_posts.json')
OUT = os.path.join(HERE, '..', 'public', 'images', 'ig')
os.makedirs(OUT, exist_ok=True)

posts = json.load(open(SRC))
got = skip = fail = 0
for p in posts:
    dst = os.path.join(OUT, p['code'] + '.jpg')
    if os.path.exists(dst):
        skip += 1
        continue
    if not p.get('images'):
        fail += 1
        continue
    tmp = dst + '.tmp'
    try:
        subprocess.run(['curl', '-4', '-s', '-f', '-m', '40', '-A', 'Mozilla/5.0', '-o', tmp, p['images'][0]], check=True)
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', '-Z', '1200', tmp, '--out', dst],
                       check=True, capture_output=True)
        os.chmod(dst, 0o644)
        got += 1
    except Exception as e:
        fail += 1
        print('取得失敗', p['code'], e, file=sys.stderr)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
print(f'画像: 新規 {got} / 既存 {skip} / 失敗 {fail}')
