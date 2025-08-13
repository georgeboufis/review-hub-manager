import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function TestimonialsSection() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in">
          {t('testimonials_heading')}
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                {t('testimonials_quote_1')}
              </p>
              <div className="font-semibold">Maria K.</div>
              <div className="text-sm text-muted-foreground">{t('testimonials_role_1')}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                {t('testimonials_quote_2')}
              </p>
              <div className="font-semibold">Dimitris P.</div>
              <div className="text-sm text-muted-foreground">{t('testimonials_role_2')}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}