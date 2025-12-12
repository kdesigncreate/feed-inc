<?php

return [

    /*
    |--------------------------------------------------------------------------
    | デフォルトのメーラー
    |--------------------------------------------------------------------------
    |
    | メール送信時に他のメーラーが明示的に指定されない限り、すべてのメールを
    | 送信するデフォルトのメーラーを制御します。追加のメーラーはすべて
    | 「mailers」配列内で設定できます。各種メーラーの例も用意されています。
    |
    */

    'default' => env('MAIL_MAILER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | メーラーの設定
    |--------------------------------------------------------------------------
    |
    | アプリケーションで使用するすべてのメーラーとそれぞれの設定を定義します。
    | いくつかの例があらかじめ設定されています。必要に応じて独自の設定を
    | 追加できます。
    |
    | Laravel はメール配信に利用できる多様な「トランスポート」ドライバを
    | サポートしています。どのドライバを利用するかを下で指定できます。
    | 必要に応じてメーラーを追加することも可能です。
    |
    | 対応ドライバ: "smtp", "sendmail", "mailgun", "ses", "ses-v2",
    |               "postmark", "resend", "log", "array",
    |               "failover", "roundrobin"
    |
    */

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME'),
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => env('MAIL_PORT', 2525),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'postmark' => [
            'transport' => 'postmark',
            // 'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
            // 'client' => [
            //     'timeout' => 5,
            // ],
        ],

        'resend' => [
            'transport' => 'resend',
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
            'retry_after' => 60,
        ],

        'roundrobin' => [
            'transport' => 'roundrobin',
            'mailers' => [
                'ses',
                'postmark',
            ],
            'retry_after' => 60,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | グローバルな From アドレス
    |--------------------------------------------------------------------------
    |
    | アプリケーションから送信されるすべてのメールを同一のアドレスから
    | 送信したい場合があります。ここで、全メールに対して使用される
    | 名前とアドレスをグローバルに指定できます。
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', 'Example'),
    ],

];
