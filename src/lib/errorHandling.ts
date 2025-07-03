/**
 * Centralized error handling and message sanitization
 */

// Development vs Production error messages
const isDevelopment = import.meta.env.DEV;

/**
 * Generic error messages to prevent information disclosure
 */
const GENERIC_ERRORS = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  VALIDATION_FAILED: 'Please check your input and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  RATE_LIMITED: 'Too many requests. Please wait before trying again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

/**
 * Error types for categorization
 */
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NETWORK = 'network',
  SERVER = 'server',
  RATE_LIMIT = 'rate_limit',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  UNKNOWN = 'unknown',
}

/**
 * Security-focused error class
 */
export class SecureError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SecureError';
  }
}

/**
 * Sanitize error messages for user display
 */
export function sanitizeErrorMessage(error: any): string {
  if (!error) return GENERIC_ERRORS.SERVER_ERROR;

  // If it's a SecureError, handle appropriately
  if (error instanceof SecureError) {
    return isDevelopment ? error.message : getGenericMessage(error.type);
  }

  // Handle common Supabase errors
  if (error?.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
      return GENERIC_ERRORS.AUTH_FAILED;
    }
    
    if (message.includes('user already registered') || message.includes('email already exists')) {
      return 'An account with this email already exists.';
    }
    
    if (message.includes('rate limit') || message.includes('too many requests')) {
      return GENERIC_ERRORS.RATE_LIMITED;
    }
    
    if (message.includes('unauthorized') || message.includes('not authenticated')) {
      return GENERIC_ERRORS.UNAUTHORIZED;
    }
    
    if (message.includes('validation') || message.includes('invalid')) {
      return GENERIC_ERRORS.VALIDATION_FAILED;
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return GENERIC_ERRORS.NETWORK_ERROR;
    }
    
    if (message.includes('not found')) {
      return GENERIC_ERRORS.NOT_FOUND;
    }
  }

  // In development, show the actual error
  if (isDevelopment && error?.message) {
    return error.message;
  }

  // Default to generic server error
  return GENERIC_ERRORS.SERVER_ERROR;
}

/**
 * Get generic message for error type
 */
function getGenericMessage(type: ErrorType): string {
  switch (type) {
    case ErrorType.AUTHENTICATION:
      return GENERIC_ERRORS.AUTH_FAILED;
    case ErrorType.VALIDATION:
      return GENERIC_ERRORS.VALIDATION_FAILED;
    case ErrorType.NETWORK:
      return GENERIC_ERRORS.NETWORK_ERROR;
    case ErrorType.RATE_LIMIT:
      return GENERIC_ERRORS.RATE_LIMITED;
    case ErrorType.AUTHORIZATION:
      return GENERIC_ERRORS.UNAUTHORIZED;
    case ErrorType.NOT_FOUND:
      return GENERIC_ERRORS.NOT_FOUND;
    default:
      return GENERIC_ERRORS.SERVER_ERROR;
  }
}

/**
 * Log security events (for monitoring)
 */
export function logSecurityEvent(event: string, details?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const userAgent = navigator.userAgent;
  const url = window.location.href;
  
  const logEntry = {
    timestamp,
    event,
    url,
    userAgent,
    ...details,
  };
  
  // In development, log to console
  if (isDevelopment) {
    console.warn('[Security Event]', logEntry);
  }
  
  // In production, send to monitoring service
  // This would integrate with your monitoring service
  if (!isDevelopment) {
    // Example: Send to monitoring endpoint
    // fetch('/api/security-log', { method: 'POST', body: JSON.stringify(logEntry) });
  }
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(type: ErrorType, message?: string, details?: Record<string, any>) {
  const error = new SecureError(type, message || getGenericMessage(type), details);
  const userMessage = sanitizeErrorMessage(error);
  
  // Log security-relevant errors
  if ([ErrorType.AUTHENTICATION, ErrorType.AUTHORIZATION, ErrorType.RATE_LIMIT].includes(type)) {
    logSecurityEvent('security_error', { type, originalMessage: message, ...details });
  }
  
  return {
    error: true,
    message: userMessage,
    type,
    ...(isDevelopment && { debug: { originalMessage: message, details } }),
  };
}