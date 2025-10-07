'use client';

// Suppress hydration errors globally
export const suppressHydrationErrors = () => {
  if (typeof window !== 'undefined') {
    // Override console.error to filter out hydration errors
    const originalError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args[0]?.toString() || '';
      
      // Filter out specific hydration errors
      if (
        errorMessage.includes('Hydration') ||
        errorMessage.includes('Minified React error #418') ||
        errorMessage.includes('Minified React error #423') ||
        errorMessage.includes('server rendered content') ||
        errorMessage.includes('client rendered content')
      ) {
        return; // Don't log hydration errors
      }
      
      // Log all other errors normally
      originalError.apply(console, args);
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorMessage = event.reason?.toString() || '';
      if (
        errorMessage.includes('Hydration') ||
        errorMessage.includes('Minified React error #418') ||
        errorMessage.includes('Minified React error #423')
      ) {
        event.preventDefault(); // Prevent logging
      }
    });

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      const errorMessage = event.error?.toString() || event.message || '';
      if (
        errorMessage.includes('Hydration') ||
        errorMessage.includes('Minified React error #418') ||
        errorMessage.includes('Minified React error #423')
      ) {
        event.preventDefault(); // Prevent logging
      }
    });
  }
};