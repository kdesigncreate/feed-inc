<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
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
        if (!$request->user()) {
            //response()->jsonはJSONを返すメソッド
            //$request->user()はユーザーを取得するメソッド
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if (!$request->user()->isAdmin()) {
            //response()->jsonはJSONを返すメソッド
            //$request->user()->isAdmin()はユーザーが管理者かどうかを判断するメソッド
            return response()->json(['error' => 'Insufficient privileges. Admin access required.'], 403);
        }

        return $next($request);
        //return $next($request);は次のミドルウェアを実行するメソッド
    }
}