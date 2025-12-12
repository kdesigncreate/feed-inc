<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Sanctumエンドポイント
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['csrf_token' => csrf_token()]);
});

// ストレージテスト用エンドポイント
Route::get('/storage-test', function () {
    \Log::info('Storage test route accessed');
    return response()->json(['message' => 'Storage test route working']);
});

// ストレージファイルサービング用エンドポイント
Route::get('/storage/{path}', function ($path) {
    \Log::info('Storage route accessed', ['path' => $path]);
    
    // ネストされたパスを適切に処理する
    $filePath = storage_path('app/public/' . $path);
    \Log::info('Looking for file', ['filePath' => $filePath, 'exists' => file_exists($filePath)]);
    
    if (!file_exists($filePath)) {
        \Log::warning('File not found', ['path' => $path, 'filePath' => $filePath]);
        return response()->json(['error' => 'File not found', 'path' => $path, 'filePath' => $filePath], 404);
    }
    
    $mimeType = mime_content_type($filePath);
    \Log::info('Serving file', ['path' => $path, 'mimeType' => $mimeType]);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=2592000', // 30 days
    ]);
})->where('path', '.*');
