// ログイン済みブラウザの instagram.com ページ内で実行する。
// @dorayama_jp の投稿を1ページ（最大33件）取得し、必要な項目だけを window.__IG_OUT に JSON 文字列で置く。
// window.__IG_MAX_ID に続きの目印があれば次のページを取る。結果は ig_read.js で読み出す。
window.__IG_OUT = null;
(async function () {
  var H = { 'x-ig-app-id': '936619743392459', 'x-requested-with': 'XMLHttpRequest' };
  if (!window.__IG_UID) {
    var p = await fetch('/api/v1/users/web_profile_info/?username=dorayama_jp', { headers: H, credentials: 'include' }).then(function (r) { return r.json(); });
    window.__IG_UID = p.data.user.id;
  }
  var url = '/api/v1/feed/user/' + window.__IG_UID + '/?count=33' + (window.__IG_MAX_ID ? '&max_id=' + window.__IG_MAX_ID : '');
  var d = await fetch(url, { headers: H, credentials: 'include' }).then(function (r) { return r.json(); });
  var items = (d.items || []).map(function (it) {
    function best(c) { var v = (c && c.image_versions2 && c.image_versions2.candidates) || []; return v.length ? v[0].url : null; }
    var imgs = it.carousel_media ? it.carousel_media.map(best) : [best(it)];
    return {
      code: it.code,
      taken_at: it.taken_at,
      type: it.media_type,
      caption: it.caption ? it.caption.text : '',
      images: imgs.filter(Boolean),
      likes: it.like_count
    };
  });
  window.__IG_MAX_ID = d.more_available ? d.next_max_id : null;
  window.__IG_OUT = JSON.stringify({ more: !!d.more_available, items: items });
})().catch(function (e) { window.__IG_OUT = JSON.stringify({ error: String(e) }); });
'started';
