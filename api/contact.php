<?php
// どら山 公式サイトのお問い合わせ受付（2026-11-14）。
// 方針：メールアドレスを画面に出さず、フォームで受けて info@dorayama.com に届ける。
// 最近のPHPフォームの悪用に備えて、次を守る。
//  - 宛先・差出人・件名はこちらで固定（入力でメールの見出しを書き換えられない＝ヘッダーインジェクション対策）
//  - お客様への自動返信はしない（他人のアドレスを入れて迷惑メールの踏み台にされるのを防ぐ）
//  - 入力を画面にそのまま出さない（返事は決まった短い文だけ）
//  - よそのサイトからの送信を断る（Origin/Referer の確認）
//  - 機械の連投を止める：見えない入力欄（罠）・署名つきの受付票（表示から3秒〜2時間だけ有効・1回きり）・同じ所からの回数制限
//  - 送れなかったときも問い合わせを失わないよう、公開フォルダの外に控えを残す（他人は読めない権限）
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
date_default_timezone_set('Asia/Tokyo');
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

const TO_ADDR   = 'info@dorayama.com';
const FROM_ADDR = 'info@dorayama.com';
const SITE_HOSTS = ['dorayama.com', 'www.dorayama.com'];
const KINDS = [
  'order'  => 'ご予約・ご注文について',
  'media'  => '取材・メディアのご依頼',
  'event'  => '催事・卸・法人のご相談',
  'other'  => 'その他',
];

function reply(int $code, array $body): void {
  http_response_code($code);
  echo json_encode($body, JSON_UNESCAPED_UNICODE);
  exit;
}

// 公開フォルダ（www）の外に、合言葉と控えと回数の記録を置く
$home = dirname(rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? __DIR__ . '/..'), '/'));
$dir = $home . '/dorayama_contact';
if (!is_dir($dir)) { @mkdir($dir, 0700, true); }
if (!is_dir($dir) || !is_writable($dir)) { $dir = sys_get_temp_dir() . '/dorayama_contact'; @mkdir($dir, 0700, true); }

function secret(string $dir): string {
  $f = $dir . '/secret.key';
  if (!is_file($f)) {
    $k = bin2hex(random_bytes(32));
    if (@file_put_contents($f, $k, LOCK_EX) === false) { reply(500, ['ok' => false, 'error' => 'server']); }
    @chmod($f, 0600);
  }
  return trim((string)file_get_contents($f));
}

function client_ip(): string {
  // さくらは https の通信を中継サーバー経由で渡すため、接続元は REMOTE_ADDR ではなく
  // さくらが付ける X-Sakura-Forwarded-For に入る（.htaccess の https 判定と同じ仕組み）。
  // 一般の X-Forwarded-For はお客様側で偽れるので見ない。
  $s = trim(explode(',', (string)($_SERVER['HTTP_X_SAKURA_FORWARDED_FOR'] ?? ''))[0]);
  if ($s !== '' && filter_var($s, FILTER_VALIDATE_IP)) { return $s; }
  return (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

// 回数制限：同じ接続元は10分に3回・全体で1時間に40回まで
function rate_ok(string $dir, string $ip): bool {
  $f = $dir . '/rate.json';
  $fp = @fopen($f, 'c+');
  if (!$fp) { return true; }
  flock($fp, LOCK_EX);
  $raw = stream_get_contents($fp);
  $data = json_decode($raw ?: '{}', true);
  if (!is_array($data)) { $data = []; }
  $now = time();
  $key = hash('sha256', $ip);
  $all = array_values(array_filter($data['all'] ?? [], fn($t) => is_int($t) && $t > $now - 3600));
  $mine = array_values(array_filter($data['ip'][$key] ?? [], fn($t) => is_int($t) && $t > $now - 600));
  $ok = count($mine) < 3 && count($all) < 40;
  if ($ok) { $mine[] = $now; $all[] = $now; }
  $ips = [];
  foreach (($data['ip'] ?? []) as $k => $ts) {
    $ts = array_values(array_filter((array)$ts, fn($t) => is_int($t) && $t > $now - 600));
    if ($ts) { $ips[$k] = $ts; }
  }
  $ips[$key] = $mine;
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode(['all' => $all, 'ip' => $ips]));
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);
  @chmod($f, 0600);
  return $ok;
}

// 受付票：発行時刻と使い捨ての番号に署名したもの。使った番号は記録して二度使わせない
function issue_ticket(string $key): string {
  $ts = (string)time();
  $nonce = bin2hex(random_bytes(12));
  return $ts . '.' . $nonce . '.' . hash_hmac('sha256', $ts . '.' . $nonce, $key);
}

function ticket_ok(string $dir, string $key, string $t): bool {
  if (!preg_match('/^(\d{10})\.([0-9a-f]{24})\.([0-9a-f]{64})$/', $t, $m)) { return false; }
  if (!hash_equals(hash_hmac('sha256', $m[1] . '.' . $m[2], $key), $m[3])) { return false; }
  $age = time() - (int)$m[1];
  if ($age < 3 || $age > 7200) { return false; }
  $f = $dir . '/used.txt';
  $fp = @fopen($f, 'c+');
  if (!$fp) { return true; }
  flock($fp, LOCK_EX);
  $lines = array_filter(explode("\n", (string)stream_get_contents($fp)));
  $keep = [];
  foreach ($lines as $l) {
    [$at, $n] = array_pad(explode(' ', $l, 2), 2, '');
    if ((int)$at > time() - 7300) { $keep[] = $l; }
    if ($n === $m[2]) { flock($fp, LOCK_UN); fclose($fp); return false; }
  }
  $keep[] = time() . ' ' . $m[2];
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, implode("\n", $keep) . "\n");
  flock($fp, LOCK_UN);
  fclose($fp);
  @chmod($f, 0600);
  return true;
}

function same_site(): bool {
  $src = (string)($_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '');
  if ($src === '') { return false; }
  $host = strtolower((string)parse_url($src, PHP_URL_HOST));
  return in_array($host, SITE_HOSTS, true);
}

// 文字の後始末：見えない制御文字を消し、改行をそろえ、長さで切る
function clean(string $s, int $max, bool $multiline = false): string {
  if (!mb_check_encoding($s, 'UTF-8')) { return ''; }
  $s = str_replace(["\r\n", "\r"], "\n", $s);
  $s = preg_replace($multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}/u', '', $s) ?? '';
  $s = trim($s);
  return mb_substr($s, 0, $max);
}

$key = secret($dir);
$method = (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');

// 受付票を渡す（フォームを開いたときに1回）
if ($method === 'GET') {
  if (($_GET['ticket'] ?? '') !== '1') { reply(404, ['ok' => false]); }
  reply(200, ['ok' => true, 'ticket' => issue_ticket($key)]);
}
if ($method !== 'POST') { header('Allow: GET, POST'); reply(405, ['ok' => false]); }
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) { reply(413, ['ok' => false, 'error' => 'too_long']); }
if (!same_site()) { reply(403, ['ok' => false, 'error' => 'origin']); }

// 罠の欄（人には見えない）に何か入っていたら、機械とみなして「受け付けた」とだけ返し、何もしない
if (trim((string)($_POST['website'] ?? '')) !== '') { reply(200, ['ok' => true]); }
if (!ticket_ok($dir, $key, (string)($_POST['ticket'] ?? ''))) { reply(400, ['ok' => false, 'error' => 'ticket']); }

$kind  = (string)($_POST['kind'] ?? '');
$name  = clean((string)($_POST['name'] ?? ''), 50);
$email = clean((string)($_POST['email'] ?? ''), 120);
$tel   = clean((string)($_POST['tel'] ?? ''), 20);
$msg   = clean((string)($_POST['message'] ?? ''), 2000, true);
$agree = (string)($_POST['agree'] ?? '') === '1';

$errors = [];
if (!isset(KINDS[$kind])) { $errors[] = 'kind'; }
if ($name === '') { $errors[] = 'name'; }
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n,;<>"]/', $email)) { $errors[] = 'email'; }
if ($tel !== '' && !preg_match('/^[0-9+\-() ]{6,20}$/', $tel)) { $errors[] = 'tel'; }
if (mb_strlen($msg) < 5) { $errors[] = 'message'; }
if (!$agree) { $errors[] = 'agree'; }
// 宣伝の書き込みに多い形（リンクだらけ・タグ入り）は断る
if (preg_match_all('~https?://~i', $msg) > 2 || preg_match('~<a\s|\[url=|\[link=~i', $msg)) { $errors[] = 'spam'; }
if ($errors) { reply(422, ['ok' => false, 'error' => 'invalid', 'fields' => $errors]); }
// 回数は「届けるもの」だけ数える（入力の直しで何度か押したお客様を止めないため）
if (!rate_ok($dir, client_ip())) { reply(429, ['ok' => false, 'error' => 'rate']); }

$no = date('ymd-His') . '-' . substr(bin2hex(random_bytes(3)), 0, 4);
$body = "どら山 公式サイトのお問い合わせフォームから届きました。\n"
      . "このメールに返信すると、お客様のアドレスへ届きます。\n\n"
      . "受付番号：{$no}\n"
      . "種類：" . KINDS[$kind] . "\n"
      . "お名前：{$name}\n"
      . "メール：{$email}\n"
      . "電話：" . ($tel !== '' ? $tel : '（なし）') . "\n"
      . "受付日時：" . date('Y年n月j日 H:i') . "\n"
      . "----------------------------------------\n"
      . $msg . "\n"
      . "----------------------------------------\n";

// 控え（公開フォルダの外・本人以外は読めない）
$log = $dir . '/inbox.jsonl';
@file_put_contents($log, json_encode(['no' => $no, 'at' => date('c'), 'kind' => $kind, 'name' => $name, 'email' => $email,
  'tel' => $tel, 'message' => $msg, 'ip_hash' => hash('sha256', client_ip())], JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
@chmod($log, 0600);

mb_language('Japanese');
mb_internal_encoding('UTF-8');
$subject = '【どら山HP】お問い合わせ（' . KINDS[$kind] . '）' . $no;
// 見出しはすべて固定の値。お客様のアドレスは返信先（Reply-To）にだけ入れ、確かめ済みの形に限る
$headers = 'From: ' . mb_encode_mimeheader('どら山 公式サイト') . ' <' . FROM_ADDR . ">\r\n"
         . 'Reply-To: ' . $email . "\r\n"
         . "X-Mailer: dorayama-contact\r\n";
// 試験のときは送らない（試験台が CONTACT_DRY_RUN=1 を立てる。本番では立たない）
// 2026-11-14 手元の試験で実際に7通が店のメールへ届いてしまったための止め
if (getenv('CONTACT_DRY_RUN') === '1') { reply(200, ['ok' => true, 'no' => $no, 'dry_run' => true]); }
$sent = @mb_send_mail(TO_ADDR, $subject, $body, $headers, '-f' . FROM_ADDR);
if (!$sent) {
  @file_put_contents($dir . '/failed.log', date('c') . " {$no}\n", FILE_APPEND | LOCK_EX);
  // 控えは残っているので、お客様には受付済みとして返す（後でお店から確認する）
}
reply(200, ['ok' => true, 'no' => $no]);
