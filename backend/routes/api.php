<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes (no auth required) - direct implementation
Route::post('/login', function (Request $request) {
    try {
        $email = $request->input('email');
        $password = $request->input('password');
        
        if (!$email || !$password) {
            return response()->json(['error' => 'Email and password required'], 400);
        }
        
        // Get user from database
        $user = \DB::table('users')->where('email', $email)->first();
        
        if (!$user) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        
        // Check password
        if (!\Illuminate\Support\Facades\Hash::check($password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        
        // Check role
        if (($user->role ?? 'user') !== 'admin') {
            return response()->json(['error' => 'Admin access required'], 403);
        }
        
        // Create token
        $userModel = \App\Models\User::find($user->id);
        $token = $userModel->createToken('admin-token')->plainTextToken;
        
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'user'
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
});

Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    if (!$user) {
        return response()->json(['message' => 'Unauthorized'], 401);
    }
    return response()->json($user);
});

// Logout moved to web routes to avoid authentication issues
// Route::middleware(['auth:sanctum'])->post('/logout', [AuthController::class, 'logout']);

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
