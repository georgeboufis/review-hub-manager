import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
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

export function HeroSection() {
  return (
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
  );
}