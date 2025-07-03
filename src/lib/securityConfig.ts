/**
 * Security configuration and constants
 */

// Security thresholds and limits
export const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: { max: 5, windowMs: 300000 }, // 5 attempts per 5 minutes
    FORM_SUBMISSIONS: { max: 10, windowMs: 300000 }, // 10 submissions per 5 minutes
    API_CALLS: { max: 100, windowMs: 60000 }, // 100 calls per minute
  },
  
  // Input validation
  INPUT_LIMITS: {
    GUEST_NAME_MAX_LENGTH: 100,
    REVIEW_TEXT_MAX_LENGTH: 2000,
    REVIEW_TEXT_MIN_LENGTH: 10,
    BUSINESS_NAME_MAX_LENGTH: 200,
  },
  
  // Session security
  SESSION: {
    INACTIVITY_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    ABSOLUTE_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  },
  
  // Content Security Policy
  CSP_DIRECTIVES: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'font-src': ["'self'", "data:"],
    'connect-src': ["'self'", "https://*.supabase.co", "https://api.openai.com"],
    'frame-ancestors': ["'none'"],
  },
  
  // Monitoring thresholds
  MONITORING: {
    MOUSE_EVENTS_THRESHOLD: 100, // events per 10 seconds
    FORM_SUBMIT_THRESHOLD: 10, // submissions per 5 minutes
    CONSOLE_CHECK_INTERVAL: 500, // ms
  },
} as const;

// Security headers for enhanced protection
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
} as const;

// Suspicious patterns for XSS detection
export const SUSPICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /vbscript:/i,
  /onload=/i,
  /onerror=/i,
  /onclick=/i,
  /onmouseover=/i,
  /eval\(/i,
  /expression\(/i,
  /document\.cookie/i,
  /document\.write/i,
] as const;

// Allowed file types for uploads (if implemented)
export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/csv',
  'text/plain',
] as const;

// Maximum file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Platform validation
export const VALID_PLATFORMS = [
  'google',
  'booking',
  'airbnb',
  'tripadvisor',
  'other',
] as const;

export type ValidPlatform = typeof VALID_PLATFORMS[number];