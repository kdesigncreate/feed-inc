'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authErrorHandler } from '@/lib/errorHandler';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InputValidator } from '@/lib/validation';
import Image from 'next/image';

export default function AdminLoginPage() {
  //AdminLoginPageは管理画面のログインページのコンポーネント。
  const [credentials, setCredentials] = useState({
    //credentialsは認証情報を表す。
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  //isLoadingはローディング中かどうかを表す。
  const [error, setError] = useState<string | null>(null);
  //errorはエラーを表す。
  const [fieldErrors, setFieldErrors] = useState<{
    //fieldErrorsはフィールドエラーを表す。
    email: string[];
    password: string[];
  }>({ 
    email: [],
    password: [],
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  //loginAttemptsはログイン試行回数を表す。
  
  const { login } = useAuth();
  //useAuthは認証情報を取得するためのカスタムフック。
  const router = useRouter();
  //useRouterはルーターを取得するためのカスタムフック。

  const validateForm = useCallback(() => {
    //validateFormはフォームを検証するための関数。 
    //useCallbackはメモ化されたコールバック関数を作成するためのフック。
    const emailValidation = InputValidator.validateEmail(credentials.email || '');
    //InputValidator.validateEmail(credentials.email || '')はメールアドレスを検証するための関数。
    //credentials.email || ''はcredentials.emailがnullかどうかを判断する。
    const passwordValidation = InputValidator.validatePassword(credentials.password || '');
    //InputValidator.validatePassword(credentials.password || '')はパスワードを検証するための関数。
    //credentials.password || ''はcredentials.passwordがnullかどうかを判断する。
    setFieldErrors({
      email: emailValidation.errors || [],
      //emailValidation.errors || []はemailValidation.errorsがnullかどうかを判断する。
      password: passwordValidation.errors || [],
      //passwordValidation.errors || []はpasswordValidation.errorsがnullかどうかを判断する。
    });

    return emailValidation.isValid && passwordValidation.isValid;
    //emailValidation.isValidとpasswordValidation.isValidがtrueの場合はtrueを返す。
  }, [credentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    //handleSubmitはフォームを送信するための関数。
    //eはReact.FormEvent型のオブジェクト。
    //React.FormEventはフォームを送信するためのイベント。
    e.preventDefault();
    //e.preventDefault()はフォームを送信するための関数。
    setError(null);
    //setError(null)はエラーをクリアする。
    if (!validateForm()) {
      //validateFormがfalseの場合はreturnする。
      return;
    }

    if (loginAttempts >= 5) {
      //loginAttemptsが5以上の場合はエラーを表示する。
      setError('ログイン試行回数が上限に達しました。しばらくしてから再度お試しください。');
      return;
    }

    setIsLoading(true);
    //setIsLoading(true)はローディング中かどうかを表す。

    try {
      const sanitizedCredentials = {
        //sanitizedCredentialsは認証情報をサニタイズするためのオブジェクト。
        email: InputValidator.sanitizeInput(credentials.email),
        //メールアドレスをサニタイズするための関数。
        password: credentials.password,
        //credentials.passwordはパスワードを表す。
      };

      await login(sanitizedCredentials);
      //login(sanitizedCredentials)は認証情報を送信するための関数。
      setLoginAttempts(0); 
      //setLoginAttempts(0)はログイン試行回数をクリアする。
      router.push('/admin/dashboard');
      //router.push('/admin/dashboard')はダッシュボードページに遷移する。
    } catch (err: unknown) {
      setLoginAttempts(prev => prev + 1);
      //setLoginAttempts(prev => prev + 1)はログイン試行回数を増やす。
      //prevはログイン試行回数を表す。
      setError(authErrorHandler.login(err));
      //authErrorHandler.login(err)はエラーを処理するための関数。
    } finally {
      setIsLoading(false);
      //setIsLoading(false)はローディング中かどうかを表す。
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //handleChangeはフォームデータを変更するための関数。
    //eはReact.ChangeEvent<HTMLInputElement>型のオブジェクト。
    //React.ChangeEventはフォームデータを変更するためのイベント。
    //HTMLInputElementはinput要素を表す。
    const { name, value } = e.target;
    //nameはフォームデータの名前を表す。
    //valueはフォームデータの値を表す。
    //e.targetはeのtargetを表す。
    //targetはtargetを表す。（ここではinput要素を表す。）
    const sanitizedValue = name === 'email' ? InputValidator.sanitizeInput(value || '') : (value || '');
    //sanitizedValueはフォームデータをサニタイズするための値。
    //nameがemailの場合はInputValidator.sanitizeInput(value || '')をvalueにし、それ以外の場合はvalueをvalueにする。
    //value || ''はvalueがnullかどうかを判断する。
    setCredentials(prev => ({
      //setCredentialsはフォームデータを表す。
      ...prev,
      //...prevはprevのオブジェクトを展開する。
      [name]: sanitizedValue
      //[name]: sanitizedValueはnameをkeyにし、sanizedValueをvalueにする。
    }));

    const currentErrors = fieldErrors[name as keyof typeof fieldErrors];
    //currentErrorsはフィールドエラーを表す。
    //fieldErrorsのnameをkeyにし、fieldErrorsをvalueにする。
    if (currentErrors && currentErrors.length > 0) {
      //currentErrorsがtrueかつcurrentErrors.lengthが0以上の場合はsetFieldErrorsはフィールドエラーを表す。
      setFieldErrors(prev => ({
        //setFieldErrorsはフィールドエラーを表す。
        ...prev,
        //...prevはprevのオブジェクトを展開する。
        [name]: []
        //[name]: []はnameをkeyにし、[]をvalueにする。
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