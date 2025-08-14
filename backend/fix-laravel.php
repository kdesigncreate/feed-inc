<?php
// Laravel設定修正スクリプト

echo "Laravel設定修正を開始...\n";

// 1. キャッシュディレクトリの作成
$cacheDir = __DIR__ . '/bootstrap/cache';
if (!file_exists($cacheDir)) {
    mkdir($cacheDir, 0755, true);
    echo "✅ キャッシュディレクトリを作成: $cacheDir\n";
}

// 2. 環境変数の確認と設定
$envFile = __DIR__ . '/../.env.docker';
if (!file_exists($envFile)) {
    echo "❌ .env.docker ファイルが見つかりません\n";
    exit(1);
}

echo "✅ .env.docker ファイルが見つかりました\n";

// 3. 権限の設定
$storageDir = __DIR__ . '/storage';
if (file_exists($storageDir)) {
    chmod($storageDir, 0755);
    echo "✅ storageディレクトリの権限を設定\n";
}

// 4. 基本的なLaravel bootstrap テスト
try {
    // Laravel autoloader をテスト
    require_once __DIR__ . '/vendor/autoload.php';
    echo "✅ Laravel autoloader: OK\n";
    
    // 環境変数を直接設定してテスト
    $_ENV['DB_CONNECTION'] = 'mysql';
    $_ENV['DB_HOST'] = 'mysql';
    $_ENV['DB_PORT'] = '3306';
    $_ENV['DB_DATABASE'] = 'feed_database';
    $_ENV['DB_USERNAME'] = 'feed_user';
    $_ENV['DB_PASSWORD'] = '0zu/PKX5rocZdYBg1xq4RwLD98Of0ppJkJFtCW/l7H8=';
    $_ENV['APP_KEY'] = 'base64:AVjo+X5zrAeTBhj9DKFaGfD2nofAuqiFkhjrxKhFvDY=';
    $_ENV['APP_ENV'] = 'production';
    $_ENV['APP_DEBUG'] = 'false';
    
    echo "✅ 環境変数を設定\n";
    
    // Laravel bootstrapをテスト
    $app = require_once __DIR__ . '/bootstrap/app.php';
    echo "✅ Laravel app bootstrap: OK\n";
    
    echo "修正完了!\n";
    
} catch (Exception $e) {
    echo "❌ エラー: " . $e->getMessage() . "\n";
    echo "スタックトレース: " . $e->getTraceAsString() . "\n";
}
?>