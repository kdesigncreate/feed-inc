<?php

return [

    /*
    |--------------------------------------------------------------------------
    | クロスオリジンリソース共有（CORS）の設定
    |--------------------------------------------------------------------------
    |
    | クロスオリジンリソース共有（CORS）の設定を行います。Web ブラウザで
    | どのクロスオリジン操作を許可するかを決定します。必要に応じて
    | 自由に調整してください。
    |
    | 詳細: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://feed-inc.com',
        'https://www.feed-inc.com',
        'https://162.43.87.222',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
