<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

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