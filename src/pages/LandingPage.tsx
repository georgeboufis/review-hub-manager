import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Upload, MessageSquare, Zap, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { motion } from 'motion/react';

const testimonials = [
  {
    text: "This app has revolutionized how we manage guest feedback. We've increased our response rate by 300% and our overall rating has improved significantly.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Maria Konstantinou",
    role: "Boutique Hotel Owner, Mykonos",
  },
  {
    text: "Finally, a solution that understands the Greek hospitality market. The CSV import feature saved us hours of manual work every week.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Dimitris Papadakis",
    role: "Airbnb Superhost, Santorini",
  },
  {
    text: "The Google Reviews integration is seamless. We never miss a guest comment anymore and our reputation management has improved dramatically.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Anna Nikolaidou",
    role: "Property Manager, Athens",
  },
  {
    text: "Managing reviews from Booking.com, Airbnb, and Google was a nightmare. This dashboard simplified everything and boosted our efficiency.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Kostas Georgiou",
    role: "Hotel Chain Manager, Crete",
  },
  {
    text: "The unified reply system helped us maintain consistent communication across all platforms. Our guest satisfaction scores have never been higher.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Sofia Antoniadou",
    role: "Vacation Rental Owner, Rhodes",
  },
  {
    text: "As a property management company, this tool streamlined our review workflow. We can now manage 50+ properties efficiently from one dashboard.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Elena Katsaros",
    role: "Operations Director, Thessaloniki",
  },
];

const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

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

          {/* Animated Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="max-w-5xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="border border-border/50 py-2 px-4 rounded-lg bg-card/50 backdrop-blur-sm">
                <span className="text-sm text-muted-foreground">Testimonials</span>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-4">
              What our users say
            </h3>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              See what hospitality professionals across Greece have to say about transforming their review management.
            </p>
            
            <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[500px] overflow-hidden">
              <TestimonialsColumn testimonials={firstColumn} duration={15} />
              <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
              <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
            </div>
          </motion.div>
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