<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * アプリケーションのサービスプロバイダ。
 *
 * register(): サービスコンテナへのバインディングやシングルトン登録など、
 * 依存関係の解決前に実行したい登録処理を記述します。
 * - boot(): すべてのサービスが登録された後に実行される初期化処理を記述します
 * （イベントリスナ、モデルオブザーバ、Blade/Validator マクロ等）。
 *
 * このプロバイダは bootstrap/providers.php に登録され、アプリ起動時に読み込まれます。
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * アプリケーションサービスの登録を行います。
     * 依存解決前に実行され、コンテナへのバインディングや設定の登録などを行います。
     */
    public function register(): void
    {
        //
    }

    /**
     * アプリケーションサービスの起動処理を行います。
     * すべてのサービス登録後に、イベント・オブザーバ・マクロ等の初期化を実行します。
     */
    public function boot(): void
    {
        //
    }
}
