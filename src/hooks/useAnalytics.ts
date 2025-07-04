import { useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize analytics in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Analytics initialized for user:', user?.id);
    }
  }, [user]);

  const track = useCallback((event: string, properties?: Record<string, any>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      },
      userId: user?.id
    };

    if (process.env.NODE_ENV === 'production') {
      console.log('Analytics Event:', analyticsEvent);
      // Send to analytics service (Google Analytics, Mixpanel, etc.)
    }
  }, [user]);

  const trackPageView = useCallback((page: string) => {
    track('page_view', { page });
  }, [track]);

  const trackUserAction = useCallback((action: string, context?: Record<string, any>) => {
    track('user_action', { action, ...context });
  }, [track]);

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    });
  }, [track]);

  const trackSubscription = useCallback((action: 'start' | 'upgrade' | 'cancel', tier?: string) => {
    track('subscription', { action, tier });
  }, [track]);

  return {
    track,
    trackPageView,
    trackUserAction,
    trackError,
    trackSubscription
  };
};