<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeImagePath implements ValidationRule
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

        // Allow empty values for optional fields
        if (empty($value)) {
            return;
        }

        // Check for path traversal attempts
        if (strpos($value, '..') !== false) {
            $fail('The :attribute contains prohibited path traversal sequences.');
            return;
        }

        // Check for absolute paths that might access system files
        if (preg_match('/^(\/|\\\\|[a-zA-Z]:\\\\)/', $value)) {
            $fail('The :attribute must be a relative path.');
            return;
        }

        // Allow only specific image extensions
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $extension = strtolower(pathinfo($value, PATHINFO_EXTENSION));
        
        if ($extension && !in_array($extension, $allowedExtensions)) {
            $fail('The :attribute must be a valid image file (jpg, jpeg, png, gif, webp, svg).');
            return;
        }

        // Check for suspicious characters
        if (preg_match('/[<>"|*?]/', $value)) {
            $fail('The :attribute contains invalid characters.');
            return;
        }

        // Ensure the path starts with allowed prefixes
        $allowedPrefixes = ['/image/', 'image/', '/uploads/', 'uploads/', 'http://', 'https://'];
        $hasValidPrefix = false;
        
        foreach ($allowedPrefixes as $prefix) {
            if (strpos($value, $prefix) === 0) {
                $hasValidPrefix = true;
                break;
            }
        }

        if (!$hasValidPrefix) {
            $fail('The :attribute must start with a valid path prefix (/image/, /uploads/, or a valid URL).');
            return;
        }

        // For URLs, validate domain if it's external
        if (preg_match('/^https?:\/\//', $value)) {
            if (!filter_var($value, FILTER_VALIDATE_URL)) {
                $fail('The :attribute must be a valid URL.');
                return;
            }
        }
    }
}