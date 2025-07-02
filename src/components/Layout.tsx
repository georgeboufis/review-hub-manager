import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
const navigation = [{
  name: 'Home',
  href: '/'
}, {
  name: 'Product',
  href: '/product'
}, {
  name: 'Reviews',
  href: '/reviews'
}, {
  name: 'Settings',
  href: '/settings'
}, {
  name: 'Contact',
  href: '/contact'
}];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
];
export default function Layout() {
  const location = useLocation();
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const {
    signOut,
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleSignOut = async () => {
    const {
      error
    } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out."
      });
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent">
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Guest Review Manager</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <span>{selectedLanguage.flag}</span>
                    <span>{selectedLanguage.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => setSelectedLanguage(language)}
                      className="gap-2"
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="elegant" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
          
          <div className="border-t border-border/40 py-2">
            <div className="flex flex-col space-y-3">
              <nav className="flex justify-between w-full">
                {navigation.map(item => <Link key={item.name} to={item.href} className={cn('text-sm font-medium transition-colors px-4 py-2 rounded-md', location.pathname === item.href ? 'text-primary bg-primary-50' : 'text-muted-foreground hover:text-primary hover:bg-primary-50')}>
                    {item.name}
                  </Link>)}
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>;
}