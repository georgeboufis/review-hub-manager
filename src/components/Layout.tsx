import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star, Menu, X, BarChart3, Puzzle } from 'lucide-react';
import { useState, useEffect } from 'react';
const getNavigation = (t: (key: string) => string) => [{
  name: t('home'),
  href: '/'
}, {
  name: t('reviews'),
  href: '/reviews'
}, {
  name: t('analytics_title'),
  href: '/analytics',
  icon: BarChart3
}, {
  name: t('platform_integrations'),
  href: '/integrations',
  icon: Puzzle
}, {
  name: t('settings'),
  href: '/settings'
}, {
  name: t('contact'),
  href: '/contact'
}];

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' }
];
export default function Layout() {
  const location = useLocation();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const isMobile = useIsMobile();
  const navigation = getNavigation(t);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages.find(lang => lang.code === currentLanguage) || languages[0]
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  useEffect(() => {
    const lang = languages.find(l => l.code === currentLanguage) || languages[0];
    setSelectedLanguage(lang);
  }, [currentLanguage]);
  
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
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h1 className="text-lg md:text-xl font-bold text-primary truncate max-w-[200px] sm:max-w-none">
                {isMobile ? 'Review Manager' : t('guest_review_manager')}
              </h1>
            </div>
            
            {/* Desktop Header */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <span className="text-sm text-muted-foreground hidden lg:block truncate max-w-[150px]">
                {user?.email}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 min-w-[100px]">
                    <span>{selectedLanguage.flag}</span>
                    <span className="hidden lg:inline">{selectedLanguage.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-lg z-[60]">
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
                {t('sign_out')}
              </Button>
            </div>

            {/* Mobile Header */}
            <div className="flex md:hidden items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <span>{selectedLanguage.flag}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border shadow-lg z-[60]">
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
              
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="p-2">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                  <div className="flex flex-col space-y-4 mt-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-border">
                      <div className="h-8 w-8 rounded-full bg-primary-50 flex items-center justify-center">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('guest_review_manager')}
                        </p>
                      </div>
                    </div>
                    
                    <nav className="space-y-2">
                      {navigation.map(item => (
                        <Link 
                          key={item.name} 
                          to={item.href} 
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center text-sm font-medium transition-all duration-200 px-3 py-3 rounded-md touch-target w-full',
                            location.pathname === item.href 
                              ? 'text-primary bg-primary-50 border border-primary/20 shadow-sm' 
                              : 'text-muted-foreground hover:text-primary hover:bg-primary-50/50'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                    
                    <div className="pt-4 border-t border-border">
                      <Button 
                        variant="elegant" 
                        onClick={handleSignOut}
                        className="w-full justify-center"
                      >
                        {t('sign_out')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block border-t border-border/40 py-3">
            <nav className="flex flex-wrap gap-2 lg:justify-between overflow-x-auto">
              {navigation.map(item => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className={cn(
                    'text-sm font-medium transition-all duration-200 px-3 py-2 rounded-md touch-target whitespace-nowrap flex-shrink-0 flex items-center gap-1.5',
                    location.pathname === item.href 
                      ? 'text-primary bg-primary-50 border border-primary/20 shadow-sm' 
                      : 'text-muted-foreground hover:text-primary hover:bg-primary-50/50'
                  )}
                >
                  {item.icon && <item.icon size={16} />}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main key={currentLanguage} className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <Outlet />
      </main>
    </div>;
}