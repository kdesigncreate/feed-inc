'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log actual errors, not hydration mismatches
    if (!error.message.includes('Hydration') && 
        !error.message.includes('Minified React error #418') &&
        !error.message.includes('Minified React error #423')) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // Fallback UI - just render children anyway for hydration errors
      return this.props.children;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;