<?php
/**
 * アプリケーションのフロントコントローラ（エントリポイント）。
 * すべての HTTP リクエストはこのファイルを通り、Laravel を起動して処理されます。
 * このファイルは削除してはいけない。
 */

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
// パフォーマンス計測用の開始時刻（フレームワーク内部で使用）

// メンテナンスモードかどうかを判定し、メンテナンス用スクリプトを読み込む
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composer のオートローダを登録（クラスを自動読み込みできるようにする）
require __DIR__.'/../vendor/autoload.php';

// Laravel をブートストラップして、リクエストを処理する
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php'; // アプリケーションの初期設定と生成

$app->handleRequest(Request::capture()); // 現在の HTTP リクエストを取得して処理を実行
