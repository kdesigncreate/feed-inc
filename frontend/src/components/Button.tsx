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
  const baseClasses = "inline-block px-6 py-3 rounded-lg transition-colors duration-300 font-medium border";
  const variantClasses = {
    primary: "border-gray-500 text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white",
  } as const;

  if (href) {
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
    <button
      type="button"
      onClick={onClick as any}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};