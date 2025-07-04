import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
const getNavigation = (t: (key: string) => string) => [{
  name: t('home'),
  href: '/'
}, {
  name: t('reviews'),
  href: '/reviews'
}, {
  name: 'Analytics',
  href: '/analytics'
}, {
  name: 'Integrations',
  href: '/integrations'
}, {
  name: 'Pricing',
  href: '/pricing'
}, {
  name: t('settings'),
  href: '/settings'
}, {
  name: t('contact'),
  href: '/contact'
}];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' }
];
export default function Layout() {
  const location = useLocation();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const navigation = getNavigation(t);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === currentLanguage) || languages[0]
  );
  
  const {
    signOut,
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  
  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    setLanguage(language.code);
  };
  
  const handleSignOut = async () => {
    const {
      error
    } = await signOut();
    if (error) {
      toast({
        title: t('error_signing_out'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('signed_out_successfully'),
        description: t('logged_out_message')
      });
    }
  };
  
  return <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/20">
      <header className="bg-white/95 backdrop-blur-sm shadow-elegant border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">{t('guest_review_manager')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[120px]">
                    <span>{selectedLanguage.flag}</span>
                    <span className="hidden sm:inline">{selectedLanguage.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className="gap-2 cursor-pointer"
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="elegant" size="sm" onClick={handleSignOut}>
                <span className="hidden sm:inline">{t('sign_out')}</span>
                <span className="sm:hidden">Sign Out</span>
              </Button>
            </div>
          </div>
          
          <div className="border-t border-border/40 py-3">
            <nav className="flex flex-wrap gap-2 sm:justify-between">
              {navigation.map(item => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className={cn(
                    'text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md touch-target whitespace-nowrap',
                    location.pathname === item.href 
                      ? 'text-primary bg-primary-50 border border-primary/20 shadow-sm' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary-50/50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Outlet />
      </main>
    </div>;
}