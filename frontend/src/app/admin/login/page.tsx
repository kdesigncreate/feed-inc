'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authErrorHandler } from '@/lib/errorHandler';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InputValidator } from '@/lib/validation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email: string[];
    password: string[];
  }>({
    email: [],
    password: [],
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { login } = useAuth();
  const router = useRouter();

  const validateForm = useCallback(() => {
    const emailValidation = InputValidator.validateEmail(credentials.email || '');
    const passwordValidation = InputValidator.validatePassword(credentials.password || '');
    
    setFieldErrors({
      email: emailValidation.errors || [],
      password: passwordValidation.errors || [],
    });

    return emailValidation.isValid && passwordValidation.isValid;
  }, [credentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    // Rate limiting check
    if (loginAttempts >= 5) {
      setError('ログイン試行回数が上限に達しました。しばらくしてから再度お試しください。');
      return;
    }

    setIsLoading(true);

    try {
      // Sanitize input before sending
      const sanitizedCredentials = {
        email: InputValidator.sanitizeInput(credentials.email),
        password: credentials.password, // Don't sanitize password as it may contain special chars
      };

      await login(sanitizedCredentials);
      setLoginAttempts(0); // Reset attempts on success
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      setLoginAttempts(prev => prev + 1);
      setError(authErrorHandler.login(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Real-time validation and sanitization
    const sanitizedValue = name === 'email' ? InputValidator.sanitizeInput(value || '') : (value || '');
    
    setCredentials(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear field errors when user starts typing
    const currentErrors = fieldErrors[name as keyof typeof fieldErrors];
    if (currentErrors && currentErrors.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Image
              src="/image/logo_feed.png"
              alt="Feed Inc. Logo"
              width={200}
              height={80}
              priority
              className="h-auto w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            管理者ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            管理者アカウントでログインしてください
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  (fieldErrors.email?.length || 0) > 0 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="メールアドレスを入力"
                value={credentials.email}
                onChange={handleChange}
              />
              {(fieldErrors.email?.length || 0) > 0 && (
                <div className="mt-1">
                  {fieldErrors.email?.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:z-10 sm:text-sm ${
                  (fieldErrors.password?.length || 0) > 0 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="パスワードを入力"
                value={credentials.password}
                onChange={handleChange}
              />
              {(fieldErrors.password?.length || 0) > 0 && (
                <div className="mt-1">
                  {fieldErrors.password?.map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-500 text-sm font-medium rounded-md text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoadingSpinner /> : 'ログイン'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}