import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { useSecurityMonitoring } from "./hooks/useSecurityMonitoring";
import { usePerformanceMonitoring } from "./hooks/usePerformanceMonitoring";
import { useAnalytics } from "./hooks/useAnalytics";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LoadingFallback } from "./components/LoadingFallback";
import { OfflineIndicator } from "./components/OfflineIndicator";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Reviews from "./pages/Reviews";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import ReplyPage from "./pages/ReplyPage";
import Integrations from "./pages/Integrations";
import PricingDashboard from "./pages/PricingDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { Suspense, useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize monitoring systems
  useSecurityMonitoring();
  const { logMetrics } = usePerformanceMonitoring();
  const { trackPageView } = useAnalytics();
  
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    // Log performance metrics after app loads
    const timer = setTimeout(() => {
      logMetrics();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [logMetrics]);
  
  return (
    <ErrorBoundary>
      <OfflineIndicator />
      <Suspense fallback={<LoadingFallback fullScreen message="Loading application..." />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="pricing" element={<PricingDashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="contact" element={<Contact />} />
            <Route path="reply/:reviewId" element={<ReplyPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
