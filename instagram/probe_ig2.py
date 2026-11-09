"""調査用: プロフィール画面がスクロール時に使う問い合わせの名前と、画面上の投稿リンクを表示する。"""
import os, sys, time, io, contextlib
sys.path.insert(0, os.path.expanduser('~/dw-safari'))
import sf  # noqa: E402
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    sf.cmd_open('https://www.instagram.com/dorayama_jp/')
ref = buf.getvalue().strip().splitlines()[-1].split()[0]
sf.wait(ref); time.sleep(5)
print('LINKS', sf.js(ref, "Array.from(new Set(Array.from(document.querySelectorAll('a[href*=\"/p/\"],a[href*=\"/reel/\"]')).map(a=>a.getAttribute('href')))).slice(0,12).join(' ')"))
sf.js(ref, r"""
window.__N=[];
const oo=XMLHttpRequest.prototype.open, os=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open=function(m,u){this.__u=u;return oo.apply(this,arguments)};
XMLHttpRequest.prototype.send=function(b){try{window.__N.push('X '+this.__u+' '+(typeof b==='string'?(new URLSearchParams(b).get('fb_api_req_friendly_name')||''):''))}catch(e){};return os.apply(this,arguments)};
const of=window.fetch;window.fetch=function(u,o){try{var b=o&&o.body;window.__N.push('F '+(u.url||u)+' '+(typeof b==='string'?(new URLSearchParams(b).get('fb_api_req_friendly_name')||''):''))}catch(e){};return of.apply(this,arguments)};
(async()=>{for(let i=0;i<6;i++){window.scrollBy(0,2500);await new Promise(r=>setTimeout(r,1500))}})();'s'
""")
time.sleep(12)
print('REQ', sf.js(ref, "window.__N.slice(0,40).join('\\n')"))
w, t = sf.parse(ref)
sf.osa(f'tell application "Safari" to close tab {t} of window id {w}')
