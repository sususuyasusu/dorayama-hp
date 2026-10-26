"""logo-mark.png の形を生成り色（#ebe7df）で塗った画像を作る（ストーリー画像用）"""
from PIL import Image

src = Image.open('/Users/suzuki3/dorayama-hp/public/images/logo-mark.png').convert('RGBA')
a = src.getchannel('A')
a = a.crop(a.getbbox())
out = Image.new('RGBA', a.size, (0xeb, 0xe7, 0xdf, 255))
out.putalpha(a)
out.save('/Users/suzuki3/dorayama-hp/story/logo-mark-paper.png')
print('作成', out.size)
