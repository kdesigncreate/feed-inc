<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{

    //loginメソッドはログインするメソッド
    public function login(Request $request)
    //Request $requestはリクエストを受け取るメソッド
    {
        $request->validate([
            //validateメソッドはバリデーションを行うメソッド
            'email' => ['required', 'string', 'email'],
            //emailはメールアドレスを指定するメソッド
            'password' => ['required', 'string'],
            //passwordはパスワードを指定するメソッド
        ]);

        $user = User::where('email', $request->email)->first();
        //User::where('email', $request->email)はUserモデルのemailが$request->emailと一致するデータを取得するメソッド
        //first()は最初のデータを取得するメソッド
        if (!$user || !Hash::check($request->password, $user->password)) {
            //!$userは$userがnullかどうかを判断するメソッド
            //hashはハッシュ化されたパスワードを指定するメソッド
            //!Hash::check($request->password, $user->password)は$request->passwordと$user->passwordが一致するかどうかを判断するメソッド
            throw ValidationException::withMessages([
                //throwは例外を投げるメソッド
                //ValidationException::withMessagesは
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        auth('web')->login($user, $request->boolean('remember'));
        //auth('web')->login($user, $request->boolean('remember'))はユーザーをログインするメソッド
        //auth('web')はwebguardを指定するメソッド
        //login($user, $request->boolean('remember'))はユーザーをログインするメソッド
        //$request->boolean('remember')はrememberボタンを押したかどうかを判断するメソッド

        return response()->json([
            //response()->jsonはJSONを返すメソッド
            'user' => $user->only(['id', 'name', 'email', 'role']),
            //$user->only(['id', 'name', 'email', 'role'])は$userのid, name, email, roleを取得するメソッド
            //onlyはonlyメソッドを指定するメソッド
            'message' => 'Logged in successfully'
            //messageはメッセージを指定するメソッド
        ]);
    }

    //registerメソッドは登録するメソッド
    public function register(Request $request)
    //registerメソッドは登録するメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        return response()->json([
            //response()->jsonはJSONを返すメソッド
            'error' => 'Registration is disabled. Please contact administrator.',
        ], 403);
    }

    //logoutメソッドはログアウトするメソッド
    public function logout(Request $request)
    //logoutメソッドはログアウトするメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        auth('web')->logout();
        //auth('web')->logout()はユーザーをログアウトするメソッド
        //auth('web')はwebguardを指定するメソッド
        //logout()はユーザーをログアウトするメソッド
        
        $request->session()->invalidate();
        //request->session()->invalidate()はセッションを無効化するメソッド
        $request->session()->regenerateToken();
        //request->session()->regenerateToken()はセッションを再生成するメソッド

        return response()->json(['message' => 'Logged out successfully']);
        //response()->jsonはJSONを返すメソッド
        //['message' => 'Logged out successfully']はメッセージを指定するメソッド
    }
    
    //userメソッドはユーザーを取得するメソッド
    public function user(Request $request)
    //userメソッドはユーザーを取得するメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        return response()->json(auth()->user());
        //response()->jsonはJSONを返すメソッド
        //auth()->user()はユーザーを取得するメソッド
    }
    
    //csrfメソッドはcsrfを取得するメソッド
    public function csrf(Request $request)
    //csrfメソッドはcsrfを取得するメソッド
    //Request $requestはリクエストを受け取るメソッド
    {
        return response()->json(['csrf_token' => csrf_token()]);
        //response()->jsonはJSONを返すメソッド
        //['csrf_token' => csrf_token()]はcsrf_tokenを指定するメソッド
    }
}
