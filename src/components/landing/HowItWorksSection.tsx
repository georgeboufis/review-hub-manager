export function HowItWorksSection() {
  return (
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
  );
}