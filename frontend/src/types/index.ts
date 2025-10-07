import React from 'react';

// 基本的なPropsインターフェース
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// サービスカード関連
export interface ServiceCard {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  isExternal: boolean;
}

// 認証関連
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
}

// 記事関連
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  tag: string;
  author: string;
  featured_image?: string | null;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tag: string;
  author: string;
  featured_image: string | null;
  is_published: boolean;
  published_at: string;
}

export interface Category {
  key: string;
  label: string;
  count: number;
}

// フィルター・検索関連
export interface FilterState {
  category: string;
  search: string;
  published?: boolean;
}

// UI関連
export interface ModalProps extends BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

// ナビゲーション関連
export interface NavigationItem {
  href: string;
  label: string;
  external?: boolean;
}

// ケース・事例関連
export interface CaseItem {
  id: string;
  image: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  images: {
    pc: string;
    sp: string;
    thumb: string;
  };
}