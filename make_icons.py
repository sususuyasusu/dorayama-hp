"""どら山ロゴ（logo-mark.png の形）から、ブラウザのタブ用アイコン一式を作る。
深緑の正方形に、生成り色のロゴを中央へ置く。"""
from PIL import Image

SRC = 'public/images/logo-mark.png'
GREEN = (0x12, 0x30, 0x1f, 255)
PAPER = (0xeb, 0xe7, 0xdf, 255)

mark = Image.open(SRC).convert('RGBA')
alpha = mark.getchannel('A')
bbox = alpha.getbbox()
alpha = alpha.crop(bbox)


def icon(size, ratio=0.78, rounded=False):
    im = Image.new('RGBA', (size, size), GREEN)
    w = int(size * ratio)
    h = int(alpha.height * w / alpha.width)
    a = alpha.resize((w, h), Image.LANCZOS)
    glyph = Image.new('RGBA', (w, h), PAPER)
    im.paste(glyph, ((size - w) // 2, (size - h) // 2), a)
    return im


icon(512).save('public/icon.png')
icon(180, 0.72).save('public/apple-icon.png')
icon(48).save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
print('アイコン作成: icon.png 512 / apple-icon.png 180 / favicon.ico')
