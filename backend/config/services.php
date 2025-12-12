<?php

return [

    /*
    |--------------------------------------------------------------------------
    | サードパーティサービス
    |--------------------------------------------------------------------------
    |
    | このファイルは Mailgun、Postmark、AWS などのサードパーティサービスの
    | 資格情報を保存するためのものです。パッケージが各種サービスの資格情報を
    | 見つけるための事実上の標準的な配置場所を提供します。
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
