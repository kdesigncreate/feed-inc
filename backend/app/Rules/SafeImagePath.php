<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeImagePath implements ValidationRule
//SafeImagePathは画像パスのサニタイズを指定するメソッド
//implementsは実装を指定するメソッド
//ValidationRuleはバリデーションルールを指定するメソッド
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    //validateはバリデーションを行うメソッド
    //string $attributeは属性を指定するメソッド
    //mixed $valueは値を指定するメソッド
    //Closure $failは失敗時の処理を指定するメソッド
    //voidは何も返さないことを指定するメソッド
    {
        if (!is_string($value)) {
            //$valueが文字列かどうかを判断するメソッド
        if (!is_string($value)) {
            //is_stringは文字列かどうかを判断するメソッド
            $fail('The :attribute must be a string.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (empty($value)) {
            //emptyは値が空かどうかを判断するメソッド
            return;
        }

        if (strpos($value, '..') !== false) {
            //strposは文字列に指定した文字列が含まれているかどうかを判断するメソッド
            //'..'は..を指定するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited path traversal sequences.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/^(\/|\\\\|[a-zA-Z]:\\\\)/', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/^(\/|\\\\|[a-zA-Z]:\\\\)/'は正規表現を指定するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute must be a relative path.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        //allowedExtensionsは許可された画像形式を指定するメソッド
        $extension = strtolower(pathinfo($value, PATHINFO_EXTENSION));
        //extensionは画像形式を指定するメソッド
        //strtolowerは文字列を小文字に変換するメソッド
        //pathinfoはパス情報を取得するメソッド
        //PATHINFO_EXTENSIONはパス情報の拡張子を取得するメソッド
        //pathinfo($value, PATHINFO_EXTENSION)はパス情報の拡張子を取得するメソッド

        if ($extension && !in_array($extension, $allowedExtensions)) {
            //in_arrayは配列に指定した値が含まれているかどうかを判断するメソッド
            //extensionは画像形式を指定するメソッド
            //allowedExtensionsは許可された画像形式を指定するメソッド
            $fail('The :attribute must be a valid image file (jpg, jpeg, png, gif, webp, svg).');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/[<>"|*?]/', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/[<>"|*?]/'は正規表現を指定するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains invalid characters.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        $allowedPrefixes = ['/image/', 'image/', '/uploads/', 'uploads/', 'http://', 'https://'];
        //allowedPrefixesは許可されたプレフィックスを指定するメソッド
        $hasValidPrefix = false;
        //hasValidPrefixは有効なプレフィックスかどうかを判断するメソッド

        foreach ($allowedPrefixes as $prefix) {
            //foreachは配列をループするメソッド
            //allowedPrefixesは許可されたプレフィックスを指定するメソッド
            //asは代入を指定するメソッド
            //prefixはプレフィックスを指定するメソッド
            if (strpos($value, $prefix) === 0) {
                //strposは文字列に指定した文字列が含まれているかどうかを判断するメソッド
                //$valueは値を指定するメソッド
                //$prefixはプレフィックスを指定するメソッド
                $hasValidPrefix = true;
                //hasValidPrefixは有効なプレフィックスかどうかを判断するメソッド
                break;
            }
        }

        if (!$hasValidPrefix) {
            //hasValidPrefixは有効なプレフィックスかどうかを判断するメソッド
            $fail('The :attribute must start with a valid path prefix (/image/, /uploads/, or a valid URL).');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/^https?:\/\//', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/^https?:\/\//'は正規表現を指定するメソッド
            //$valueは値を指定するメソッド
            if (!filter_var($value, FILTER_VALIDATE_URL)) {
                //filter_varはフィルタリングを行うメソッド
                //FILTER_VALIDATE_URLはURLかどうかを判断するメソッド
                $fail('The :attribute must be a valid URL.');
                //$failとは失敗時の処理を指定するメソッド
                return;
            }
        }
    }
}