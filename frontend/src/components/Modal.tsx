import React, { useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, maxWidth = '5xl', children }) => {
  const [titleId, setTitleId] = useState<string>('');
  
  // TailwindCSSは動的クラス名を拾えないため、許可する`max-w-*`クラスを明示マッピング
  const maxWidthClass = (() => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case '2xl':
        return 'max-w-2xl';
      case '3xl':
        return 'max-w-3xl';
      case '4xl':
        return 'max-w-4xl';
      case '5xl':
        return 'max-w-5xl';
      case '6xl':
        return 'max-w-6xl';
      case '7xl':
        return 'max-w-7xl';
      default:
        return 'max-w-5xl';
    }
  })();
  
  // モーダル表示中は背面のスクロールをロックし、開く前のスクロール位置を維持
  useEffect(() => {
    if (!isOpen) return;
    const { style } = document.body;
    const previous = {
      overflow: style.overflow,
      position: style.position,
      top: style.top,
      width: style.width,
      paddingRight: style.paddingRight,
    };
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    style.overflow = 'hidden';
    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.width = '100%';
    if (scrollbarWidth > 0) style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      style.overflow = previous.overflow || '';
      style.position = previous.position || '';
      style.top = previous.top || '';
      style.width = previous.width || '';
      style.paddingRight = previous.paddingRight || '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);
  
  useEffect(() => {
    // Generate ID on client side to avoid hydration mismatch
    setTitleId(`modal-title-${Math.random().toString(36).slice(2, 10)}`);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto overscroll-contain">
      <div className="p-2 sm:p-6 flex min-h-full items-center justify-center">
      <div
        className={`w-full md:w-[70vw] ${maxWidthClass} min-w-[450px] my-0 p-0 relative bg-white aspect-[4/3] overflow-hidden rounded-[16px] md:rounded-[24px] shadow-2xl animate-fade-in max-w-none`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title && titleId ? titleId : undefined}
      >
        {/* 閉じるボタンを右上に絶対配置。モバイル時は大きめ・タップしやすく */}
        <button
          onClick={onClose}
          className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center absolute top-2 right-2 sm:top-4 sm:right-4 md:top-3 md:right-3 z-20 text-gray-500 bg-white/80 border border-gray-200 rounded-full shadow-md hover:scale-110 hover:text-blue-600 focus:outline-none transition-transform duration-200"
          aria-label="閉じる"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="6" x2="22" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>
        {/* ヘッダー（タイトルがある場合のみ表示） */}
        {title && (
          <div className="px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between bg-white border-b border-gray-200 rounded-t-2xl sm:rounded-t-3xl">
            <h2 id={titleId} className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-wide">{title}</h2>
          </div>
        )}
        {/* 本文 */}
        <div className="absolute inset-0 w-full h-full p-0 flex flex-col">
          {children}
        </div>
      </div>
      </div>
    </div>
  );
}; 