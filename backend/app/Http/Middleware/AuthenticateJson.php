<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class AuthenticateJson extends Middleware
{
    protected function redirectTo($request): ?string
    //redirectToメソッドはリダイレクトを行うメソッド
    //Request $requestはリクエストを指定するメソッド
    //?stringは文字列を指定するメソッド
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            //$request->expectsJson()はリクエストがJSONかどうかを判断するメソッド
            //expectsJsonはexpectsJsonメソッドを指定するメソッド
            //$request->is('api/*')はリクエストがapiかどうかを判断するメソッド
            //isはisメソッドを指定するメソッド
            return null;
            //return null;はnullを返すメソッド
        }

        return route('login');
        //route('login');はloginページにリダイレクトするメソッド
    }

    protected function unauthenticated($request, array $guards)
    //unauthenticatedメソッドは未認証ユーザーを処理するメソッド
    //$requestはリクエストを受け取るメソッド
    //array $guardsはガードを受け取るメソッド
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            //$request->expectsJson()はリクエストがJSONかどうかを判断するメソッド
            //expectsJsonはexpectsJsonメソッドを指定するメソッド
            //$request->is('api/*')はリクエストがapiかどうかを判断するメソッド
            //isはisメソッドを指定するメソッド
            abort(response()->json([
                //abortはabortメソッドを指定するメソッド
                //response()->jsonはJSONを返すメソッド
                'message' => 'Unauthenticated.',
                'error' => 'Authentication required'
            ], 401));
        }

        parent::unauthenticated($request, $guards);
        //parent::unauthenticated($request, $guards);は親クラスのunauthenticatedメソッドを実行するメソッド
        //parentは親クラスを指定するメソッド
        //unauthenticatedはunauthenticatedメソッドを指定するメソッド
        //$requestはリクエストを受け取るメソッド
        //$guardsはガードを受け取るメソッド
    }
}