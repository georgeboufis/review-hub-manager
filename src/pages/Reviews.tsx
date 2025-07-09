import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReviewCard from '@/components/ReviewCard';
import { Search, Crown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useReviews } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewsService } from '@/services/reviewsService';
import { UpgradeModal } from '@/components/UpgradeModal';

export default function Reviews() {
  const { t } = useLanguage();
  const { reviews, loading, error, createReview } = useReviews();
  const { subscriptionStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [reviewLimitInfo, setReviewLimitInfo] = useState<{
    canAdd: boolean;
    reviewCount: number;
    limit: number;
    isSubscribed: boolean;
  } | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const checkReviewLimit = async () => {
      const result = await ReviewsService.canAddReview();
      setReviewLimitInfo(result);
    };
    
    if (!loading) {
      checkReviewLimit();
    }
  }, [loading, reviews.length]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.guest_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || review.platform === platformFilter;
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === 'high' && review.rating >= 4) ||
                         (ratingFilter === 'medium' && review.rating === 3) ||
                         (ratingFilter === 'low' && review.rating <= 2);
    
    return matchesSearch && matchesPlatform && matchesRating;
  });

  const pendingCount = reviews.filter(review => !review.replied).length;

  // Test function to create a demo review
  const createTestReview = async () => {
    // Check if user can add review before creating
    if (reviewLimitInfo && !reviewLimitInfo.canAdd) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const result = await createReview({
        platform: 'test',
        guest_name: 'Test User',
        date: new Date().toISOString().split('T')[0],
        rating: 5,
        review_text: 'This is a test review to verify the system is working!'
      });
      
      if (result.success) {
        console.log('Test review created successfully');
      } else {
        console.error('Failed to create test review:', result.error);
      }
    } catch (error) {
      console.error('Error creating test review:', error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('reviews_title')}</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">{t('reviews_subtitle')}</p>
        
        {/* Debug info */}
        {loading && (
          <p className="text-sm text-blue-600 mt-2">Loading reviews...</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">Error: {error}</p>
        )}
        {!loading && !error && reviews.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              No reviews found. This might be because:
            </p>
            <ul className="text-sm text-yellow-700 mt-2 list-disc ml-4">
              <li>You're not logged in properly</li>
              <li>No reviews have been added yet</li>
              <li>There's a database connection issue</li>
            </ul>
            <Button 
              onClick={createTestReview}
              size="sm"
              className="mt-3"
            >
              Create Test Review
            </Button>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-r from-background to-accent/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('search_reviews')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 md:h-11"
              />
            </div>
            
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="h-10 md:h-11">
                <SelectValue placeholder={t('filter_by_platform')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_platforms')}</SelectItem>
                <SelectItem value="booking">Booking.com</SelectItem>
                <SelectItem value="airbnb">Airbnb</SelectItem>
                <SelectItem value="google">Google Reviews</SelectItem>
                <SelectItem value="tripadvisor">TripAdvisor</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="h-10 md:h-11">
                <SelectValue placeholder={t('filter_by_rating')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all_ratings')}</SelectItem>
                <SelectItem value="high">4-5 Stars</SelectItem>
                <SelectItem value="medium">3 Stars</SelectItem>
                <SelectItem value="low">1-2 Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(platformFilter !== 'all' || ratingFilter !== 'all' || searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {platformFilter !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 transition-colors" 
                  onClick={() => setPlatformFilter('all')}
                >
                  Platform: {platformFilter} ×
                </Badge>
              )}
              {ratingFilter !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 transition-colors" 
                  onClick={() => setRatingFilter('all')}
                >
                  Rating: {ratingFilter} ×
                </Badge>
              )}
              {searchTerm && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-secondary/80 transition-colors" 
                  onClick={() => setSearchTerm('')}
                >
                  Search: "{searchTerm}" ×
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Limit Alert */}
      {reviewLimitInfo && !reviewLimitInfo.isSubscribed && (
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <Crown className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-medium text-amber-800">
                Free Plan: {reviewLimitInfo.reviewCount}/{reviewLimitInfo.limit} reviews used
              </span>
              {reviewLimitInfo.reviewCount >= reviewLimitInfo.limit && (
                <p className="text-sm text-amber-700 mt-1">
                  You've reached your review limit. Upgrade to Pro for unlimited reviews.
                </p>
              )}
            </div>
            <Link to="/settings">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 ml-4">
                <Crown className="w-4 h-4 mr-1" />
                Upgrade to Pro
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredReviews.length} of {reviews.length} reviews
        </p>
        {pendingCount > 0 && (
          <Badge variant="outline" className="text-orange-600 border-orange-600">
            {pendingCount} pending replies
          </Badge>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="loading-skeleton h-40 w-full rounded-lg"></div>
            ))}
          </div>
        ) : error ? (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="text-center py-12">
              <div className="text-destructive text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Reviews</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        ) : filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-dashed">
            <CardContent className="text-center py-16">
              <div className="text-muted-foreground text-6xl mb-4">
                {searchTerm || platformFilter !== 'all' || ratingFilter !== 'all' ? '🔍' : '📝'}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchTerm || platformFilter !== 'all' || ratingFilter !== 'all' 
                  ? 'No reviews match your filters' 
                  : 'No reviews yet'}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchTerm || platformFilter !== 'all' || ratingFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters to see more results.' 
                  : 'Your reviews will appear here once you import them from your platforms.'}
              </p>
              {(searchTerm || platformFilter !== 'all' || ratingFilter !== 'all') ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setPlatformFilter('all');
                    setRatingFilter('all');
                  }}
                >
                  Clear All Filters
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/integrations" className="w-full sm:w-auto">
                    <Button variant="professional" className="w-full">Import Reviews</Button>
                  </Link>
                  <Button variant="outline" onClick={createTestReview} className="w-full sm:w-auto">
                    Create Test Review
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        reviewCount={reviewLimitInfo?.reviewCount || 0}
        limit={reviewLimitInfo?.limit || 10}
      />
    </div>
  );
}