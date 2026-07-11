export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  info(message: string, context?: Record<string, any>) {
    console.log(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, any>) {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: any, context?: Record<string, any>) {
    const errorContext = { ...context, error: error?.message || error };
    console.error(this.formatMessage('error', message, errorContext));
    if (error?.stack) {
      console.error(error.stack);
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }
}

export const logger = new Logger();
