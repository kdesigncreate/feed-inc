<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeHtmlContent implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!is_string($value)) {
            $fail('The :attribute must be a string.');
            return;
        }

        // Check for dangerous script tags
        if (preg_match('/<script\b[^>]*>(.*?)<\/script>/is', $value)) {
            $fail('The :attribute contains prohibited script tags.');
            return;
        }

        // Check for dangerous event handlers
        $dangerousEvents = [
            'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
            'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown',
            'onkeyup', 'onkeypress', 'javascript:'
        ];

        foreach ($dangerousEvents as $event) {
            if (stripos($value, $event) !== false) {
                $fail("The :attribute contains prohibited event handler: {$event}");
                return;
            }
        }

        // Check for data URIs that could contain malicious content
        if (preg_match('/data:\s*[^;,]+;base64,/i', $value)) {
            $fail('The :attribute contains prohibited data URIs.');
            return;
        }

        // Check for iframe tags (potential for clickjacking)
        if (preg_match('/<iframe\b[^>]*>/i', $value)) {
            $fail('The :attribute contains prohibited iframe tags.');
            return;
        }

        // Check for object/embed tags
        if (preg_match('/<(object|embed)\b[^>]*>/i', $value)) {
            $fail('The :attribute contains prohibited object/embed tags.');
            return;
        }

        // Check for link tags with javascript
        if (preg_match('/<link\b[^>]*javascript:/i', $value)) {
            $fail('The :attribute contains prohibited javascript links.');
            return;
        }

        // Check for meta refresh redirects
        if (preg_match('/<meta\b[^>]*http-equiv=["\']refresh["\'][^>]*>/i', $value)) {
            $fail('The :attribute contains prohibited meta refresh tags.');
            return;
        }
    }
}