import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  database: 'healthy' | 'warning' | 'error';
  edgeFunctions: 'healthy' | 'warning' | 'error';
  auth: 'healthy' | 'warning' | 'error';
  stripe: 'healthy' | 'warning' | 'error';
  lastChecked: Date;
}

export const ProductionHealthCheck = () => {
  const [health, setHealth] = useState<HealthStatus>({
    database: 'warning',
    edgeFunctions: 'warning',
    auth: 'warning',
    stripe: 'warning',
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const newHealth: HealthStatus = {
      database: 'error',
      edgeFunctions: 'error',
      auth: 'error',
      stripe: 'error',
      lastChecked: new Date()
    };

    try {
      // Test database connection
      const { error: dbError } = await supabase.from('profiles').select('id').limit(1);
      newHealth.database = dbError ? 'error' : 'healthy';
    } catch {
      newHealth.database = 'error';
    }

    try {
      // Test auth
      const { data: { session } } = await supabase.auth.getSession();
      newHealth.auth = session ? 'healthy' : 'warning';
    } catch {
      newHealth.auth = 'error';
    }

    try {
      // Test edge function
      const { error: fnError } = await supabase.functions.invoke('check-subscription');
      newHealth.edgeFunctions = fnError ? 'warning' : 'healthy';
    } catch {
      newHealth.edgeFunctions = 'error';
    }

    try {
      // Test Stripe (basic connectivity check via edge function)
      const { error: stripeError } = await supabase.functions.invoke('check-subscription');
      newHealth.stripe = stripeError ? 'warning' : 'healthy';
    } catch {
      newHealth.stripe = 'error';
    }

    setHealth(newHealth);
    setIsChecking(false);
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'healthy' | 'warning' | 'error') => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Health Check</CardTitle>
            <CardDescription>
              Production readiness status • Last checked: {health.lastChecked.toLocaleTimeString()}
            </CardDescription>
          </div>
          <Button onClick={checkHealth} disabled={isChecking} size="sm">
            {isChecking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon(health.database)}
            <span className="ml-2">Database Connection</span>
          </div>
          {getStatusBadge(health.database)}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon(health.auth)}
            <span className="ml-2">Authentication</span>
          </div>
          {getStatusBadge(health.auth)}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon(health.edgeFunctions)}
            <span className="ml-2">Edge Functions</span>
          </div>
          {getStatusBadge(health.edgeFunctions)}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getStatusIcon(health.stripe)}
            <span className="ml-2">Payment Processing</span>
          </div>
          {getStatusBadge(health.stripe)}
        </div>
      </CardContent>
    </Card>
  );
};