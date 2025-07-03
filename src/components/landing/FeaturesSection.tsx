import { Card, CardContent } from '@/components/ui/card';
import { Upload, MessageSquare, Zap } from 'lucide-react';

export function FeaturesSection() {
  return (
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
  );
}