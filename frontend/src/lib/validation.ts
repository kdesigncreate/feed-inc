/**
 * Frontend validation utilities with security focus
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export class InputValidator {
  /**
   * Validate email format with security considerations
   */
  static validateEmail(email?: string): ValidationResult {
    const errors: string[] = [];
    
    // Ensure email is a string
    const emailStr = email || '';
    
    if (!emailStr || emailStr.trim().length === 0) {
      errors.push('メールアドレスは必須です');
    } else {
      // Length check
      if (emailStr.length > 255) {
        errors.push('メールアドレスは255文字以内で入力してください');
      }

      // Format validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(emailStr)) {
        errors.push('有効なメールアドレスを入力してください');
      }

      // Security checks
      if (emailStr.includes('<') || emailStr.includes('>') || emailStr.includes('"')) {
        errors.push('メールアドレスに無効な文字が含まれています');
      }

      // Prevent injection attempts
      if (/['\";\\]/.test(emailStr)) {
        errors.push('メールアドレスに無効な文字が含まれています');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password with strength requirements
   */
  static validatePassword(password?: string): ValidationResult {
    const errors: string[] = [];

    // Ensure password is a string
    const passwordStr = password || '';

    if (!passwordStr || passwordStr.length === 0) {
      errors.push('パスワードは必須です');
    } else {
      // Length requirements
      if (passwordStr.length < 8) {
        errors.push('パスワードは8文字以上で入力してください');
      }
      
      if (passwordStr.length > 255) {
        errors.push('パスワードは255文字以内で入力してください');
      }

      // Strength requirements (relaxed for Japanese environment)
      let strengthScore = 0;
      if (/[a-z]/.test(passwordStr)) strengthScore++;
      if (/[A-Z]/.test(passwordStr)) strengthScore++;
      if (/[0-9]/.test(passwordStr)) strengthScore++;
      if (/[!@#$%^&*(),.?":{}|<>]/.test(passwordStr)) strengthScore++;

      if (strengthScore < 3) {
        errors.push('パスワードは大文字、小文字、数字、記号のうち3種類以上を含んでください');
      }

      // Common weak passwords
      const weakPasswords = [
        'password', 'password123', '12345678', 'admin123',
        'qwerty123', 'abc123456', 'password1'
      ];
      if (weakPasswords.includes(passwordStr.toLowerCase())) {
        errors.push('より安全なパスワードを設定してください');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate article title
   */
  static validateTitle(title: string): ValidationResult {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('タイトルは必須です');
    } else {
      const trimmed = title.trim();
      
      if (trimmed.length < 3) {
        errors.push('タイトルは3文字以上で入力してください');
      }
      
      if (trimmed.length > 255) {
        errors.push('タイトルは255文字以内で入力してください');
      }

      // Check for dangerous HTML tags
      if (/<script|<iframe|<object|<embed|javascript:|on\w+=/i.test(trimmed)) {
        errors.push('タイトルに無効なコンテンツが含まれています');
      }

      // Check for excessive special characters
      const specialCharCount = (trimmed.match(/[<>'"&]/g) || []).length;
      if (specialCharCount > 3) {
        errors.push('特殊文字の使用を控えてください');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate article content
   */
  static validateContent(content: string): ValidationResult {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('コンテンツは必須です');
    } else {
      const trimmed = content.trim();
      
      if (trimmed.length < 10) {
        errors.push('コンテンツは10文字以上で入力してください');
      }
      
      if (trimmed.length > 100000) {
        errors.push('コンテンツは100,000文字以内で入力してください');
      }

      // Security checks for dangerous content
      const dangerousPatterns = [
        /<script\b[^>]*>(.*?)<\/script>/i,
        /<iframe\b[^>]*>/i,
        /<object\b[^>]*>/i,
        /<embed\b[^>]*>/i,
        /javascript:/i,
        /data:\s*[^;,]+;base64,/i,
        /<link\b[^>]*javascript:/i,
        /<meta\b[^>]*http-equiv=["\']refresh["\']/i
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmed)) {
          errors.push('コンテンツに無効な要素が含まれています');
          break;
        }
      }

      // Check for excessive event handlers
      const eventHandlerCount = (trimmed.match(/on\w+=/gi) || []).length;
      if (eventHandlerCount > 0) {
        errors.push('イベントハンドラーは使用できません');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate category selection
   */
  static validateCategory(category: string): ValidationResult {
    const errors: string[] = [];
    const allowedCategories = [
      '店頭販促', 'デザイン', 'キャンペーン', 'イベント', 
      'デジタルプロモーション', '営業ツール', 'ノベルティ'
    ];

    if (!category || category.trim().length === 0) {
      errors.push('カテゴリーを選択してください');
    } else if (!allowedCategories.includes(category)) {
      errors.push('有効なカテゴリーを選択してください');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate search query
   */
  static validateSearchQuery(query: string): ValidationResult {
    const errors: string[] = [];

    if (query && query.length > 0) {
      if (query.length > 100) {
        errors.push('検索キーワードは100文字以内で入力してください');
      }

      // Allow only safe characters (alphanumeric, spaces, Japanese characters)
      const safePattern = /^[a-zA-Z0-9\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\u3400-\u4DBF]+$/;
      if (!safePattern.test(query)) {
        errors.push('検索キーワードに無効な文字が含まれています');
      }

      // Check for injection attempts
      if (/['";<>\\]/.test(query)) {
        errors.push('検索キーワードに無効な文字が含まれています');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate image path/URL
   */
  static validateImagePath(path: string): ValidationResult {
    const errors: string[] = [];

    if (path && path.length > 0) {
      // Length check
      if (path.length > 500) {
        errors.push('画像パスが長すぎます');
      }

      // Path traversal check
      if (path.includes('..') || path.includes('\\')) {
        errors.push('無効な画像パスです');
      }

      // Valid extensions
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const hasValidExtension = validExtensions.some(ext => 
        path.toLowerCase().endsWith(ext)
      );

      // Valid prefixes
      const validPrefixes = ['/image/', 'image/', '/uploads/', 'uploads/', 'http://', 'https://'];
      const hasValidPrefix = validPrefixes.some(prefix => path.startsWith(prefix));

      if (!hasValidPrefix) {
        errors.push('画像は指定されたディレクトリから選択してください');
      }

      if (path.includes('://') && !hasValidExtension) {
        // For URLs, be more lenient but still check for basic validity
        try {
          new URL(path);
        } catch {
          errors.push('有効な画像URLを入力してください');
        }
      } else if (!hasValidExtension) {
        errors.push('対応している画像形式（jpg, png, gif, webp, svg）を選択してください');
      }

      // Security checks
      if (/<script|javascript:|data:/i.test(path)) {
        errors.push('無効な画像パスです');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * General string validation with customizable rules
   */
  static validateString(value: string, rules: ValidationRule, fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (rules.required && (!value || value.trim().length === 0)) {
      errors.push(`${fieldName}は必須です`);
    }

    if (value && value.length > 0) {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${fieldName}は${rules.minLength}文字以上で入力してください`);
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName}は${rules.maxLength}文字以内で入力してください`);
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${fieldName}の形式が正しくありません`);
      }

      if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize user input (basic client-side sanitization)
   */
  static sanitizeInput(input?: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 10000); // Limit length
  }
}