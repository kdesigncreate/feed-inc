<?php

return [

    /*
    |--------------------------------------------------------------------------
    | デフォルトのキュー接続名
    |--------------------------------------------------------------------------
    |
    | Laravel のキューは単一の統一 API を通じて様々なバックエンドをサポートします。
    | 各バックエンドへ同一の文法で便利にアクセスできます。
    | デフォルトのキュー接続は以下で定義します。
    |
    */

    'default' => env('QUEUE_CONNECTION', 'database'),

    /*
    |--------------------------------------------------------------------------
    | キュー接続
    |--------------------------------------------------------------------------
    |
    | アプリケーションで使用する各キューバックエンドの接続オプションを
    | ここで設定します。Laravel がサポートする各バックエンドの例が
    | 提供されています。必要に応じて追加も可能です。
    |
    | 対応ドライバ: "sync", "database", "beanstalkd", "sqs", "redis", "null"
    |
    */

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_QUEUE_CONNECTION'),
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            'queue' => env('DB_QUEUE', 'default'),
            'retry_after' => (int) env('DB_QUEUE_RETRY_AFTER', 90),
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
            'queue' => env('BEANSTALKD_QUEUE', 'default'),
            'retry_after' => (int) env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
            'block_for' => null,
            'after_commit' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | ジョブのバッチ処理
    |--------------------------------------------------------------------------
    |
    | 以下のオプションは、ジョブのバッチ情報を保存するデータベースと
    | テーブルを設定します。アプリケーションで定義された任意の接続と
    | テーブルに更新できます。
    |
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | 失敗したキュージョブ
    |--------------------------------------------------------------------------
    |
    | 失敗したキュージョブの記録方法を設定します。どこに、どのように
    | 保存するかを制御できます。Laravel には、ファイルまたはデータベースに
    | 保存する機能が用意されています。
    |
    | 対応ドライバ: "database-uuids", "dynamodb", "file", "null"
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],

];
