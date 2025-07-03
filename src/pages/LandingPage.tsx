import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Upload, MessageSquare, Zap, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LandingPage() {
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Manage All Your Guest Reviews
              <span className="text-primary block mt-2">In One Place</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop juggling between Google, Booking.com, and Airbnb. Import, organize, and reply to all your guest reviews from a single, powerful dashboard built for Greek hospitality professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Social Proof - Mini Testimonials */}
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-muted-foreground mb-8 text-sm">
              Trusted by hospitality professionals across Greece
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">MK</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Maria K.</div>
                      <div className="text-xs text-muted-foreground">Hotel Owner, Mykonos</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Response rate increased by 300% since switching to this platform."
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">DP</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Dimitris P.</div>
                      <div className="text-xs text-muted-foreground">Airbnb Superhost, Santorini</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "CSV import saved us hours of manual work every week."
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">AN</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Anna N.</div>
                      <div className="text-xs text-muted-foreground">Property Manager, Athens</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "Finally, all our reviews in one organized dashboard."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            Everything You Need to Excel at Guest Relations
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Built specifically for hotels, Airbnb hosts, and short-term rental managers in Greece
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Google Reviews Integration</h3>
                <p className="text-muted-foreground">
                  Automatically sync your Google My Business reviews. Never miss a guest comment again.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy CSV Import</h3>
                <p className="text-muted-foreground">
                  Upload your Booking.com and Airbnb reviews with one click. No technical skills required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Unified Review Management</h3>
                <p className="text-muted-foreground">
                  Reply to all reviews from one dashboard. Track pending responses and improve guest satisfaction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">
                Link your Google My Business account and upload CSV files from Booking.com and Airbnb
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Import</h3>
              <p className="text-muted-foreground">
                All your reviews are automatically organized in one clean, easy-to-use dashboard
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Manage & Reply</h3>
              <p className="text-muted-foreground">
                Respond to guest reviews efficiently and track your reputation across all platforms
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Placeholder */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What Our Users Say
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
                  "This app has revolutionized how we manage guest feedback. We've increased our response rate by 300% and our overall rating has improved significantly."
                </p>
                <div className="font-semibold">Maria K.</div>
                <div className="text-sm text-muted-foreground">Boutique Hotel Owner, Mykonos</div>
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
                  "Finally, a solution that understands the Greek hospitality market. The CSV import feature saved us hours of manual work."
                </p>
                <div className="font-semibold">Dimitris P.</div>
                <div className="text-sm text-muted-foreground">Airbnb Superhost, Santorini</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Signup Section */}
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

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 GuestReviews Pro. Built for Greek hospitality professionals.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Contact us: hello@guestreviewspro.com
          </p>
        </div>
      </footer>
    </div>
  );
}