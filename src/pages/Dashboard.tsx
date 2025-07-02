import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockReviews, analyticsData } from '@/data/mockData';
import { Star } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();
  const totalReviews = mockReviews.length;
  const averageRating = (mockReviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1);
  const pendingReplies = mockReviews.filter(review => !review.replied).length;
  
  const platformCounts = {
    booking: mockReviews.filter(r => r.platform === 'booking').length,
    airbnb: mockReviews.filter(r => r.platform === 'airbnb').length,
    google: mockReviews.filter(r => r.platform === 'google').length,
    tripadvisor: mockReviews.filter(r => r.platform === 'tripadvisor').length,
  };

  const recentReviews = mockReviews.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(parseFloat(rating.toString())) ? 'text-yellow-400 fill-current' : 'text-gray-300'
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
              <div className="text-2xl font-bold text-primary">{averageRating}</div>
              <div className="flex">{renderStars(parseFloat(averageRating))}</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}