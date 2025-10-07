import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { UI_CONFIG, PATHS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * レスポンシブ動画ソースを取得
 * SSRとクライアント間のhydration mismatchを避けるため、常にデスクトップ版を返す
 */
export function getResponsiveVideoSrc(): string {
  // Always return desktop version to avoid hydration mismatch
  // Mobile responsiveness should be handled via CSS media queries instead
  return PATHS.VIDEOS.TOP_MOVIE;
}

/**
 * 日付をフォーマット - SSR safe
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Use ISO format to avoid locale differences between server and client
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  } catch {
    return dateString;
  }
}

/**
 * モバイルデバイスかどうかを判定
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= UI_CONFIG.MOBILE_BREAKPOINT;
}

/**
 * 文字列を切り詰めて省略記号を追加
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * URLが外部リンクかどうかを判定
 */
export function isExternalLink(url: string): boolean {
  return url.startsWith('http') || url.startsWith('mailto:');
}

/**
 * 安全にローカルストレージからアイテムを取得
 */
export function getStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * 安全にローカルストレージにアイテムを設定
 */
export function setStorageItem(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全にローカルストレージからアイテムを削除
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}