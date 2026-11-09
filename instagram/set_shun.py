"""news_items/<code>.json に旬どら情報（月・各言語の商品名）を書き込む。
使い方: set_shun.py 投稿コード 月 日本語名 英語名 中国語名 韓国語名"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
code, month, ja, en, zh, ko = sys.argv[1:7]
p = os.path.join(HERE, 'news_items', code + '.json')
it = json.load(open(p))
it['shun'] = {'month': int(month), 'ja': ja, 'en': en, 'zh': zh, 'ko': ko}
json.dump(it, open(p, 'w'), ensure_ascii=False, indent=2)
print('保存した値:', json.load(open(p))['shun'])
