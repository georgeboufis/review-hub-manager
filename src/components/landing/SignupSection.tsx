import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function SignupSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('email_required_title'),
        description: t('email_required_desc'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: t('success_waitlist_title'),
        description: t('success_waitlist_desc'),
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t('signup_title')}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t('signup_subtitle')}
        </p>
        
        <form onSubmit={handleWaitlistSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder={t('email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="sm:px-8">
            {isSubmitting ? t('joining_text') : t('join_waitlist_button')}
          </Button>
        </form>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-primary" />
          Free to join • No spam • Cancel anytime
        </div>
      </div>
    </section>
  );
}