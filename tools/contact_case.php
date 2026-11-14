<?php
// contact.php を、本番と同じ受け取り方の値を入れて1回呼ぶ試験台（2026-11-14）。メールは送らない環境で使う。
// 使い方: php contact_case.php 試験用フォルダ 方法(GET/POST) Origin 送る値(JSON) [受付票の古さ(秒)]
[$_, $root, $method, $origin, $json] = array_pad($argv, 5, '');
$age = (int)($argv[5] ?? 0);
@mkdir("$root/www", 0700, true);
$_SERVER['DOCUMENT_ROOT'] = "$root/www";
$_SERVER['REQUEST_METHOD'] = $method;
$_SERVER['REMOTE_ADDR'] = '203.0.113.9';
if ($origin !== '') { $_SERVER['HTTP_ORIGIN'] = $origin; }
$post = json_decode($json ?: '{}', true) ?: [];
if ($method === 'GET') { $_GET = $post; }
if ($method === 'POST') {
  if (($post['ticket'] ?? '') === 'MAKE') {
    // 試験用に「$age 秒前に発行した」受付票を、本物と同じ合言葉で作る
    $key = trim((string)@file_get_contents("$root/dorayama_contact/secret.key"));
    $ts = (string)(time() - $age);
    $n = bin2hex(random_bytes(12));
    $post['ticket'] = $ts . '.' . $n . '.' . hash_hmac('sha256', "$ts.$n", $key);
    file_put_contents("$root/last_ticket.txt", $post['ticket']);
  } elseif (($post['ticket'] ?? '') === 'LAST') {
    $post['ticket'] = trim((string)file_get_contents("$root/last_ticket.txt"));
  }
  $_POST = $post;
  $_SERVER['CONTENT_LENGTH'] = (string)strlen(http_build_query($post));
}
// メールは絶対に送らない（2026-11-14 この試験台から実際に7通が送られてしまった）
putenv('CONTACT_DRY_RUN=1');
include __DIR__ . '/../public/api/contact.php';
