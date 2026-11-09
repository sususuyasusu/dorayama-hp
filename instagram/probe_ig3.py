"""調査用: 投稿ページから本文・日時・画像が取れるか確認する。"""
import os, sys, time, io, contextlib
sys.path.insert(0, os.path.expanduser('~/dw-safari'))
import sf  # noqa: E402
code = sys.argv[1]
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    sf.cmd_open(f'https://www.instagram.com/p/{code}/')
ref = buf.getvalue().strip().splitlines()[-1].split()[0]
sf.wait(ref); time.sleep(5)
print('OGDESC', sf.js(ref, "(document.querySelector('meta[property=\"og:description\"]')||{}).content||''")[:300])
print('OGIMG', sf.js(ref, "(document.querySelector('meta[property=\"og:image\"]')||{}).content||''")[:120])
print('TIME', sf.js(ref, "Array.from(document.querySelectorAll('time')).map(t=>t.getAttribute('datetime')).join(' ')"))
print('H1', sf.js(ref, "Array.from(document.querySelectorAll('h1')).map(h=>h.innerText).join(' || ')")[:600])
print('IMGS', sf.js(ref, "Array.from(document.querySelectorAll('article img, main img')).map(i=>i.naturalWidth+'x'+i.naturalHeight+' '+(i.alt||'').slice(0,20)).slice(0,8).join(' | ')"))
w, t = sf.parse(ref)
sf.osa(f'tell application "Safari" to close tab {t} of window id {w}')
