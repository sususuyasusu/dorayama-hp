# 背景用の「ザラザラ」質感画像（継ぎ目なく敷き詰められる粒＋ゆるいムラ）を作る
# 使い方: python3 make_grain.py <出力png> <サイズ> <粒の強さ> <ムラの強さ>
import sys
from PIL import Image, ImageChops, ImageFilter

out, size = sys.argv[1], int(sys.argv[2])
grain_sigma, mottle_amp = float(sys.argv[3]), float(sys.argv[4])

# 細かい粒（平均128のグレー）
grain = Image.effect_noise((size, size), grain_sigma)
grain = grain.filter(ImageFilter.GaussianBlur(0.35))

# ゆるいムラ: 小さなノイズを3x3に並べて拡大し中央を切り出す（端がつながる）
small = 24
m = Image.effect_noise((small, small), 40)
tile = Image.new('L', (small * 3, small * 3))
for i in range(3):
    for j in range(3):
        tile.paste(m, (i * small, j * small))
big = tile.resize((size * 3, size * 3), Image.BICUBIC).crop((size, size, size * 2, size * 2))
big = big.filter(ImageFilter.GaussianBlur(size / 64))
mottle = big.point(lambda v: int(128 + (v - 128) * mottle_amp))

# 粒とムラを合成（どちらも128中心）
img = ImageChops.add(grain, mottle, scale=1.0, offset=-128)
img.save(out, optimize=True)
print(out, img.size)
