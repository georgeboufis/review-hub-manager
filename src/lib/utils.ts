import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to safely truncate text
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Utility to check if running in secure context
 */
export function isSecureContext(): boolean {
  return window.isSecureContext && window.location.protocol === 'https:';
}

/**
 * Utility to generate a random ID for tracking
 */
export function generateTrackingId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
