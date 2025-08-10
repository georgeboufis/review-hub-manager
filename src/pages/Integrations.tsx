import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Globe, MapPin, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IntegrationService } from '@/services/integrationService';
import { ReviewsService } from '@/services/reviewsService';
import { useReviews } from '@/hooks/useReviews';
import { ManualReviewForm } from '@/components/ManualReviewForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Integrations() {
  
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const bookingFileRef = useRef<HTMLInputElement>(null);
  const airbnbFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { fetchReviews } = useReviews();
  const { t } = useLanguage();

  // Store Google API credentials and fetch reviews
  const handleGoogleConnect = async () => {
    if (!googlePlaceId) {
      toast({
        title: t('missing_information'),
        description: t('enter_place_id'),
        variant: "destructive",
      });
      return;
    }

    // Check review limit before importing
    const limitCheck = await ReviewsService.canAddReview();
    if (!limitCheck.canAdd) {
      toast({
        title: t('review_limit_reached'),
        description: t('review_limit_reached_description') + ` ${limitCheck.limit} ` + t('review_limit_plan_text'),
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Store credentials securely
      const storeResult = await IntegrationService.storeApiCredentials('google', {
        place_id: googlePlaceId
      });

      if (!storeResult.success) {
        throw new Error(storeResult.error || 'Failed to store credentials');
      }

      // Fetch reviews from Google Places API
      const result = await IntegrationService.fetchGoogleReviews(googlePlaceId);
      
      if (result.success) {
        toast({
          title: t('google_reviews_imported'),
          description: t('successfully_imported_google_reviews') + ` ${result.count} ` + t('reviews_from_google'),
        });
        
        // Refresh reviews data
        fetchReviews();
        
        // Clear the form
      setGooglePlaceId('');
      } else {
        throw new Error(result.error || 'Failed to fetch reviews');
      }
    } catch (error) {
      toast({
        title: t('connection_failed'),
        description: error instanceof Error ? error.message : t('failed_connect_google'),
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle Booking.com CSV import
  const handleBookingImport = async () => {
    const file = bookingFileRef.current?.files?.[0];
    if (!file) {
      toast({
        title: t('no_file_selected'),
        description: t('select_csv_file'),
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await IntegrationService.importCsvReviews(file, 'booking');
      
      if (result.success) {
        toast({
          title: t('booking_reviews_imported'),
            description: t('successfully_imported_csv_reviews') + ` ${result.count} ` + t('reviews_from_csv'),
        });
        
        // Refresh reviews data
        fetchReviews();
        
        // Clear the file input
        if (bookingFileRef.current) {
          bookingFileRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to import CSV');
      }
    } catch (error) {
      toast({
        title: t('import_failed'),
        description: error instanceof Error ? error.message : t('failed_import_csv'),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle Airbnb CSV import
  const handleAirbnbImport = async () => {
    const file = airbnbFileRef.current?.files?.[0];
    if (!file) {
      toast({
        title: t('no_file_selected'),
        description: t('select_csv_file'),
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await IntegrationService.importCsvReviews(file, 'airbnb');
      
      if (result.success) {
        toast({
          title: t('airbnb_reviews_imported'),
          description: t('successfully_imported_csv_reviews') + ` ${result.count} ` + t('reviews_from_csv'),
        });
        
        // Refresh reviews data
        fetchReviews();
        
        // Clear the file input
        if (airbnbFileRef.current) {
          airbnbFileRef.current.value = '';
        }
      } else {
        throw new Error(result.error || 'Failed to import CSV');
      }
    } catch (error) {
      toast({
        title: t('import_failed'),
        description: error instanceof Error ? error.message : t('failed_import_csv'),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('platform_integrations')}</h1>
        <p className="text-muted-foreground">
          {t('connect_review_platforms')}
        </p>
      </div>

      {/* Google Reviews Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-green-600" />
            <CardTitle>{t('google_reviews')}</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {t('api_available')}
            </Badge>
          </div>
          <CardDescription>
            {t('google_reviews_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="google-place-id">{t('place_id')}</Label>
            <Input
              id="google-place-id"
              placeholder={t('enter_place_id')}
              value={googlePlaceId}
              onChange={(e) => setGooglePlaceId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t('find_place_id_text')}{' '}
              <a 
                href="https://developers.google.com/maps/documentation/places/web-service/place-id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t('google_place_id_finder')}
              </a>
            </p>
          </div>

          <Button 
            onClick={handleGoogleConnect} 
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('fetching_reviews')}
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                {t('fetch_google_reviews')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Booking.com Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <CardTitle>{t('booking_reviews')}</CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {t('manual_import')}
            </Badge>
          </div>
          <CardDescription>
            {t('booking_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t('no_api_access')}</strong> {t('booking_restrictions')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="booking-csv">{t('upload_booking_csv')}</Label>
            <Input
              id="booking-csv"
              ref={bookingFileRef}
              type="file"
              accept=".csv"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {t('csv_format_expected')}
            </p>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleBookingImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('importing')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('import_csv_file')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Airbnb Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-red-600" />
            <CardTitle>{t('airbnb_reviews')}</CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {t('manual_import')}
            </Badge>
          </div>
          <CardDescription>
            {t('airbnb_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{t('api_discontinued')}</strong> {t('airbnb_restrictions')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="airbnb-csv">{t('upload_airbnb_csv')}</Label>
            <Input
              id="airbnb-csv"
              ref={airbnbFileRef}
              type="file"
              accept=".csv"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              {t('csv_format_expected')}
            </p>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleAirbnbImport}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('importing')}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t('import_csv_file')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Manual Review Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            <CardTitle>{t('manual_review_entry')}</CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {t('always_available')}
            </Badge>
          </div>
          <CardDescription>
            {t('manual_review_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsManualFormOpen(true)}
          >
            {t('add_review_manually')}
          </Button>
        </CardContent>
      </Card>

      {/* Security & Legal Notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-amber-800">{t('security_legal_considerations')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-amber-700">
          <div>
            <strong>{t('api_keys_security')}</strong> {t('api_keys_security_description')}
          </div>
          <div>
            <strong>{t('data_compliance')}</strong> {t('data_compliance_description')}
          </div>
          <div>
            <strong>{t('terms_of_service')}</strong> {t('terms_service_description')}
          </div>
          <div>
            <strong>{t('data_privacy')}</strong> {t('data_privacy_description')}
          </div>
        </CardContent>
      </Card>

      {/* Manual Review Form Modal */}
      <ManualReviewForm
        open={isManualFormOpen}
        onOpenChange={setIsManualFormOpen}
      />
    </div>
  );
}