<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ImageUploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'timestamp' => now()->toISOString(),
        'laravel_version' => app()->version()
    ]);
});

// CSRF Cookie endpoint for SPA authentication  
Route::get('/sanctum/csrf-cookie', [AuthController::class, 'csrf']);

// Authentication routes using SPA Cookie authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes using Sanctum middleware for SPA
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// 公開API（認証不要）
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);
Route::get('/categories', [ArticleController::class, 'categories']);

// Upload thumbnail endpoint (requires authentication)
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/upload-thumbnail', [ImageUploadController::class, 'uploadThumbnail']);
    Route::post('/articles/upload-thumbnail', [ImageUploadController::class, 'uploadThumbnail']);
});

// Storage file serving (public access)
Route::get('/storage/{path}', function ($path) {
    \Log::info('API storage route accessed', ['path' => $path]);
    
    // Handle nested paths properly
    $filePath = storage_path('app/public/' . $path);
    \Log::info('Looking for file via API', ['filePath' => $filePath, 'exists' => file_exists($filePath)]);
    
    if (!file_exists($filePath)) {
        \Log::warning('File not found via API', ['path' => $path, 'filePath' => $filePath]);
        return response()->json(['error' => 'File not found', 'path' => $path], 404);
    }
    
    $mimeType = mime_content_type($filePath);
    \Log::info('Serving file via API', ['path' => $path, 'mimeType' => $mimeType]);
    
    return response()->file($filePath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=2592000', // 30 days
    ]);
})->where('path', '.*');

// 管理者用API（認証＋admin権限必要）
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::get('/admin/articles', [ArticleController::class, 'index']);
});