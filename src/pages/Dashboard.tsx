import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics, useReviews } from '@/hooks/useReviews';
import { useAnalytics as useAppAnalytics } from '@/hooks/useAnalytics';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeedbackModal from '@/components/FeedbackModal';
import StickyFilterBar from '@/components/filters/StickyFilterBar';
import PlatformRatingsRow from '@/components/PlatformRatingsRow';
import AnalyticsPanel from '@/components/analytics/AnalyticsPanel';

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

  const { totalReviews, averageRating, pendingReplies, recentReviews } = analytics;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? 'text-primary fill-current' : 'text-muted-foreground'}`}
      />
    ));
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('dashboard_title')}</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{t('dashboard_subtitle')}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setFeedbackModalOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sm:hidden">Feedback</span>
          <span className="hidden sm:inline">Give Feedback</span>
        </Button>
      </div>

      {/* Sticky Filters */}
      <StickyFilterBar />

      {/* Central Aggregated Rating */}
      <Card className="rounded-xl shadow-soft border">
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Overall Rating</h3>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold text-foreground leading-none">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(averageRating)}</div>
                <span className="text-muted-foreground text-sm">/ 5</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on <span className="font-semibold text-foreground">{totalReviews}</span> reviews ·
              <span className="ml-2">{pendingReplies} pending replies</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="border rounded-lg shadow-soft">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Total Reviews</div>
                <div className="text-2xl font-bold text-foreground">{totalReviews}</div>
              </CardContent>
            </Card>
            <Card className="border rounded-lg shadow-soft">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Pending Replies</div>
                <div className="text-2xl font-bold text-foreground">{pendingReplies}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Platform ratings row */}
      <PlatformRatingsRow reviews={reviews} />

      {/* Recent Reviews */}
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('recent_reviews')}</h2>
          <Link to="/reviews">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              View All
            </Button>
          </Link>
        </div>

        {analyticsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-skeleton h-32 w-full" />
            ))}
          </div>
        ) : recentReviews.length > 0 ? (
          <>
            {/* Mobile swipe carousel */}
            <div className="md:hidden -mx-4 px-4 overflow-x-auto snap-x snap-mandatory">
              <div className="flex gap-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="snap-start min-w-[85%]">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop list */}
            <div className="hidden md:block space-y-4">
              {recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </>
        ) : (
          <Card className="bg-gradient-to-br from-muted/20 to-muted/10 border-dashed">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground text-6xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start by adding some dummy data or create your first review to see them here!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/reviews" className="w-full sm:w-auto">
                  <Button variant="professional" className="w-full">{t('view_all_reviews')}</Button>
                </Link>
                <Link to="/integrations" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full">Add Reviews</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Analytics Panel */}
      <AnalyticsPanel />

      <FeedbackModal 
        open={feedbackModalOpen} 
        onOpenChange={setFeedbackModalOpen} 
      />
    </div>
  );
}
