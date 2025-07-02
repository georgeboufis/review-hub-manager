import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground mt-2">Last updated: [Date]</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p>By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Our service provides tools for managing guest reviews from various platforms including:</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Google Reviews integration</li>
            <li>Booking.com and Airbnb CSV import</li>
            <li>Manual review entry and management</li>
            <li>Review response tools</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Free Plan:</strong> Up to 10 reviews</p>
          <p><strong>Pro Plan:</strong> Unlimited reviews for €29/month</p>
          <p>Billing is handled securely through Stripe. You may cancel your subscription at any time.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>For questions about these Terms of Service, please contact us at: [contact@yourdomain.com]</p>
        </CardContent>
      </Card>
    </div>
  );
}