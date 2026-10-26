// instagram.com/dorayama_jp/ を開いた Chrome のページ内で実行する（Claude in Chrome の javascript_tool から）。
// プロフィール画面が投稿一覧の読み込みに使う問い合わせを一度横取りし、同じ形で最新33件を取り直して
// ~/Downloads/dorayama_ig_latest.json として保存させる。Instagram の仕組みが変わったら、ここを直す。
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
  if (!base) return 'NG: 投稿一覧の問い合わせを捕まえられませんでした';
  const p = new URLSearchParams(base);
  const v = JSON.parse(p.get('variables'));
  v.after = null; v.first = 33; v.data.count = 33;
  p.set('variables', JSON.stringify(v));
  const r = await fetch('/api/graphql', { method: 'POST', body: p.toString(), headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-fb-friendly-name': 'PolarisProfilePostsTabContentQuery_connection' }, credentials: 'include' });
  const j = await r.json();
  const conn = j.data && j.data.xdt_api__v1__feed__user_timeline_graphql_connection;
  if (!conn) return 'NG: 応答に投稿がありません';
  const best = (c) => { const x = (c && c.image_versions2 && c.image_versions2.candidates) || []; return x.length ? x[0].url : null; };
  const items = conn.edges.map((e) => { const n = e.node; return { code: n.code, taken_at: n.taken_at, type: n.media_type, product: n.product_type, caption: n.caption ? n.caption.text : '', images: (n.carousel_media ? n.carousel_media.map(best) : [best(n)]).filter(Boolean), likes: n.like_count }; });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(items)], { type: 'application/json' }));
  a.download = 'dorayama_ig_latest.json';
  document.body.appendChild(a); a.click(); a.remove();
  return 'OK ' + items.length + '件 最新 ' + (items[0] ? items[0].code : '');
})();
