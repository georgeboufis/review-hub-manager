import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SignupSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Here you would integrate with your waitlist database
    // For now, we'll simulate the signup
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll notify you when we launch!",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to Transform Your Review Management?
        </h2>
        <p className="text-muted-foreground mb-8">
          Join hundreds of Greek hospitality professionals who are already improving their guest relations.
        </p>
        
        <form onSubmit={handleWaitlistSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            required
          />
          <Button type="submit" disabled={isSubmitting} className="sm:px-8">
            {isSubmitting ? 'Joining...' : 'Join Waitlist'}
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