import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

export default function Layout() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent">
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Guest Review Manager</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    location.pathname === item.href
                      ? 'text-primary bg-primary-50'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.email}
              </span>
              <Button variant="elegant" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}