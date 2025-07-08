
export interface AppError {
  message: string;
  code?: string;
  type: 'network' | 'api' | 'validation' | 'user' | 'system';
  retryable?: boolean;
  details?: any;
}

export class ErrorHandler {
  static createError(
    message: string,
    type: AppError['type'],
    code?: string,
    retryable: boolean = false,
    details?: any
  ): AppError {
    return {
      message,
      type,
      code,
      retryable,
      details
    };
  }

  static handleApiError(error: any): AppError {
    if (error.message?.includes('overloaded')) {
      return this.createError(
        'The AI service is currently busy. Please try again in a moment.',
        'api',
        'SERVICE_OVERLOADED',
        true
      );
    }

    if (error.message?.includes('API_KEY')) {
      return this.createError(
        'Invalid API key. Please check your configuration.',
        'api',
        'INVALID_API_KEY',
        false
      );
    }

    if (error.message?.includes('QUOTA')) {
      return this.createError(
        'API quota exceeded. Please check your usage limits.',
        'api',
        'QUOTA_EXCEEDED',
        false
      );
    }

    if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
      return this.createError(
        'Network connection failed. Please check your internet connection.',
        'network',
        'NETWORK_ERROR',
        true
      );
    }

    return this.createError(
      error.message || 'An unexpected error occurred',
      'system',
      'UNKNOWN_ERROR',
      false,
      error
    );
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff with jitter
    const baseDelay = 1000;
    const maxDelay = 10000;
    const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
    const jitter = Math.random() * 0.1 * exponentialDelay;
    return exponentialDelay + jitter;
  }

  static shouldRetry(error: AppError, attempt: number, maxAttempts: number = 3): boolean {
    return error.retryable && attempt < maxAttempts;
  }
}

export const logError = (error: AppError, context?: string) => {
  console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
  console.error('Message:', error.message);
  console.error('Type:', error.type);
  console.error('Code:', error.code);
  console.error('Retryable:', error.retryable);
  if (error.details) {
    console.error('Details:', error.details);
  }
  console.groupEnd();
};
