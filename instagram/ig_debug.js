// 取得のどこで失敗するかを調べる（応答コードと先頭の文字を window.__IG_OUT に置く）
window.__IG_OUT = null;
(async function () {
  var H = { 'x-ig-app-id': '936619743392459', 'x-requested-with': 'XMLHttpRequest' };
  var r1 = await fetch('/api/v1/feed/user/dorayama_jp/username/?count=12', { headers: H, credentials: 'include' });
  var t1 = await r1.text();
  var uid = null;
  try { var j1 = JSON.parse(t1); uid = j1.user ? j1.user.pk : (j1.items && j1.items[0] ? j1.items[0].user.pk : null); } catch (e) {}
  var out = { profile_status: r1.status, profile_head: t1.slice(0, 80), uid: uid };
  if (uid) {
    var r2 = await fetch('/api/v1/feed/user/' + uid + '/?count=12', { headers: H, credentials: 'include' });
    var t2 = await r2.text();
    out.feed_status = r2.status; out.feed_head = t2.slice(0, 120);
  }
  window.__IG_OUT = JSON.stringify(out);
})().catch(function (e) { window.__IG_OUT = 'error ' + e; });
'started';
