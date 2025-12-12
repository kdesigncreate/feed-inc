'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface AdminRouteProps {
  //interfaceとは型を定義するためのもの。
  //AdminRoutePropsはAdminRouteのPropsを表す。
  children: React.ReactNode;
  //childrenは子コンポーネントを表す。
  //React.ReactNodeはReactのノードを表す。
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  //AdminRouteはAdminRouteのコンポーネント。
  //React.FC<AdminRouteProps>はAdminRoutePropsをReactの関数コンポーネントにするためのもの。
  //childrenは子コンポーネントを表す。
  //子のコンポーネントとは親のコンポーネントの中にあるコンポーネントのこと。（ここではAdminLayoutの中にあるコンポーネント。）
  //React.ReactNodeはReactのノードを表す。
  const { user, isLoading, isAdmin } = useAuth();
  //useAuthは認証情報を取得するためのカスタムフック。
  //userはユーザーを表す。
  //isLoadingはローディング中かどうかを表す。
  //isAdminは管理者かどうかを表す。
  const router = useRouter();
  //useRouterはルーターを取得するためのカスタムフック。

  useEffect(() => {
    //useEffectは副作用を実行するためのもの。
    //副作用とは、コンポーネントの外側の状態を変更すること。（ここではユーザーが管理者でない場合はホームページに遷移する。）
    if (!isLoading) {
      //isLoadingがfalseの場合はif文の中に入る。
      if (!user) {
        //userがnullの場合はrouter.replace('/admin/login')に遷移する。  
        router.replace('/admin/login');
        //router.replace('/admin/login')はログインページに遷移する。
      } else if (!isAdmin) {
        //isAdminがfalseの場合はif文の中に入る。
        router.replace('/');
        //router.replace('/')はホームページに遷移する。
      }
    }
  }, [user, isLoading, isAdmin, router]);
  //user, isLoading, isAdmin, routerはuseEffectの依存配列を表す。
  //依存配列とは、useEffectが実行されるタイミングを決定するためのもの。

  if (isLoading) {
    //isLoadingがtrueの場合はLoadingSpinnerを表示する。
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || !isAdmin) {
    //userがnullかつisAdminがfalseの場合はnullを返す。
    return null;
  }

  return <>{children}</>;
  //childrenは子コンポーネントを表す。
};