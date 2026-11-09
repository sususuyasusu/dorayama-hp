"""Safari（Instagramにログイン済み）で @dorayama_jp の最新投稿（最大33件）を取り、JSONで書き出す。
使い方: fetch_latest.py 出力ファイル
Instagram側の取得口（ig_fetch_page.js）が使えないときは、プロフィール画面の問い合わせを
横取りする方式（ig_latest_in_page.js と同じ考え方）に自動で切り替える。失敗は終了コード1。"""
import json, os, sys, time

sys.path.insert(0, os.path.expanduser('~/dw-safari'))
import sf  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]

FALLBACK = r"""
window.__IG_OUT = null;
(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let base = null;
  const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) { this.__u = u; return oo.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function (b) {
    if (!base && this.__u && String(this.__u).indexOf('/graphql') >= 0 && typeof b === 'string' && b.indexOf('PolarisProfilePostsTabContentQuery') >= 0) base = b;
    return os.apply(this, arguments);
  };
  for (let i = 0; i < 8 && !base; i++) { window.scrollBy(0, 2500); await sleep(1500); }
  XMLHttpRequest.prototype.open = oo; XMLHttpRequest.prototype.send = os;
  if (!base) { window.__IG_OUT = JSON.stringify({ error: 'no profile query' }); return; }
  const p = new URLSearchParams(base);
  const v = JSON.parse(p.get('variables'));
  v.after = null; v.first = 33; if (v.data) v.data.count = 33;
  p.set('variables', JSON.stringify(v));
  const r = await fetch('/api/graphql', { method: 'POST', body: p.toString(), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-fb-friendly-name': 'PolarisProfilePostsTabContentQuery_connection' }, credentials: 'include' });
  const j = await r.json();
  const conn = j.data && j.data.xdt_api__v1__feed__user_timeline_graphql_connection;
  if (!conn) { window.__IG_OUT = JSON.stringify({ error: 'no posts in reply' }); return; }
  const best = (c) => { const x = (c && c.image_versions2 && c.image_versions2.candidates) || []; return x.length ? x[0].url : null; };
  const items = conn.edges.map((e) => { const n = e.node; return { code: n.code, taken_at: n.taken_at, type: n.media_type, product: n.product_type, caption: n.caption ? n.caption.text : '', images: (n.carousel_media ? n.carousel_media.map(best) : [best(n)]).filter(Boolean), likes: n.like_count }; });
  window.__IG_OUT = JSON.stringify({ items: items });
})().catch(function (e) { window.__IG_OUT = JSON.stringify({ error: String(e) }); });
'started';
"""


def run(ref, code, wait=40):
    sf.js(ref, code)
    for _ in range(int(wait / 1.5)):
        time.sleep(1.5)
        out = sf.js(ref, 'window.__IG_OUT || ""').strip()
        if out:
            try:
                return json.loads(out)
            except Exception as e:
                return {'error': f'unreadable {e}'}
    return {'error': 'timeout'}


def main():
    ref = None
    try:
        import io, contextlib
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            sf.cmd_open('https://www.instagram.com/dorayama_jp/')
        ref = buf.getvalue().strip().splitlines()[-1].split()[0]
        sf.wait(ref)
        time.sleep(4)
        d = run(ref, open(os.path.join(HERE, 'ig_fetch_page.js')).read())
        if 'error' in d or not d.get('items'):
            first = d.get('error', '0件')
            d = run(ref, FALLBACK, wait=60)
            if 'error' in d or not d.get('items'):
                print(f'取得失敗: 方式1={first} 方式2={d.get("error", "0件")}')
                return 1
        items = d['items']
        for it in items:
            it['taken_at'] = str(it['taken_at'])
        json.dump(items, open(OUT, 'w'), ensure_ascii=False)
        print(f'取得 {len(items)}件 最新 {items[0]["code"]}')
        return 0
    finally:
        if ref:
            try:
                w, t = sf.parse(ref)
                sf.osa(f'tell application "Safari" to close tab {t} of window id {w}')
            except Exception:
                pass


if __name__ == '__main__':
    sys.exit(main())
