'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import { secureStorage } from '@/lib/secureStorage';
import type { LoginCredentials, LoginResponse } from '@/types';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication state
    const checkAuthState = async () => {
      try {
        // Only check authentication if we're not on the login page
        if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
          setIsLoading(false);
          return;
        }
        
        // Get CSRF cookie first for authenticated requests
        const axios = (await import('axios')).default;
        const { API_CONFIG } = await import('@/lib/constants');
        
        await axios.get(`${API_CONFIG.BASE_URL}/sanctum/csrf-cookie`, { 
          withCredentials: true 
        });
        
        // Add small delay to ensure session cookie is processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then check authentication status
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.log('No valid session found:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response: LoginResponse = await authApi.login(credentials);
      
      // With SPA Cookie authentication, tokens are handled automatically via HttpOnly cookies
      setUser(response.user);
      
      // Verify session is working by checking user info
      setTimeout(async () => {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.warn('Session verification failed after login:', error);
        }
      }, 500);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // With SPA Cookie authentication, logout clears server-side session
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};