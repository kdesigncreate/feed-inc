'use client';

import { useEffect } from 'react';
import { secureStorage } from '@/lib/secureStorage';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Security monitoring component that handles token validation and security events
 */
export const SecurityMonitor: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    // Check token validity every 5 minutes
    const tokenCheckInterval = setInterval(() => {
      if (!secureStorage.isTokenValid()) {
        console.warn('Security: Invalid token detected, logging out');
        logout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Check for token expiration warning (30 minutes before expiry)
    const expirationCheckInterval = setInterval(() => {
      const expiration = secureStorage.getTokenExpiration();
      if (expiration) {
        const timeUntilExpiry = expiration.getTime() - Date.now();
        const thirtyMinutes = 30 * 60 * 1000;
        
        if (timeUntilExpiry <= thirtyMinutes && timeUntilExpiry > 0) {
          console.warn('Security: Token expires in less than 30 minutes');
          // Could show a warning to the user here
        }
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    // Monitor for suspicious activity (multiple tabs, etc.)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // When tab becomes visible, validate token
        if (!secureStorage.isTokenValid()) {
          console.warn('Security: Token invalidated while tab was hidden');
          logout();
        }
      }
    };

    // Monitor for storage events (potential token tampering)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' && e.newValue) {
        console.warn('Security: Attempted to use insecure localStorage for token');
        localStorage.removeItem('auth_token');
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      clearInterval(tokenCheckInterval);
      clearInterval(expirationCheckInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [logout]);

  // This component doesn't render anything visible
  return null;
};

export default SecurityMonitor;