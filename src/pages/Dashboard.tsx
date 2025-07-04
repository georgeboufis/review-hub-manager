import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { ProductionHealthCheck } from '@/components/ProductionHealthCheck';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics, useReviews } from '@/hooks/useReviews';
import { useAnalytics as useAppAnalytics } from '@/hooks/useAnalytics';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeedbackModal from '@/components/FeedbackModal';

export default function Dashboard() {
  const { t } = useLanguage();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  const { initializeDummyData, reviews, loading: reviewsLoading } = useReviews();
  const { trackUserAction } = useAppAnalytics();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Initialize dummy data for new users on first load
  useEffect(() => {
    initializeDummyData();
  }, [initializeDummyData]);

  useEffect(() => {
    trackUserAction('dashboard_view');
  }, [trackUserAction]);

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard_title')}</h1>
          <p className="text-muted-foreground mt-2">{t('dashboard_subtitle')}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setFeedbackModalOpen(true)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Give Feedback
        </Button>
      </div>

      {/* Production Health Check */}
      <ProductionHealthCheck />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">{t('total_reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-1">{totalReviews}</div>
            <p className="text-xs text-blue-700/80">Across all platforms</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-green-900">{t('average_rating')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 mb-1">
              <div className="text-3xl font-bold text-green-600">{averageRating.toFixed(1)}</div>
              <div className="flex">{renderStars(averageRating)}</div>
            </div>
            <p className="text-xs text-green-700/80">Overall performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-orange-900">{t('pending_replies')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 mb-1">{pendingReplies}</div>
            <p className="text-xs text-orange-700/80">Need your attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-purple-900">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-1">+{Math.floor(totalReviews * 0.3)}</div>
            <p className="text-xs text-purple-700/80">New reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <Card className="bg-gradient-to-r from-background to-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">{t('platform_distribution')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{platformCounts.booking}</div>
              <Badge className="bg-blue-600 text-white px-3 py-1">Booking.com</Badge>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{platformCounts.airbnb}</div>
              <Badge className="bg-red-600 text-white px-3 py-1">Airbnb</Badge>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{platformCounts.google}</div>
              <Badge className="bg-green-600 text-white px-3 py-1">Google</Badge>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">{platformCounts.tripadvisor}</div>
              <Badge className="bg-orange-600 text-white px-3 py-1">TripAdvisor</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reviews */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">{t('recent_reviews')}</h2>
          <Link to="/reviews">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        <div className="space-y-4">
          {analyticsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="loading-skeleton h-32 w-full"></div>
              ))}
            </div>
          ) : recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-dashed">
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start by adding some dummy data or create your first review to see them here!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/reviews">
                    <Button variant="professional">{t('view_all_reviews')}</Button>
                  </Link>
                  <Link to="/integrations">
                    <Button variant="outline">Add Reviews</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <FeedbackModal 
        open={feedbackModalOpen} 
        onOpenChange={setFeedbackModalOpen} 
      />
    </div>
  );
}