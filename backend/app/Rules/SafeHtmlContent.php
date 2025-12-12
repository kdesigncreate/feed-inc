<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeHtmlContent implements ValidationRule
//SafeHtmlContentはHTMLコンテンツのサニタイズを指定するメソッド
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
            $fail('The :attribute must be a string.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/<script\b[^>]*>(.*?)<\/script>/is', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/<script\b[^>]*>(.*?)<\/script>/is'は正規表現を指定するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited script tags.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        $dangerousEvents = [
            //dangerousEventsは危険なイベントを指定するメソッド
            'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown',
            'onkeyup', 'onkeypress', 'javascript:'
        ];

        foreach ($dangerousEvents as $event) {
            //foreachは配列をループするメソッド
            //dangerousEventsは危険なイベントを指定するメソッド
            //asは代入を指定するメソッド
            //eventはイベントを指定するメソッド
            if (stripos($value, $event) !== false) {
                //striposは大文字小文字を区別せずに比較するメソッド
                //$valueは値を指定するメソッド
                //$eventはイベントを指定するメソッド
                $fail("The :attribute contains prohibited event handler: {$event}");
                //$failとは失敗時の処理を指定するメソッド
                return;
            }
        }

        if (preg_match('/data:\s*[^;,]+;base64,/i', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/data:\s*[^;,]+;base64,/i'は正規表現を指定するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited data URIs.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/<iframe\b[^>]*>/i', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/<iframe\b[^>]*>/i'は正規表現を指定するメソッド
            //iframeはiframeタグを指定するメソッド
            //iは大文字小文字を区別せずに比較するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited iframe tags.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/<(object|embed)\b[^>]*>/i', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/<(object|embed)\b[^>]*>/i'は正規表現を指定するメソッド
            //objectはobjectタグを指定するメソッド
            //embedはembedタグを指定するメソッド
            //iは大文字小文字を区別せずに比較するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited object/embed tags.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/<link\b[^>]*javascript:/i', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/<link\b[^>]*javascript:/i'は正規表現を指定するメソッド
            //linkはlinkタグを指定するメソッド
            //javascriptはjavascriptを指定するメソッド
            //iは大文字小文字を区別せずに比較するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited javascript links.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }

        if (preg_match('/<meta\b[^>]*http-equiv=["\']refresh["\'][^>]*>/i', $value)) {
            //preg_matchは正規表現にマッチするかどうかを判断するメソッド
            //'/<meta\b[^>]*http-equiv=["\']refresh["\'][^>]*>/i'は正規表現を指定するメソッド
            //metaはmetaタグを指定するメソッド
            //http-equivはhttp-equivを指定するメソッド
            //refreshはrefreshを指定するメソッド
            //iは大文字小文字を区別せずに比較するメソッド
            //$valueは値を指定するメソッド
            $fail('The :attribute contains prohibited meta refresh tags.');
            //$failとは失敗時の処理を指定するメソッド
            return;
        }
    }
}