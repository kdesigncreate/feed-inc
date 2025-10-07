/**
 * セキュリティヘッダーのテストユーティリティ
 */

interface SecurityHeaderCheck {
  header: string;
  expected: string | RegExp;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface SecurityTestResult {
  header: string;
  present: boolean;
  value?: string;
  expected: string | RegExp;
  passed: boolean;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export class SecurityHeaderTester {
  private static readonly SECURITY_HEADERS: SecurityHeaderCheck[] = [
    {
      header: 'X-Frame-Options',
      expected: 'DENY',
      description: 'クリックジャッキング攻撃を防止',
      severity: 'high'
    },
    {
      header: 'X-Content-Type-Options',
      expected: 'nosniff',
      description: 'MIMEタイプスニッフィング攻撃を防止',
      severity: 'medium'
    },
    {
      header: 'X-XSS-Protection',
      expected: /^1;\s*mode=block$/,
      description: 'XSS攻撃を防止',
      severity: 'high'
    },
    {
      header: 'Strict-Transport-Security',
      expected: /max-age=\d+/,
      description: 'HTTPS接続を強制',
      severity: 'high'
    },
    {
      header: 'Referrer-Policy',
      expected: /strict-origin-when-cross-origin|no-referrer|same-origin/,
      description: 'リファラー情報の漏洩を防止',
      severity: 'medium'
    },
    {
      header: 'Content-Security-Policy',
      expected: /default-src/,
      description: 'XSS攻撃とコードインジェクションを防止',
      severity: 'high'
    },
    {
      header: 'Permissions-Policy',
      expected: /camera=\(\)/,
      description: 'ブラウザAPI使用を制限',
      severity: 'low'
    }
  ];

  /**
   * 現在のページのセキュリティヘッダーをテスト
   */
  static async testCurrentPage(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    try {
      const response = await fetch(window.location.href, {
        method: 'HEAD',
        cache: 'no-cache'
      });

      for (const check of this.SECURITY_HEADERS) {
        const headerValue = response.headers.get(check.header);
        const present = headerValue !== null;
        let passed = false;

        if (present && headerValue) {
          if (typeof check.expected === 'string') {
            passed = headerValue.toLowerCase() === check.expected.toLowerCase();
          } else {
            passed = check.expected.test(headerValue);
          }
        }

        results.push({
          header: check.header,
          present,
          value: headerValue || undefined,
          expected: check.expected,
          passed,
          description: check.description,
          severity: check.severity
        });
      }

      return results;
    } catch (error) {
      console.error('Security header test failed:', error);
      return [];
    }
  }

  /**
   * API エンドポイントのセキュリティヘッダーをテスト
   */
  static async testApiEndpoint(url: string): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];
    
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        cache: 'no-cache'
      });

      // API特有のセキュリティヘッダーをチェック
      const apiHeaders: SecurityHeaderCheck[] = [
        ...this.SECURITY_HEADERS,
        {
          header: 'Cross-Origin-Resource-Policy',
          expected: 'same-origin',
          description: 'クロスオリジンリソース共有を制限',
          severity: 'medium'
        },
        {
          header: 'Cross-Origin-Opener-Policy',
          expected: 'same-origin',
          description: 'クロスオリジンウィンドウアクセスを制限',
          severity: 'medium'
        }
      ];

      for (const check of apiHeaders) {
        const headerValue = response.headers.get(check.header);
        const present = headerValue !== null;
        let passed = false;

        if (present && headerValue) {
          if (typeof check.expected === 'string') {
            passed = headerValue.toLowerCase() === check.expected.toLowerCase();
          } else {
            passed = check.expected.test(headerValue);
          }
        }

        results.push({
          header: check.header,
          present,
          value: headerValue || undefined,
          expected: check.expected,
          passed,
          description: check.description,
          severity: check.severity
        });
      }

      return results;
    } catch (error) {
      console.error('API security header test failed:', error);
      return [];
    }
  }

  /**
   * テスト結果をコンソールに出力
   */
  static logResults(results: SecurityTestResult[], title: string = 'Security Header Test'): void {
    console.group(`🛡️ ${title}`);
    
    const passed = results.filter(r => r.passed);
    const failed = results.filter(r => !r.passed);
    const missing = results.filter(r => !r.present);
    
    console.info(`✅ Passed: ${passed.length}/${results.length}`);
    
    if (failed.length > 0) {
      console.group('❌ Failed Tests');
      failed.forEach(result => {
        console.warn(
          `${result.header}: Expected "${result.expected}" but got "${result.value || 'missing'}" - ${result.description}`
        );
      });
      console.groupEnd();
    }

    if (missing.length > 0) {
      console.group('⚠️ Missing Headers');
      missing.forEach(result => {
        const severity = result.severity === 'high' ? '🔴' : 
                        result.severity === 'medium' ? '🟡' : '🟢';
        console.warn(`${severity} ${result.header}: ${result.description}`);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * セキュリティスコアを計算
   */
  static calculateSecurityScore(results: SecurityTestResult[]): {
    score: number;
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    details: string;
  } {
    const weights = { high: 3, medium: 2, low: 1 };
    let maxScore = 0;
    let currentScore = 0;

    results.forEach(result => {
      const weight = weights[result.severity];
      maxScore += weight;
      if (result.passed) {
        currentScore += weight;
      }
    });

    const percentage = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;
    
    let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
    if (percentage >= 95) grade = 'A+';
    else if (percentage >= 85) grade = 'A';
    else if (percentage >= 75) grade = 'B';
    else if (percentage >= 65) grade = 'C';
    else if (percentage >= 50) grade = 'D';
    else grade = 'F';

    return {
      score: Math.round(percentage),
      grade,
      details: `${currentScore}/${maxScore} weighted points`
    };
  }
}

// 開発環境でのみテストを自動実行
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // ページロード後にテストを実行
  window.addEventListener('load', async () => {
    const results = await SecurityHeaderTester.testCurrentPage();
    SecurityHeaderTester.logResults(results);
    
    const score = SecurityHeaderTester.calculateSecurityScore(results);
    console.info(`🔒 Security Score: ${score.score}% (${score.grade}) - ${score.details}`);
  });
}