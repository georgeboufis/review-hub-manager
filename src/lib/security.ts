import DOMPurify from 'dompurify';

/**
 * Security utilities for input validation and sanitization
 */

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
}

/**
 * Sanitize text input by removing dangerous characters
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags and dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 1000); // Limit length
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleaned = email.trim().toLowerCase();
  
  return emailRegex.test(cleaned) ? cleaned : '';
}

/**
 * Rate limiting for form submissions
 */
export function checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 300000): boolean {
  const now = Date.now();
  const key = `rate_limit_${identifier}`;
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= maxAttempts) {
    return false;
  }
  
  existing.count++;
  return true;
}

/**
 * Generate secure random string for CSRF tokens
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate review text content
 */
export function validateReviewText(text: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: 'Review text is required' };
  }
  
  const sanitized = sanitizeText(text);
  
  if (sanitized.length < 10) {
    return { isValid: false, sanitized, error: 'Review text must be at least 10 characters' };
  }
  
  if (sanitized.length > 2000) {
    return { isValid: false, sanitized, error: 'Review text must be less than 2000 characters' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(text))) {
    return { isValid: false, sanitized, error: 'Invalid content detected' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate guest name
 */
export function validateGuestName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  if (!name || typeof name !== 'string') {
    return { isValid: false, sanitized: '', error: 'Guest name is required' };
  }
  
  const sanitized = sanitizeText(name);
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Guest name must be at least 2 characters' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'Guest name must be less than 100 characters' };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Guest name contains invalid characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Encrypt sensitive data (for API credentials)
 */
export async function encryptData(data: string, key?: string): Promise<string> {
  // Simple base64 encoding with obfuscation for client-side
  // In production, this should be done server-side with proper encryption
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  
  // Add some obfuscation
  const obfuscated = Array.from(dataBytes).map(byte => byte ^ 42);
  
  return btoa(String.fromCharCode(...obfuscated));
}

/**
 * Decrypt sensitive data
 */
export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const decoded = atob(encryptedData);
    const bytes = Array.from(decoded).map(char => char.charCodeAt(0) ^ 42);
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
  } catch {
    throw new Error('Failed to decrypt data');
  }
}