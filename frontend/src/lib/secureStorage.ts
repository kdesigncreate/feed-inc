/**
 * Secure token storage utility
 * Implements multiple security layers for token management
 */

interface StorageOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number; // in seconds
}

class SecureTokenStorage {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ENCRYPTED_KEY = 'auth_session';
  private readonly FINGERPRINT_KEY = 'browser_fp';

  /**
   * Simple XOR encryption for client-side storage
   * Note: This is not cryptographically secure but adds a layer of obfuscation
   */
  private simpleEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  private simpleDecrypt(encrypted: string, key: string): string {
    try {
      const text = atob(encrypted);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
      }
      return result;
    } catch {
      return '';
    }
  }

  /**
   * Generate browser fingerprint for additional security
   */
  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx?.fillText('security-fingerprint', 2, 2);
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      navigator.hardwareConcurrency || 0,
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  }

  /**
   * Get encryption key based on browser fingerprint
   */
  private getEncryptionKey(): string {
    let fingerprint = sessionStorage.getItem(this.FINGERPRINT_KEY);
    if (!fingerprint) {
      fingerprint = this.generateFingerprint();
      sessionStorage.setItem(this.FINGERPRINT_KEY, fingerprint);
    }
    return fingerprint;
  }

  /**
   * Store token securely using multiple storage mechanisms
   */
  setToken(token: string, options: StorageOptions = {}): void {
    const encryptionKey = this.getEncryptionKey();
    const encryptedToken = this.simpleEncrypt(token, encryptionKey);
    
    // Add timestamp for expiration checking
    const tokenData = {
      token: encryptedToken,
      timestamp: Date.now(),
      fingerprint: this.getEncryptionKey(),
    };

    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem(this.ENCRYPTED_KEY, JSON.stringify(tokenData));
    
    // Also store a shortened version in memory for quick access
    this.memoryToken = token;
    
    // Set expiration timer if maxAge is provided
    if (options.maxAge) {
      setTimeout(() => {
        this.removeToken();
      }, options.maxAge * 1000);
    }
  }

  private memoryToken: string | null = null;

  /**
   * Retrieve token with security validation
   */
  getToken(): string | null {
    // First check memory storage
    if (this.memoryToken) {
      return this.memoryToken;
    }

    try {
      const storedData = sessionStorage.getItem(this.ENCRYPTED_KEY);
      if (!storedData) {
        return null;
      }

      const tokenData = JSON.parse(storedData);
      const currentFingerprint = this.getEncryptionKey();
      
      // Validate fingerprint to detect session hijacking
      if (tokenData.fingerprint !== currentFingerprint) {
        console.warn('Security: Browser fingerprint mismatch detected');
        this.removeToken();
        return null;
      }

      // Check if token is expired (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - tokenData.timestamp > maxAge) {
        console.warn('Security: Token expired');
        this.removeToken();
        return null;
      }

      const decryptedToken = this.simpleDecrypt(tokenData.token, currentFingerprint);
      if (decryptedToken) {
        this.memoryToken = decryptedToken;
        return decryptedToken;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      this.removeToken();
    }

    return null;
  }

  /**
   * Remove token from all storage locations
   */
  removeToken(): void {
    // Clear from all storage mechanisms
    sessionStorage.removeItem(this.ENCRYPTED_KEY);
    sessionStorage.removeItem(this.FINGERPRINT_KEY);
    localStorage.removeItem(this.TOKEN_KEY); // Clean up legacy storage
    this.memoryToken = null;
  }

  /**
   * Validate token integrity
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) {
        this.removeToken();
        return false;
      }

      return true;
    } catch {
      this.removeToken();
      return false;
    }
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const secureStorage = new SecureTokenStorage();

// Legacy localStorage cleanup on module load
if (typeof window !== 'undefined') {
  // Clean up legacy localStorage tokens on page load
  if (localStorage.getItem('auth_token')) {
    console.warn('Security: Migrating from insecure localStorage to secure storage');
    localStorage.removeItem('auth_token');
  }
}