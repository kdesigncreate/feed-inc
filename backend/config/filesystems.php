<?php

return [

    /*
    |--------------------------------------------------------------------------
    | デフォルトのファイルシステムディスク
    |--------------------------------------------------------------------------
    |
    | フレームワークで使用されるデフォルトのファイルシステムディスクを
    | 指定します。「local」ディスクのほか、各種クラウドベースのディスクを
    | ファイル保存に利用できます。
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | ファイルシステムディスク
    |--------------------------------------------------------------------------
    |
    | 必要な数だけファイルシステムディスクを設定できます。同一ドライバに
    | 複数ディスクを設定することも可能です。多くの対応ストレージドライバの
    | 例が参考として記載されています。
    |
    | 対応ドライバ: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | シンボリックリンク
    |--------------------------------------------------------------------------
    |
    | Artisan の `storage:link` コマンド実行時に作成されるシンボリックリンクを
    | ここで設定します。配列キーはリンクの作成先、値はリンク先（ターゲット）
    | を表します。
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
