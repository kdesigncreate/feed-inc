<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function __construct()
    {
        // Disable CSRF verification for this controller
        $this->middleware('web')->except(['login']);
    }

    public function login(Request $request)
    {
        // Step by step debugging - return debug info instead of login
        return response()->json([
            'message' => 'Debug login endpoint',
            'method' => $request->method(),
            'input' => $request->all(),
            'database_users_count' => \DB::table('users')->count(),
            'timestamp' => now()
        ]);
    }

    public function register(Request $request)
    {
        // Registration is disabled for security reasons
        return response()->json([
            'error' => 'Registration is disabled. Please contact administrator.',
        ], 403);
    }

    public function logout(Request $request)
    {
        try {
            // Manual token validation for web routes
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json(['message' => 'No token provided'], 401);
            }

            $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
            
            if (!$personalAccessToken) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            $personalAccessToken->delete();

            return response()->json(['message' => 'Logged out successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Logout error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
