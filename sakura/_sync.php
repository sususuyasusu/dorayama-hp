<?php
// dorayama.com の更新口。合言葉付きで呼ばれたときだけ、GitHub の bundle ブランチ
// （sususuyasusu/dorayama-hp の指定コミット）から zip を取り、このフォルダへ展開する。
// 取得先は固定なので、合言葉を知っていても他所のファイルは置けない。
header('Content-Type: text/plain; charset=utf-8');
$expected = '5fd430d6965a8f8c50164a7e17d64d68f74d61cd766d78cccf988cec1a7f4367'; // sha256 of the secret kept in ~/dorayama-hp/.sync_secret
if (!hash_equals($expected, hash('sha256', (string)($_GET['k'] ?? '')))) { http_response_code(403); exit("forbidden\n"); }
$sha = (string)($_GET['sha'] ?? '');
if (!preg_match('/^[0-9a-f]{40}$/', $sha)) { http_response_code(400); exit("bad sha\n"); }
$files = array_filter(explode(',', (string)($_GET['files'] ?? '')));
if (!$files) { http_response_code(400); exit("no files\n"); }
foreach ($files as $f) {
  if (!preg_match('/^site_[a-z0-9_]+\.zip$/', $f)) { http_response_code(400); exit("bad name $f\n"); }
}
set_time_limit(600);
$out = [];
foreach ($files as $f) {
  $url = "https://raw.githubusercontent.com/sususuyasusu/dorayama-hp/$sha/$f";
  $tmp = sys_get_temp_dir() . '/' . $f;
  $ch = curl_init($url);
  $fp = fopen($tmp, 'w');
  curl_setopt_array($ch, [CURLOPT_FILE => $fp, CURLOPT_FOLLOWLOCATION => true, CURLOPT_TIMEOUT => 300, CURLOPT_FAILONERROR => true]);
  $ok = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);
  fclose($fp);
  if (!$ok) { http_response_code(502); exit("download failed $f $err\n"); }
  $zip = new ZipArchive();
  if ($zip->open($tmp) !== true) { http_response_code(500); exit("zip open failed $f\n"); }
  $n = $zip->numFiles;
  $zip->extractTo(__DIR__);
  $zip->close();
  unlink($tmp);
  $out[] = "$f $n";
}
// files written by PHP must stay readable by the web server
$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::SELF_FIRST);
foreach ($it as $p) { @chmod($p->getPathname(), $p->isDir() ? 0755 : 0644); }
echo "ok\n" . implode("\n", $out) . "\n";
