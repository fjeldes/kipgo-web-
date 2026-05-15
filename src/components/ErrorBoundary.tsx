'use client';

import { Component, ReactNode } from 'react';
import { api } from '@/lib/api';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('admin_auth') : null;
    const token = stored ? JSON.parse(stored).token : null;

    api.post('/error-logs', {
      source: 'frontend',
      level: 'error',
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      context: { componentStack: info.componentStack },
    }, token).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-[#f9f9f9]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
              <span className="material-symbols-outlined text-3xl" style={{ color: '#dc2626' }}>error</span>
            </div>
            <h2 className="text-2xl font-headline font-bold mb-2" style={{ color: '#1a1c1c' }}>Something went wrong</h2>
            <p className="text-sm mb-6" style={{ color: '#454652' }}>An unexpected error occurred. Our team has been notified.</p>
            <button onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-6 py-3 rounded-xl text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
