<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | デフォルトのキャッシュストア
    |--------------------------------------------------------------------------
    |
    | このオプションはフレームワークで使用されるデフォルトのキャッシュストアを
    | 制御します。アプリケーション内で別のストアが明示的に指定されない限り、
    | ここで定義された接続が使用されます。
    |
    */

    'default' => env('CACHE_STORE', 'database'),

    /*
    |--------------------------------------------------------------------------
    | キャッシュストア
    |--------------------------------------------------------------------------
    |
    | アプリケーションで使用するすべてのキャッシュ「ストア」とそのドライバを
    | 定義します。同一ドライバに対して複数のストアを定義し、キャッシュ対象の
    | 種類ごとにグルーピングすることもできます。
    |
    | 対応ドライバ: "array", "database", "file", "memcached",
    |               "redis", "dynamodb", "octane", "null"
    |
    */

    'stores' => [

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_CACHE_CONNECTION'),
            'table' => env('DB_CACHE_TABLE', 'cache'),
            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'),
            'lock_table' => env('DB_CACHE_LOCK_TABLE'),
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
            'lock_path' => storage_path('framework/cache/data'),
        ],

        'memcached' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'sasl' => [
                env('MEMCACHED_USERNAME'),
                env('MEMCACHED_PASSWORD'),
            ],
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
            'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default'),
        ],

        'dynamodb' => [
            'driver' => 'dynamodb',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        'octane' => [
            'driver' => 'octane',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | キャッシュキーのプレフィックス
    |--------------------------------------------------------------------------
    |
    | APC、database、memcached、Redis、DynamoDB のキャッシュストアを使用する場合、
    | 同じキャッシュを他のアプリケーションが使用している可能性があります。
    | そのため、衝突を避ける目的で全てのキャッシュキーにプレフィックスを
    | 付与できます。
    |
    */

    'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_cache_'),

];
