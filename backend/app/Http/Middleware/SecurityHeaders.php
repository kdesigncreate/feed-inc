<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
    //@paramはパラメータを指定するメソッド
    //\Closureはクロージャを指定するメソッド
    //クロージャとは無名関数のこと
    //(\Illuminate\Http\Request)はリクエストを指定するメソッド
    //(\Symfony\Component\HttpFoundation\Response)はレスポンスを指定するメソッド
    //$nextは次のミドルウェアを指定するメソッド
    
    public function handle(Request $request, Closure $next): Response
    //handleメソッドはリクエストを処理するメソッド
    //Request $requestはリクエストを指定するメソッド
    //Closure $nextは次のミドルウェアを指定するメソッド
    //Responseはレスポンスを指定するメソッド
    //ResponseはSymfony\Component\HttpFoundation\Responseを指定するメソッド
    {
        $response = $next($request);
        //$response = $next($request);は次のミドルウェアを実行するメソッド

        // APIレスポンスにセキュリティヘッダーを追加
        //headers->setはヘッダーを設定するメソッド
        $response->headers->set('X-Frame-Options', 'DENY');
        //X-Frame-OptionsはXフレームオプションを指定するメソッド
        //DENYはDENYを指定するメソッド
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        //X-Content-Type-OptionsはXコンテンツタイプオプションを指定するメソッド
        //nosniffはnosniffを指定するメソッド
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        //X-XSS-ProtectionはXSSプロテクションを指定するメソッド
        //1; mode=blockは1; mode=blockを指定するメソッド
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        //Referrer-PolicyはReferrerポリシーを指定するメソッド
        //strict-origin-when-cross-originはstrict-origin-when-cross-originを指定するメソッド
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        //Strict-Transport-SecurityはStrict-Transport-Securityを指定するメソッド
        //max-age=31536000; includeSubDomains; preloadはmax-age=31536000; includeSubDomains; preloadを指定するメソッド
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
        //Permissions-PolicyはPermissionsポリシーを指定するメソッド
        //camera=(), microphone=(), geolocation=(), payment=(), usb=()はcamera=(), microphone=(), geolocation=(), payment=(), usb=()を指定するメソッド
        
        // API用の厳格なCSP
        //cspとはContent Security Policyのこと
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
        //Content-Security-PolicyはContent Security Policyを指定するメソッド
        //implode('; ', $csp)はcspを指定するメソッド
        //implodeはimplodeメソッドを指定するメソッド
        //'; 'は'; 'を指定するメソッド

        // JSON APIレスポンスのセキュリティ強化
        if ($response->headers->get('content-type') === 'application/json') {
            //X-Permitted-Cross-Domain-PoliciesはXパーミットドメインポリシーを指定するメソッド
            //noneはnoneを指定するメソッド
            $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
            //Cross-Origin-Resource-PolicyはCross-Origin Resource Policyを指定するメソッド
            //same-originはsame-originを指定するメソッド
            $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');
            //Cross-Origin-Opener-PolicyはCross-Origin Opener Policyを指定するメソッド
            //same-originはsame-originを指定するメソッド
            $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
            //Cross-Origin-Embedder-PolicyはCross-Origin Embedder Policyを指定するメソッド
            //require-corpはrequire-corpを指定するメソッド
            $response->headers->set('Cross-Origin-Embedder-Policy', 'require-corp');
            //Cross-Origin-Resource-Policy-Report-OnlyはCross-Origin Resource Policy Report Onlyを指定するメソッド
            //report-corsはreport-corsを指定するメソッド
        }

        //return $response;はレスポンスを返すメソッド
        return $response;
    }
}