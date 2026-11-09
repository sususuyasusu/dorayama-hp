"""削除扱いのお知らせ（lib/retired-news.json）の記事ページを、組み立て結果の中で
「お知らせ一覧へ移動するだけの空ページ」に置き換える。
本番の更新口は上書きしかできないため、古い記事は同じ場所を空ページで上書きして消す。
使い方: retire_pages.py 組み立てフォルダ（out または out_root）"""
import json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
retired = json.load(open(os.path.join(ROOT, 'lib', 'retired-news.json')))
STUB = ('<!doctype html><html lang="ja"><head><meta charset="utf-8">'
        '<meta name="robots" content="noindex">'
        '<meta http-equiv="refresh" content="0; url=../">'
        '<link rel="canonical" href="../"><title>お知らせ</title></head>'
        '<body><p>このお知らせは掲載を終了しました。<a href="../">お知らせ一覧へ</a></p></body></html>\n')

# 生きている記事ページ1つから、記事ページに含まれるファイル名の型を拾う
live = {}
for lang in ('', 'en', 'zh', 'ko'):
    news = os.path.join(OUT, lang, 'news')
    if not os.path.isdir(news):
        continue
    for d in os.listdir(news):
        p = os.path.join(news, d)
        if os.path.isdir(p) and os.path.exists(os.path.join(p, 'index.html')) and d not in retired:
            live[lang] = [f for f in os.listdir(p) if f.endswith('.txt')]
            break

n = 0
for lang, txts in live.items():
    for slug in retired:
        d = os.path.join(OUT, lang, 'news', slug)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, 'index.html'), 'w').write(STUB)
        for t in txts:
            open(os.path.join(d, t), 'w').write('')
        n += 1
print(f'削除扱いの記事ページ {len(retired)} 件 × {len(live)} 言語 = {n} 件を空ページに置き換え')
