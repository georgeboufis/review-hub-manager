import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics, useReviews } from '@/hooks/useReviews';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { initializeDummyData, reviews, loading: reviewsLoading } = useReviews();

  // Initialize dummy data for new users on first load
  useEffect(() => {
    initializeDummyData();
  }, [initializeDummyData]);

  const { totalReviews, averageRating, pendingReplies, platformDistribution, recentReviews } = analytics;

  // Calculate platform counts from distribution
  const platformCounts = {
    booking: platformDistribution.booking || 0,
    airbnb: platformDistribution.airbnb || 0,
    google: platformDistribution.google || 0,
    tripadvisor: platformDistribution.tripadvisor || 0,
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard_title')}</h1>
        <p className="text-muted-foreground mt-2">{t('dashboard_subtitle')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalReviews}</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('average_rating')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex">{renderStars(averageRating)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pending_replies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingReplies}</div>
            <p className="text-xs text-muted-foreground">Need your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{Math.floor(totalReviews * 0.3)}</div>
            <p className="text-xs text-muted-foreground">New reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('platform_distribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{platformCounts.booking}</div>
              <Badge className="bg-blue-500 text-white">Booking.com</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{platformCounts.airbnb}</div>
              <Badge className="bg-red-500 text-white">Airbnb</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{platformCounts.google}</div>
              <Badge className="bg-green-500 text-white">Google</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{platformCounts.tripadvisor}</div>
              <Badge className="bg-orange-500 text-white">TripAdvisor</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t('recent_reviews')}</h2>
        <div className="grid gap-6">
          {analyticsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reviews...</div>
          ) : recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No reviews yet. Start by adding some dummy data or create your first review!</p>
              <Link to="/reviews">
                <Button variant="professional">{t('view_all_reviews')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}