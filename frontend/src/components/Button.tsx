import React from 'react';
import Link from 'next/link';

interface ButtonProps {
  href?: string;
  target?: string;
  variant?: 'primary';
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({ href, target, variant = 'primary', children, onClick }) => {
  //ButtonはButtonのコンポーネント。
  //React.FC<ButtonProps>はButtonPropsをReactの関数コンポーネントにするためのもの。
  //hrefはリンクのURLを表す。
  //targetはリンクのターゲットを表す。
  //variantはボタンの種類を表す。
  //childrenは子コンポーネントを表す。
  //onClickはボタンをクリックした時の処理を表す。
  const baseClasses = "inline-block px-6 py-3 rounded-lg transition-colors duration-300 font-medium border";
  const variantClasses = {
    primary: "border-gray-500 text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white",
  } as const;
  //as constはconstを型として使用するためのもの。

  if (href) {
    //hrefがtrueの場合はLinkを表示する。
    return (
      <Link 
        href={href} 
        target={target} 
        className={`${baseClasses} ${variantClasses[variant]}`}
        onClick={onClick as any}
      >
        {children}
      </Link>
    );
  }

  return (
    //buttonはボタンを表示するためのもの。
    <button
      type="button"
      onClick={onClick as any}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};