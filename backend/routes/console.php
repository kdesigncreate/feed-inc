<?php

/**
 * Artisan コンソールコマンドを定義するファイル。
 *
 * - ここで定義したコマンドは `php artisan {name}` で実行できます。
 * - クロージャベースのコマンド定義や、独自コマンドクラスの登録（Kernel 経由）に利用します。
 * - スケジューリングは app/Console/Kernel.php 側で設定します。
 */

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// サンプル: ランダムな格言を表示するコマンド
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
