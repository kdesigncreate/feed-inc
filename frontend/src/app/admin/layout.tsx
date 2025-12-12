'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AdminLayout({
  //AdminLayoutは管理画面のレイアウトのコンポーネント。
  children,
  //childrenは子コンポーネントを表す。
}: {
  children: React.ReactNode;
  //childrenは子コンポーネントを表す。
  //React.ReactNodeはReactのノードを表す。
}) {
  return (
    //AuthProviderは認証情報を提供するためのコンポーネント。
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}