/**
 * Centralized logging utility
 * Provides consistent logging across the application with environment-aware behavior
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    // In production, only show warnings and errors
    this.level = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
  }

  debug(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', context, message), ...args);
    }
  }

  info(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', context, message), ...args);
    }
  }

  warn(context: string, message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', context, message), ...args);
    }
  }

  error(context: string, message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorMessage = this.formatMessage('ERROR', context, message);
      if (error instanceof Error) {
        console.error(errorMessage, error.message, error.stack, ...args);
      } else if (error) {
        console.error(errorMessage, error, ...args);
      } else {
        console.error(errorMessage, ...args);
      }
    }
  }

  // For critical errors that should always be logged
  critical(context: string, message: string, error?: Error | unknown, ...args: any[]): void {
    const errorMessage = this.formatMessage('CRITICAL', context, message);
    if (error instanceof Error) {
      console.error(errorMessage, error.message, error.stack, ...args);
    } else if (error) {
      console.error(errorMessage, error, ...args);
    } else {
      console.error(errorMessage, ...args);
    }

    // In production, this could also send to error tracking service (Sentry, etc.)
    if (!this.isDevelopment) {
      // TODO: Integrate with error tracking service
      // Example: Sentry.captureException(error, { tags: { context }, extra: { message, ...args } });
    }
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.level;
  }

  private formatMessage(level: string, context: string, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${context}] ${message}`;
  }
}

// Export singleton instance
export const logger = new Logger();
