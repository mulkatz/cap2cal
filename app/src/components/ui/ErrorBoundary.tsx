import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
import { Capacitor } from '@capacitor/core';
import { i18next } from '../../utils/i18n';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches React errors and reports them to Crashlytics
 * Wraps the app to catch unhandled errors in the component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);

    // Log to Crashlytics on native platforms
    if (Capacitor.isNativePlatform()) {
      this.logToCrashlytics(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-6 text-6xl">😕</div>
            <h1 className="mb-4 text-2xl font-bold text-secondary">{i18next.t('dialogs.errorBoundary.title')}</h1>
            <p className="text-tertiary mb-8 text-base leading-relaxed">{i18next.t('dialogs.errorBoundary.message')}</p>
            <button
              onClick={this.handleRetry}
              className="w-full rounded-xl bg-highlight px-6 py-4 font-semibold text-white transition-all active:scale-95">
              {i18next.t('dialogs.errorBoundary.tryAgain')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }

  private async logToCrashlytics(error: Error, errorInfo: ErrorInfo) {
    try {
      // Add component stack as custom key
      await FirebaseCrashlytics.setCustomKey({
        key: 'react_component_stack',
        value: errorInfo.componentStack || 'No component stack',
        type: 'string',
      });

      // Add error boundary context
      await FirebaseCrashlytics.setCustomKey({
        key: 'error_boundary',
        value: 'true',
        type: 'boolean',
      });

      // Log the error
      await FirebaseCrashlytics.log({
        message: `ErrorBoundary caught: ${error.message}`,
      });

      // Record the exception
      // Note: Crashlytics will automatically capture the stack trace
      await FirebaseCrashlytics.recordException({
        message: `[ErrorBoundary] ${error.name || 'Error'}: ${error.message || 'Unknown React error'}${error.stack ? '\n' + error.stack : ''}`,
      });

      console.log('[ErrorBoundary] Error logged to Crashlytics');
    } catch (e) {
      console.error('[ErrorBoundary] Failed to log to Crashlytics:', e);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };
}
