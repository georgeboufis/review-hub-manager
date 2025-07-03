import { useEffect, useCallback } from 'react';
import { logSecurityEvent } from '@/lib/errorHandling';

/**
 * Hook for security monitoring and anomaly detection
 */
export function useSecurityMonitoring() {
  // Track page visibility changes (potential security concern)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      logSecurityEvent('page_hidden', { timestamp: Date.now() });
    } else {
      logSecurityEvent('page_visible', { timestamp: Date.now() });
    }
  }, []);

  // Track potential XSS attempts
  const detectXSSAttempts = useCallback(() => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];

    // Monitor URL for suspicious patterns
    const url = window.location.href;
    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      logSecurityEvent('potential_xss_attempt', { url, userAgent: navigator.userAgent });
    }

    // Monitor referrer for suspicious patterns
    const referrer = document.referrer;
    if (referrer && suspiciousPatterns.some(pattern => pattern.test(referrer))) {
      logSecurityEvent('suspicious_referrer', { referrer, userAgent: navigator.userAgent });
    }
  }, []);

  // Track console access (potential developer tools usage)
  const monitorConsoleAccess = useCallback(() => {
    let devtools = { open: false, orientation: null };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 200 || 
          window.outerWidth - window.innerWidth > 200) {
        if (!devtools.open) {
          devtools.open = true;
          logSecurityEvent('devtools_opened', { 
            timestamp: Date.now(),
            userAgent: navigator.userAgent 
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }, []);

  // Track unusual mouse movements (potential bot activity)
  const trackMouseActivity = useCallback(() => {
    let mouseEvents: number[] = [];
    
    const handleMouseMove = () => {
      const now = Date.now();
      mouseEvents.push(now);
      
      // Keep only events from last 10 seconds
      mouseEvents = mouseEvents.filter(time => now - time < 10000);
      
      // If too many events in short time, might be automated
      if (mouseEvents.length > 100) {
        logSecurityEvent('unusual_mouse_activity', { 
          eventCount: mouseEvents.length,
          timeWindow: 10000
        });
        mouseEvents = []; // Reset to avoid spam
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Monitor for rapid form submissions
  const monitorFormActivity = useCallback(() => {
    let formSubmissions: number[] = [];
    
    const handleFormSubmit = () => {
      const now = Date.now();
      formSubmissions.push(now);
      
      // Keep only submissions from last 5 minutes
      formSubmissions = formSubmissions.filter(time => now - time < 300000);
      
      // If too many submissions, might be automated
      if (formSubmissions.length > 10) {
        logSecurityEvent('rapid_form_submissions', { 
          submissionCount: formSubmissions.length,
          timeWindow: 300000
        });
      }
    };

    document.addEventListener('submit', handleFormSubmit, { passive: true });
    
    return () => {
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  useEffect(() => {
    // Initial security checks
    detectXSSAttempts();
    
    // Set up monitoring
    document.addEventListener('visibilitychange', handleVisibilityChange);
    monitorConsoleAccess();
    const mouseCleanup = trackMouseActivity();
    const formCleanup = monitorFormActivity();

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      mouseCleanup?.();
      formCleanup?.();
    };
  }, [handleVisibilityChange, detectXSSAttempts, monitorConsoleAccess, trackMouseActivity, monitorFormActivity]);

  return {
    logSecurityEvent,
  };
}
