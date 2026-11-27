import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Top-level React ErrorBoundary preventing uncaught render errors from blanking the page.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Storefront render error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="min-h-screen bg-[#050B14] text-slate-200 flex items-center justify-center p-6"
        >
          <div className="max-w-md w-full bg-[#0A1220] border border-white/15 rounded-2xl p-8 text-center shadow-2xl">
            <div className="mx-auto h-12 w-12 rounded-xl bg-[#1E90FF]/15 border border-[#1E90FF]/30 flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-[#1E90FF]" aria-hidden="true" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mt-2.5 text-sm text-slate-300 leading-relaxed">
              An unexpected display error occurred while rendering the sino_pepts storefront. Reload
              the page to restore your session safely.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] text-white text-sm font-semibold transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reload Storefront
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
