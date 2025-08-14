<?php
// API直接テスト
try {
    echo "=== API直接テスト ===\n";
    
    require_once __DIR__ . '/vendor/autoload.php';
    
    // 環境変数を強制設定
    putenv('DB_CONNECTION=mysql');
    putenv('DB_HOST=mysql');
    putenv('DB_DATABASE=feed_database');
    putenv('DB_USERNAME=feed_user');
    putenv('DB_PASSWORD=0zu/PKX5rocZdYBg1xq4RwLD98Of0ppJkJFtCW/l7H8=');
    putenv('APP_KEY=base64:AVjo+X5zrAeTBhj9DKFaGfD2nofAuqiFkhjrxKhFvDY=');
    putenv('APP_ENV=production');
    
    // Laravel app起動
    $app = require_once __DIR__ . '/bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    
    // 簡単なリクエストをシミュレート
    $request = Illuminate\Http\Request::create('/api/diagnostic', 'GET');
    $response = $kernel->handle($request);
    
    echo "ステータス: " . $response->getStatusCode() . "\n";
    echo "内容: " . $response->getContent() . "\n";
    
} catch (Exception $e) {
    echo "❌ エラー: " . $e->getMessage() . "\n";
    echo "ファイル: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "スタックトレース: " . $e->getTraceAsString() . "\n";
}
?>