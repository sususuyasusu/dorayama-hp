"""Safariで instagram.com を開き、ログイン状態と取得口の応答の頭を表示する（調査用）。"""
import os, sys, time
sys.path.insert(0, os.path.expanduser('~/dw-safari'))
import sf  # noqa: E402
import io, contextlib
buf = io.StringIO()
with contextlib.redirect_stdout(buf):
    sf.cmd_open('https://www.instagram.com/dorayama_jp/')
ref = buf.getvalue().strip().splitlines()[-1].split()[0]
sf.wait(ref); time.sleep(5)
print('URL', sf.js(ref, 'location.href'))
print('TITLE', sf.js(ref, 'document.title'))
print('COOKIE ds_user_id', sf.js(ref, 'String(/ds_user_id/.test(document.cookie))'))
sf.js(ref, "window.__P=null;fetch('/api/v1/users/web_profile_info/?username=dorayama_jp',{headers:{'x-ig-app-id':'936619743392459'},credentials:'include'}).then(r=>r.text().then(t=>{window.__P=r.status+' '+t.slice(0,200)}));'s'")
for _ in range(10):
    time.sleep(1.5)
    v = sf.js(ref, 'window.__P||""')
    if v:
        print('API', v); break
print('BODY', sf.js(ref, 'document.body.innerText.slice(0,300)').replace('\n', ' / '))
w, t = sf.parse(ref)
sf.osa(f'tell application "Safari" to close tab {t} of window id {w}')
