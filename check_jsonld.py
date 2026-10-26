"""公開中の記事ページから記事情報（構造化データ）を取り出し、必要な項目がそろっているか確かめる。
使い方: python3 check_jsonld.py URL [URL...]"""
import json, re, subprocess, sys

NEED = ['headline', 'datePublished', 'image', 'publisher', 'author', 'mainEntityOfPage', 'inLanguage']
for url in sys.argv[1:]:
    html = subprocess.run(['curl', '-s', '-m', '30', url], capture_output=True, text=True).stdout
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    kinds, ok = [], True
    for b in blocks:
        try:
            data = json.loads(b)
        except Exception as e:
            print(url, '読めない構造化データ', e); ok = False; continue
        for d in (data if isinstance(data, list) else [data]):
            kinds.append(d.get('@type'))
            if d.get('@type') == 'NewsArticle':
                miss = [k for k in NEED if not d.get(k)]
                if miss:
                    ok = False; print(url, '足りない項目', miss)
                print(url.replace('https://dorayama.com', ''), '|', d['inLanguage'], '|', d['datePublished'][:10], '|', d['headline'][:30])
    print('  種類:', ', '.join(map(str, kinds)), '→', 'OK' if ok and 'NewsArticle' in kinds else 'NG')
