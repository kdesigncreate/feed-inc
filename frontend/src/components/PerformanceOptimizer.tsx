'use client';

import { useEffect } from 'react';
import { initializePerformanceOptimizations } from '@/lib/performanceOptimizer';

export function PerformanceOptimizer() {
  useEffect(() => {
    // クライアントサイドでのみ実行
    try {
      if (typeof window !== 'undefined') {
        initializePerformanceOptimizations();
      }
    } catch (error) {
      console.warn('Performance optimization initialization failed:', error);
    }
  }, []);

  // このコンポーネントは何もレンダリングしない
  return null;
}