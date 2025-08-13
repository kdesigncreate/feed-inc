<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // APIレスポンスにセキュリティヘッダーを追加
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
        
        // API用の厳格なCSP
        $csp = [
            "default-src 'none'",
            "script-src 'none'",
            "style-src 'none'",
            "img-src 'none'",
            "font-src 'none'",
            "connect-src 'self'",
            "media-src 'none'",
            "object-src 'none'",
            "child-src 'none'",
            "frame-src 'none'",
            "worker-src 'none'",
            "frame-ancestors 'none'",
            "form-action 'none'",
            "upgrade-insecure-requests",
            "base-uri 'none'"
        ];
        
        $response->headers->set('Content-Security-Policy', implode('; ', $csp));
        
        // JSON APIレスポンスのセキュリティ強化
        if ($response->headers->get('content-type') === 'application/json') {
            $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
            $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');
            $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
            $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');
        }

        return $response;
    }
}