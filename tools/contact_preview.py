"""公式サイトの組み立て結果（out_root）を手元で見る試験用サーバー。/api/contact.php は本物の代わりに決まった返事をする（見た目と流れの確認用・メールは送らない）。
使い方: python3 tools/contact_preview.py [ポート]"""
import http.server
import json
import os
import sys
import time
import urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "out_root")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8790
SEEN = []


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def _json(self, code, body):
        b = json.dumps(body, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        self.end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path.startswith("/api/contact.php"):
            return self._json(200, {"ok": True, "ticket": f"{int(time.time())}.preview.x"})
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith("/api/contact.php"):
            return self._json(404, {"ok": False})
        n = int(self.headers.get("Content-Length") or 0)
        f = {k: v[-1] for k, v in urllib.parse.parse_qs(self.rfile.read(n).decode()).items()}
        SEEN.append(f)
        bad = [k for k in ("kind", "name", "email", "message") if not f.get(k)]
        if f.get("agree") != "1":
            bad.append("agree")
        if bad:
            return self._json(422, {"ok": False, "error": "invalid", "fields": bad})
        return self._json(200, {"ok": True, "no": "PREVIEW-0001"})

    def log_message(self, *a):
        pass


http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
