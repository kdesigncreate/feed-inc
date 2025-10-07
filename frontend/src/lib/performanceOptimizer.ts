// パフォーマンス最適化ユーティリティ

// メッセージハンドラーの処理時間を最適化
export const optimizeMessageHandler = () => {
  if (typeof window === 'undefined') return;

  // フレーム単位での処理制限を設定
  let frameId: number;
  const messageQueue: Array<{ message: any; targetOrigin: string; transfer?: Transferable[] }> = [];

  const processMessageQueue = () => {
    if (messageQueue.length > 0) {
      const messageData = messageQueue.shift();
      if (messageData) {
        const { message, targetOrigin, transfer } = messageData;
        try {
          // 元のpostMessageを安全に呼び出し
          if (typeof window.parent?.postMessage === 'function') {
            window.parent.postMessage(message, targetOrigin, transfer);
          }
        } catch (error) {
          console.warn('Message processing error:', error);
        }
      }
    }
    
    if (messageQueue.length > 0) {
      frameId = requestAnimationFrame(processMessageQueue);
    }
  };

  // カスタムメッセージ送信関数
  (window as any).optimizedPostMessage = (message: any, targetOrigin: string, transfer?: Transferable[]) => {
    messageQueue.push({ message, targetOrigin, transfer });
    
    if (!frameId) {
      frameId = requestAnimationFrame(processMessageQueue);
    }
  };
};

// 強制リフローを最小化
export const minimizeReflow = () => {
  if (typeof window === 'undefined') return;

  // DOM操作のバッチ処理
  let rafId: number;
  const pendingUpdates: (() => void)[] = [];

  const flushUpdates = () => {
    if (pendingUpdates.length === 0) return;
    
    const updates = [...pendingUpdates];
    pendingUpdates.length = 0;
    
    updates.forEach(update => {
      if (typeof update === 'function') {
        try {
          update();
        } catch (error) {
          console.warn('DOM update error:', error);
        }
      }
    });
  };

  // グローバルなDOM更新スケジューラー
  (window as any).scheduleDOMUpdate = (callback: () => void) => {
    pendingUpdates.push(callback);
    
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        flushUpdates();
        rafId = 0;
      });
    }
  };
};

// IntersectionObserverを使用した遅延読み込み最適化
export const optimizeLazyLoading = () => {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const src = target.dataset.src;
          
          if (src && target.tagName === 'IMG') {
            (target as HTMLImageElement).src = src;
            target.removeAttribute('data-src');
            observer.unobserve(target);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );

  // 遅延読み込み対象の画像を監視（DOM準備完了後）
  const setupImageObserver = () => {
    const images = document.querySelectorAll('img[data-src]');
    if (images && images.length > 0) {
      images.forEach(img => {
        observer.observe(img);
      });
    }
  };

  // DOM準備完了を待つ
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupImageObserver);
  } else {
    setupImageObserver();
  }

  return observer;
};

// パフォーマンス監視
export const monitorPerformance = () => {
  if (typeof window === 'undefined') return;

  // FCP, LCP, FIDの監視
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // 長時間実行タスクの検出
        if (entry.entryType === 'longtask') {
          console.warn('Long task detected:', entry.duration + 'ms');
        }
        
        // レイアウトシフトの検出
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.warn('Layout shift detected:', (entry as any).value);
        }
      });
    });

    observer.observe({ entryTypes: ['longtask', 'layout-shift'] });
  }
};

// 初期化関数
export const initializePerformanceOptimizations = () => {
  optimizeMessageHandler();
  minimizeReflow();
  optimizeLazyLoading();
  monitorPerformance();
};