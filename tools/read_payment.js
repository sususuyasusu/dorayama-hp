(function () {
  var rows = [].slice.call(document.querySelectorAll('#access dl > div'));
  var pay = rows.map(function (r) { return r.innerText.replace(/\s+/g, ' '); }).filter(function (t) { return /お支払い|Payment|支付|결제/.test(t); });
  var body = (document.querySelector('#access p.font-mincho') || {}).innerText || '';
  var m = body.match(/[^。.]*(現金|cash|现金|현금)[^。.]*/i);
  return JSON.stringify({ row: pay[0] || null, sentence: m ? m[0].trim() : null });
})();
