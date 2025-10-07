'use client';

import { useEffect } from 'react';

export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Passive event listeners for touch events
    const addPassiveListeners = () => {
      const options = { passive: true };
      
      // Override non-passive event listeners with passive ones
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, optionsOrCapture) {
        if (type === 'touchstart' || type === 'touchmove' || type === 'wheel') {
          const passiveOptions = typeof optionsOrCapture === 'object' 
            ? { ...optionsOrCapture, passive: true }
            : { passive: true, capture: Boolean(optionsOrCapture) };
          return originalAddEventListener.call(this, type, listener, passiveOptions);
        }
        return originalAddEventListener.call(this, type, listener, optionsOrCapture);
      };
    };

    // Optimize iframe loading
    const optimizeIframes = () => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        if (iframe.src.includes('google.com/maps')) {
          // Add intersection observer for lazy loading
          const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const iframe = entry.target as HTMLIFrameElement;
                if (!iframe.dataset.loaded) {
                  iframe.dataset.loaded = 'true';
                  // Force reflow optimization
                  iframe.style.transform = 'translateZ(0)';
                  iframe.style.willChange = 'transform';
                }
                observer.unobserve(iframe);
              }
            });
          }, { rootMargin: '50px' });
          
          observer.observe(iframe);
        }
      });
    };

    // Debounce resize events
    const debounceResize = () => {
      let resizeTimer: NodeJS.Timeout;
      const originalAddEventListener = window.addEventListener;
      
      window.addEventListener = function(type: string, listener: any, options?: any) {
        if (type === 'resize') {
          const debouncedListener = (event: Event) => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              if (typeof listener === 'function') {
                listener(event);
              } else if (listener && typeof listener.handleEvent === 'function') {
                listener.handleEvent(event);
              }
            }, 16); // ~60fps
          };
          return originalAddEventListener.call(this, type, debouncedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    };

    // Apply optimizations
    addPassiveListeners();
    setTimeout(optimizeIframes, 100); // Delay to ensure DOM is ready
    debounceResize();

    // Cleanup function
    return () => {
      // Reset event listener if needed
    };
  }, []);
};