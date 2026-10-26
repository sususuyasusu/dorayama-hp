"""ブラウザ（instagram.com）から送られてくる投稿データを受け取り、raw/ に保存する小さな受け口。
127.0.0.1 だけで待ち受ける（外からは届かない）。POST /save?name=ファイル名"""
import http.server, os, urllib.parse

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'raw')
os.makedirs(ROOT, exist_ok=True)


class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', 'https://www.instagram.com')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'content-type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')

    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()

    def do_POST(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        name = os.path.basename(q.get('name', ['data.json'])[0])
        body = self.rfile.read(int(self.headers.get('content-length', 0)))
        with open(os.path.join(ROOT, name), 'wb') as f:
            f.write(body)
        self.send_response(200); self._cors(); self.end_headers()
        self.wfile.write(b'ok')

    def log_message(self, *a):
        pass


http.server.HTTPServer(('127.0.0.1', 8765), H).serve_forever()
