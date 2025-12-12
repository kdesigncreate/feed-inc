<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    //HasApiTokensを使用するメソッド
    //HasFactoryを使用するメソッド
    //Notifiableを使用するメソッド

    @var list<string>
    //@varとは変数を指定するメソッド
    //list<string>はlist<string>を指定するメソッド
     
    protected $fillable = [
        //protectedはプロパティを指定するメソッド
        //fillableはフィールドを指定するメソッド
        'name',
        //nameは名前を指定するメソッド
        'email',
        //emailはメールアドレスを指定するメソッド
        'password',
        //passwordはパスワードを指定するメソッド
        'role',
        //roleはロールを指定するメソッド
    ];

    
    @var list<string>
    
    protected $hidden = [
        //protectedはプロパティを指定するメソッド
        //hiddenは非表示にするメソッド
        'password',
        //passwordはパスワードを指定するメソッド
        'remember_token',
        //remember_tokenはリメンバートークンを指定するメソッド
    ];

    @return array<string, string>
    //@returnは戻り値を指定するメソッド
    //array<string, string>はarray<string, string>を指定するメソッド

    protected function casts(): array
    //protectedはプロパティを指定するメソッド
    //castsはキャストを指定するメソッド
    //(): arrayはarrayを指定するメソッド
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    //isAdminは管理者かどうかを判断するメソッド
    {
        return $this->role === 'admin';
        //roleはロールを指定するメソッド
        //===は等しいかどうかを判断するメソッド
        //'admin'は管理者を指定するメソッド
    }

    protected static function boot()
    //protectedはプロパティを指定するメソッド
    //staticは静的メソッドを指定するメソッド
    //bootはブートを指定するメソッド
    //ブートとはモデルの初期化を行うメソッド
    {
        parent::boot();
        //parent::boot();は親クラスのブートを実行するメソッド
        //parentは親クラスを指定するメソッド
        //bootはブートを指定するメソッド
        
        static::creating(function ($user) {
            //staticは静的メソッドを指定するメソッド
            //creatingは作成時に実行するメソッド
            //function ($user)は$userを指定するメソッド
            if (empty($user->role)) {
                //empty($user->role)は$user->roleが空ではない場合にtrueを返すメソッド
                $user->role = 'user';
                //user->role = 'user'は$user->roleを'user'に更新するメソッド
            }
        });
    }
}
