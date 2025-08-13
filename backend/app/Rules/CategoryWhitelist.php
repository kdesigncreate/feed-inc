<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CategoryWhitelist implements ValidationRule
{
    /**
     * Allowed article categories
     */
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

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a string.');
            return;
        }

        // Normalize the input
        $normalizedValue = trim($value);
        
        // Check if the category is in the whitelist
        if (!in_array($normalizedValue, self::ALLOWED_CATEGORIES, true)) {
            $allowedList = implode(', ', self::ALLOWED_CATEGORIES);
            $fail("The :attribute must be one of the following: {$allowedList}");
            return;
        }

        // Additional length check for safety
        if (strlen($normalizedValue) > 50) {
            $fail('The :attribute must not exceed 50 characters.');
            return;
        }

        // Check for suspicious characters
        if (preg_match('/[<>"\']/', $normalizedValue)) {
            $fail('The :attribute contains invalid characters.');
            return;
        }
    }
}