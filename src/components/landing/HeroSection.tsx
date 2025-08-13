import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { motion } from 'motion/react';
import { useLanguage } from '@/contexts/LanguageContext';

const testimonials = (t: (key: string) => string) => [
  {
    text: t('testimonials_quote_1') || "This app has revolutionized how we manage guest feedback. We've increased our response rate by 300% and our overall rating has improved significantly.",
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    name: 'Maria Konstantinou',
    role: t('testimonials_role_1') || 'Boutique Hotel Owner, Mykonos',
  },
  {
    text: t('testimonials_quote_2') || 'Finally, a solution that understands the Greek hospitality market. The CSV import feature saved us hours of manual work every week.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    name: 'Dimitris Papadakis',
    role: t('testimonials_role_2') || 'Airbnb Superhost, Santorini',
  },
  {
    text: t('testimonials_quote_3') || 'The Google Reviews integration is seamless. We never miss a guest comment anymore and our reputation management has improved dramatically.',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    name: 'Anna Nikolaidou',
    role: t('testimonials_role_3') || 'Property Manager, Athens',
  },
  {
    text: t('testimonials_quote_4') || 'Managing reviews from Booking.com, Airbnb, and Google was a nightmare. This dashboard simplified everything and boosted our efficiency.',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    name: 'Kostas Georgiou',
    role: t('testimonials_role_4') || 'Hotel Chain Manager, Crete',
  },
  {
    text: t('testimonials_quote_5') || 'The unified reply system helped us maintain consistent communication across all platforms. Our guest satisfaction scores have never been higher.',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    name: 'Sofia Antoniadou',
    role: t('testimonials_role_5') || 'Vacation Rental Owner, Rhodes',
  },
  {
    text: t('testimonials_quote_6') || 'As a property management company, this tool streamlined our review workflow. We can now manage 50+ properties efficiently from one dashboard.',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    name: 'Elena Katsaros',
    role: t('testimonials_role_6') || 'Operations Director, Thessaloniki',
  },
];

const makeColumns = (t: (key: string) => string) => {
  const list = testimonials(t);
  return [list.slice(0, 2), list.slice(2, 4), list.slice(4, 6)];
};

export function HeroSection() {
  const { t } = useLanguage();
  const [firstColumn, secondColumn, thirdColumn] = makeColumns(t);
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            {t('hero_title_line1')}
            <span className="text-primary block mt-2">{t('hero_title_line2')}</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4">
              {t('cta_get_early_access')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              {t('cta_watch_demo')}
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
            {t('testimonials_heading')}
          </h3>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('testimonials_subheading')}
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