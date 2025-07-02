import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'professional';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'professional';
  };
  children?: ReactNode;
}

export function EmptyState({ 
  icon = '📝', 
  title, 
  description, 
  action, 
  secondaryAction,
  children 
}: EmptyStateProps) {
  return (
    <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-dashed">
      <CardContent className="text-center py-16">
        <div className="text-muted-foreground text-6xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
        
        {(action || secondaryAction || children) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {action && (
              <Button 
                variant={action.variant || 'professional'} 
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button 
                variant={secondaryAction.variant || 'outline'} 
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}