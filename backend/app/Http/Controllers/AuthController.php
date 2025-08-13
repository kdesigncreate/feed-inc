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
        // Apply web middleware for session handling
        $this->middleware('web');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // For SPA Cookie authentication, we use the session guard
        auth('web')->login($user, $request->boolean('remember'));

        return response()->json([
            'user' => $user->only(['id', 'name', 'email', 'role']),
            'message' => 'Logged in successfully'
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
        auth('web')->logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
    
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
    
    public function csrf(Request $request)
    {
        return response()->json(['csrf_token' => csrf_token()]);
    }
}
