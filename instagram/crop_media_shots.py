"""Instagramストーリーズの画面写真から、上部の帯（アカウント名・再生バー）を除いて
メディア掲載のお知らせ用写真として保存する（public/images/media/）。"""
import os
from PIL import Image

SRC = '/private/tmp/claude-501/-Users-suzuki3-Library-CloudStorage-Dropbox-Detale-D--W-------/b03f0e7f-9bcd-4a70-99d1-3d26be6d0239/images'
OUT = os.path.expanduser('~/dorayama-hp/public/images/media')
os.makedirs(OUT, exist_ok=True)
# 元画像, 保存名, 切り出し範囲（左, 上, 右, 下）
JOBS = [
    ('1.jpg', 'josei-jishin.jpg', (35, 330, 1110, 1500)),
    ('2.jpg', 'super-j-channel.jpg', (330, 615, 1143, 1342)),
    ('3.jpg', 'new-japan-branding.jpg', (112, 400, 1103, 1235)),
]
for src, dst, box in JOBS:
    im = Image.open(os.path.join(SRC, src)).convert('RGB').crop(box)
    im.thumbnail((1000, 1600))
    im.save(os.path.join(OUT, dst), quality=82)
    os.chmod(os.path.join(OUT, dst), 0o644)
    print(dst, im.size)
