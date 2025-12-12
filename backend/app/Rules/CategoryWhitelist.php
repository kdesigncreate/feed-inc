<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CategoryWhitelist implements ValidationRule
//CategoryWhitelistはカテゴリーのホワイトリストを指定するメソッド
//implementsは実装を指定するメソッド
//ValidationRuleはバリデーションルールを指定するメソッド
{
    private const ALLOWED_CATEGORIES = [
        '店頭販促',
        'デザイン', 
        'キャンペーン',
        'イベント',
        'デジタルプロモーション',
        '営業ツール',
        'ノベルティ',
        'すべて',
        'all'
    ];

    public function validate(string $attribute, mixed $value, Closure $fail): void
    //validateはバリデーションを行うメソッド
    //string $attributeは属性を指定するメソッド
    //mixed $valueは値を指定するメソッド
    //Closure $failは失敗時の処理を指定するメソッド
    //voidは何も返さないことを指定するメソッド
    {
        if (!is_string($value)) {
            //$valueが文字列かどうかを判断するメソッド
            $fail('The :attribute must be a string.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        $normalizedValue = trim($value);
        //normalizedValueは正規化された値を指定するメソッド
        //trimは値をトリミングするメソッド

        if (!in_array($normalizedValue, self::ALLOWED_CATEGORIES, true)) {
            //in_arrayは配列に値が含まれているかどうかを判断するメソッド
            //$normalizedValueは正規化された値を指定するメソッド
            //selfとは自身のクラスを指定するメソッド
            //self::ALLOWED_CATEGORIESは許可されたカテゴリーを指定するメソッド
            //trueは厳密な比較を行うことを指定するメソッド
            $allowedList = implode(', ', self::ALLOWED_CATEGORIES);
            //implodeは配列を結合するメソッド
            //', 'は区切り文字を指定するメソッド
            //self::ALLOWED_CATEGORIESは許可されたカテゴリーを指定するメソッド
            $fail("The :attribute must be one of the following: {$allowedList}");
            //failとは失敗時の処理を指定するメソッド
            //allowedListは許可されたリストを指定するメソッド
            return;
        }

        // Additional length check for safety
        if (strlen($normalizedValue) > 50) {
            //strlenは文字列の長さを取得するメソッド
            //$normalizedValueは正規化された値を指定するメソッド
            //50は50文字を指定するメソッド
            $fail('The :attribute must not exceed 50 characters.');
            //failとは失敗時の処理を指定するメソッド
            return;
        }

        // Check for suspicious characters
        if (preg_match('/[<>"\']/', $normalizedValue)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/[<>"\']/'は正規表現を指定するメソッド
            //$normalizedValueは正規化された値を指定するメソッド
            $fail('The :attribute contains invalid characters.');
            //failとは失敗時の処理を指定するメソッド
            return;
        }
    }
}