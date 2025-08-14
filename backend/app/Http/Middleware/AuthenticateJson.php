<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class AuthenticateJson extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo($request): ?string
    {
        // For API requests, return null to prevent redirects
        // This will cause the middleware to return a 401 JSON response instead
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        // For web requests, redirect to login
        return route('login');
    }

    /**
     * Handle unauthenticated users for API requests
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            abort(response()->json([
                'message' => 'Unauthenticated.',
                'error' => 'Authentication required'
            ], 401));
        }

        parent::unauthenticated($request, $guards);
    }
}