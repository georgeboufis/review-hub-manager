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
  
  return <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent">
      <header className="bg-white shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">{t('guest_review_manager')}</h1>
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
                      onClick={() => handleLanguageChange(language)}
                      className="gap-2"
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="elegant" size="sm" onClick={handleSignOut}>
                {t('sign_out')}
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