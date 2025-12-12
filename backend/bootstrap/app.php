<?php

use Illuminate\Foundation\Application;
// フレームワーク本体のアプリケーションクラス
use Illuminate\Foundation\Configuration\Exceptions;
// 例外ハンドリングに関する設定用クラス
use Illuminate\Foundation\Configuration\Middleware;
// ミドルウェアに関する設定用クラス

// アプリケーションを設定してインスタンスを生成して返す
return Application::configure(basePath: dirname(__DIR__))
// Application::configureはアプリケーションを設定してインスタンスを生成して返すメソッド
// basePathはアプリケーションのベースパス（プロジェクトの backend/ ディレクトリ）を指定するメソッド
// dirname(__DIR__)はディレクトリのパスを取得するメソッド

    ->withRouting(
        // ルーティングの設定を行う
        web: __DIR__.'/../routes/web.php',
        // Web ルートファイルの場所
        api: __DIR__.'/../routes/api.php',
        // API ルートファイルの場所
        apiPrefix: 'api',
        // API ルートの URL プレフィックス（例: /api/articles）
        commands: __DIR__.'/../routes/console.php',
        // Artisan コマンド定義ファイルの場所
        health: '/up',
        // ヘルスチェック用エンドポイント（例: GET /up）
    )

    // ミドルウェアのグローバル設定を行う
    ->withMiddleware(function (Middleware $middleware): void {
        // ミドルウェアのグローバル設定を行う

        $middleware->validateCsrfTokens(except: ['api/*', 'sanctum/*']);
        // validateCsrfTokensはCSRF検証を除外するメソッド
        // exceptは除外するメソッド
        // ['api/*', 'sanctum/*']は除外するパスを指定するメソッド
        
        $middleware->api(prepend: [
            //apiはAPIのミドルウェアを指定するメソッド
            //prependはprependメソッドを指定するメソッド
            \Illuminate\Http\Middleware\HandleCors::class,
            //HandleCorsはHandleCorsメソッドを指定するメソッド
        ]);
        
        $middleware->alias([
            //aliasはエイリアスを指定するメソッド
            'admin' => App\Http\Middleware\AdminMiddleware::class,
            //adminは管理者専用ルート用のカスタムミドルウェアを指定するメソッド
            'security.headers' => App\Http\Middleware\SecurityHeaders::class,
            //security.headersはセキュリティヘッダ付与用のカスタムミドルウェアを指定するメソッド
            'auth.json' => App\Http\Middleware\AuthenticateJson::class,
            //auth.jsonはAPIで未認証時にJSONレスポンスを返すためのミドルウェアを指定するメソッド
        ]);
        
        $middleware->api([
            //apiはAPIのミドルウェアを指定するメソッド
            //prependはprependメソッドを指定するメソッド
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // ここで例外のレンダリングやレポート方法をカスタマイズできる
    })
    ->create();
    // 構成済みアプリケーションインスタンスを生成して返す
