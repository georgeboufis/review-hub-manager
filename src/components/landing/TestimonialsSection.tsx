import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export function TestimonialsSection() {
  return (
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
  );
}