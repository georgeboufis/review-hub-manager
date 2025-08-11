import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { SignupSection } from '@/components/landing/SignupSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import ConstellationBackground from '@/components/background/ConstellationBackground';
export default function LandingPage() {
  return (
    <div className="min-h-screen relative">
      <ConstellationBackground />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <SignupSection />
      <LandingFooter />
    </div>
  );
}