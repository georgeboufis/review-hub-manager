import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});

  useEffect(() => {
    // Web Vitals monitoring
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        setMetrics(prev => ({
          ...prev,
          loadTime
        }));

        // Measure FCP
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                firstContentfulPaint: entry.startTime
              }));
            }
          }
        });
        
        observer.observe({ entryTypes: ['paint'] });

        // Measure LCP
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics(prev => ({
            ...prev,
            largestContentfulPaint: lastEntry.startTime
          }));
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Measure CLS
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              setMetrics(prev => ({
                ...prev,
                cumulativeLayoutShift: clsValue
              }));
            }
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }
    };

    measurePerformance();
  }, []);

  const logMetrics = () => {
    if (process.env.NODE_ENV === 'production') {
      console.log('Performance Metrics:', metrics);
      // Send to analytics service
    }
  };

  return { metrics, logMetrics };
};