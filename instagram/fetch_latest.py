"""Safari（Instagramにログイン済み）で @dorayama_jp のプロフィールを開き、まだ取り込んでいない新しい投稿だけを
1件ずつ開いて、本文・日時・1枚目の写真を読み取り、JSONで書き出す。
（2026-11 時点で以前の取得口 /api/v1/... は使えなくなったため、画面に出ている内容から読む方式）
使い方: fetch_latest.py 出力ファイル [調べる件数（既定12）] [--code 投稿コード（指定の投稿だけ読む・試験用）]
終了コード: 0=成功（新着0件も成功） / 1=読み取り失敗"""
import io, contextlib, json, os, re, sys, time, datetime

sys.path.insert(0, os.path.expanduser('~/dw-safari'))
import sf  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ALL = os.path.join(HERE, 'raw', 'all_posts.json')


def open_tab(url):
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        sf.cmd_open(url)
    ref = buf.getvalue().strip().splitlines()[-1].split()[0]
    sf.wait(ref)
    return ref


def close_tab(ref):
    try:
        w, t = sf.parse(ref)
        sf.osa(f'tell application "Safari" to close tab {t} of window id {w}')
    except Exception:
        pass


def grid_codes(limit):
    ref = open_tab('https://www.instagram.com/dorayama_jp/')
    try:
        codes = []
        for _ in range(10):
            time.sleep(2)
            raw = sf.js(ref, "Array.from(document.querySelectorAll('a[href*=\"/p/\"],a[href*=\"/reel/\"]')).map(a=>a.getAttribute('href')).join(' ')")
            codes = []
            for h in raw.split():
                m = re.search(r'/(?:p|reel)/([A-Za-z0-9_-]+)/', h)
                if m and m.group(1) not in codes:
                    codes.append(m.group(1))
            if codes:
                break
        if not codes:
            title = sf.js(ref, 'document.title')
            raise RuntimeError(f'プロフィールに投稿が見つからない（ログイン切れの可能性・画面の題名={title}）')
        return codes[:limit]
    finally:
        close_tab(ref)


def read_post(code):
    ref = open_tab(f'https://www.instagram.com/p/{code}/')
    try:
        m = None
        for _ in range(12):
            time.sleep(2)
            desc = sf.js(ref, "(document.querySelector('meta[property=\"og:description\"]')||{}).content||''")
            m = re.search(r'dorayama_jp[^:"]*:\s*"(.*)"', desc, re.S)
            if m:
                break
        if not m:
            raise RuntimeError(f'{code}: 本文が読めない')
        caption = m.group(1).strip()
        when = sf.js(ref, "(document.querySelector('time[datetime]')||{getAttribute:function(){return ''}}).getAttribute('datetime')")
        # 1枚目の写真: og:image と同じ写真ファイルの、切り抜き無しの画面上の画像を使う（他の投稿の写真を拾わない）
        img = sf.js(ref, "(function(){var og=(document.querySelector('meta[property=\"og:image\"]')||{}).content||'';"
                         "var f=(og.split('?')[0].split('/').pop()||'').split('_').slice(0,2).join('_');var b=null,w=0;"
                         "if(f)document.querySelectorAll('img').forEach(function(i){var s=i.currentSrc||i.src||'';"
                         "if(s.indexOf(f)>=0&&i.naturalWidth>w){w=i.naturalWidth;b=s}});return b||og})()")
        ts = int(datetime.datetime.fromisoformat(when.replace('Z', '+00:00')).timestamp()) if when else int(time.time())
        return {'code': code, 'taken_at': str(ts), 'type': '', 'product': '', 'caption': caption,
                'images': [img] if img else [], 'likes': '0'}
    finally:
        close_tab(ref)


def main():
    out = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 12
    try:
        if '--code' in sys.argv:
            codes = [sys.argv[sys.argv.index('--code') + 1]]
            known = set()
        else:
            codes = grid_codes(limit)
            known = {p['code'] for p in json.load(open(ALL))}
        new = [read_post(c) for c in codes if c not in known]
    except Exception as e:
        print('取得失敗:', e)
        return 1
    json.dump(new, open(out, 'w'), ensure_ascii=False)
    print(f'プロフィールで確認 {len(codes)}件 / 新しい投稿 {len(new)}件', ' '.join(p['code'] for p in new))
    return 0


if __name__ == '__main__':
    sys.exit(main())
