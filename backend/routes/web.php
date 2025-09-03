<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Add Sanctum route for CSRF cookie
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['csrf_token' => csrf_token()]);
});

// Test storage route to verify it's working
Route::get('/storage-test', function () {
    \Log::info('Storage test route accessed');
    return response()->json(['message' => 'Storage test route working']);
});

// Storage files route - serve files from storage/app/public
Route::get('/storage/{path}', function ($path) {
    \Log::info('Storage route accessed', ['path' => $path]);
    
    // Handle nested paths properly
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

// Disable the default route to prevent API redirects
// Route::get('/', function () {
//     return view('welcome');
// });

// Diagnostic endpoint to check environment and database
Route::get('/diagnostic', function () {
    try {
        $diagnostics = [
            'app_env' => env('APP_ENV'),
            'db_connection' => env('DB_CONNECTION'),
            'db_host' => env('DB_HOST'),
            'db_database' => env('DB_DATABASE'),
            'db_username' => env('DB_USERNAME'),
            'db_password_set' => env('DB_PASSWORD') ? 'YES' : 'NO',
            'app_key_set' => env('APP_KEY') ? 'YES' : 'NO',
        ];
        
        // Test database connection
        try {
            DB::connection()->getPdo();
            $diagnostics['database_connection'] = 'SUCCESS';
        } catch (Exception $e) {
            $diagnostics['database_connection'] = 'FAILED: ' . $e->getMessage();
        }
        
        return response()->json($diagnostics);
        
    } catch (Exception $e) {
        return response()->json([
            'error' => 'Diagnostic failed: ' . $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});


// Test logout route
// (cleaned) test endpoints removed for production