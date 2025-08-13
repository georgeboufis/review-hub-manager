import { useLanguage } from '@/contexts/LanguageContext';
export function LandingFooter() {
  const { t } = useLanguage();
  return (
    <footer className="py-8 px-4 border-t bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground text-sm">
          {t('footer_text')}
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          {t('footer_contact')}
        </p>
      </div>
    </footer>
  );
}