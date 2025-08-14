<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
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

// 管理者用API（認証＋admin権限必要）
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::put('/articles/{id}', [ArticleController::class, 'update']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::get('/admin/articles', [ArticleController::class, 'index']);
});