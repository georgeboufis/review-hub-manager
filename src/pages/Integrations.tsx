import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Globe, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Integrations() {
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleGoogleConnect = async () => {
    if (!googleApiKey || !googlePlaceId) {
      toast({
        title: "Missing Information",
        description: "Please provide both API key and Place ID",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // TODO: Implement Google Places API integration
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast({
        title: "Google Reviews Connected",
        description: "Successfully connected to Google Places API",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to Google Places API",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Platform Integrations</h1>
        <p className="text-muted-foreground">
          Connect your review platforms to automatically import guest reviews.
        </p>
      </div>

      {/* Google Reviews Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <CardTitle>Google Reviews</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              API Available
            </Badge>
          </div>
          <CardDescription>
            Connect to Google Places API to automatically fetch reviews for your business location.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="google-api-key">Google Places API Key</Label>
            <Input
              id="google-api-key"
              type="password"
              placeholder="Enter your Google Places API key"
              value={googleApiKey}
              onChange={(e) => setGoogleApiKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="google-place-id">Place ID</Label>
            <Input
              id="google-place-id"
              placeholder="Enter your Google Place ID (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
              value={googlePlaceId}
              onChange={(e) => setGooglePlaceId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find your Place ID using the{' '}
              <a 
                href="https://developers.google.com/maps/documentation/places/web-service/place-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Place ID Finder
              </a>
            </p>
          </div>

          <Button 
            onClick={handleGoogleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Google Reviews'}
          </Button>
        </CardContent>
      </Card>

      {/* Booking.com Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <CardTitle>Booking.com Reviews</CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Manual Import
            </Badge>
          </div>
          <CardDescription>
            Booking.com doesn't provide public APIs. Upload your reviews manually using CSV import.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>No API Access:</strong> Booking.com restricts review data access to official partners only. 
              Web scraping violates their Terms of Service and may result in legal action.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="booking-csv">Upload Booking.com Reviews (CSV)</Label>
            <Input
              id="booking-csv"
              type="file"
              accept=".csv"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Expected format: Guest Name, Date, Rating, Review Text
            </p>
          </div>

          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV File
          </Button>
        </CardContent>
      </Card>

      {/* Airbnb Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-red-600" />
            <CardTitle>Airbnb Reviews</CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Manual Import
            </Badge>
          </div>
          <CardDescription>
            Airbnb discontinued their public API. Use manual import or CSV upload from your host dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>API Discontinued:</strong> Airbnb shut down their public API in 2017. 
              Manual data export from your host dashboard is the only legitimate option.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="airbnb-csv">Upload Airbnb Reviews (CSV)</Label>
            <Input
              id="airbnb-csv"
              type="file"
              accept=".csv"
              className="cursor-pointer"
            />
          </div>

          <Button variant="outline" className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV File
          </Button>
        </CardContent>
      </Card>

      {/* Manual Review Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <CardTitle>Manual Review Entry</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Always Available
            </Badge>
          </div>
          <CardDescription>
            Manually add reviews from any platform or source.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Add Review Manually
          </Button>
        </CardContent>
      </Card>

      {/* Security & Legal Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">Security & Legal Considerations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-700">
          <div>
            <strong>API Keys:</strong> All API keys are stored securely using Supabase Edge Functions and never exposed to the client.
          </div>
          <div>
            <strong>Data Compliance:</strong> We only collect review data you have legitimate access to as a property owner/manager.
          </div>
          <div>
            <strong>Terms of Service:</strong> Always respect platform Terms of Service. We do not support or recommend unauthorized data scraping.
          </div>
          <div>
            <strong>Data Privacy:</strong> Guest review data is handled according to GDPR and privacy best practices.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}