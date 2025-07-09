import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Review } from '@/services/reviewsService';

interface ReviewCardProps {
  review: Review;
}

const platformColors = {
  booking: 'bg-blue-600 text-white',
  airbnb: 'bg-red-600 text-white', 
  google: 'bg-green-600 text-white',
  tripadvisor: 'bg-orange-600 text-white'
};

const platformLabels = {
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  google: 'Google Reviews',
  tripadvisor: 'TripAdvisor'
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="interactive-card border-border hover:border-primary/30 transition-all duration-200 bg-card">
      <CardHeader className="pb-3 md:pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Badge className={`${platformColors[review.platform as keyof typeof platformColors]} text-xs`}>
              {platformLabels[review.platform as keyof typeof platformLabels]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm font-semibold text-foreground">{review.rating}/5</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 text-sm">
          <span className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none">{review.guest_name}</span>
          <span className="text-muted-foreground text-xs sm:text-sm">{formatDate(review.date)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 md:space-y-4">
        <p className="text-sm text-foreground leading-relaxed line-clamp-3">
          {review.review_text}
        </p>
        
        {review.replied && review.reply_text && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-primary mb-2">Your Reply:</p>
            <p className="text-sm text-foreground leading-relaxed">{review.reply_text}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <Badge 
            variant={review.replied ? "secondary" : "outline"}
            className={`${review.replied ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"} text-xs`}
          >
            {review.replied ? 'Replied' : 'Needs Reply'}
          </Badge>
          
          <Link to={`/reply/${review.id}`} className="w-full sm:w-auto">
            <Button 
              size="sm" 
              variant={review.replied ? "outline" : "professional"}
              className="min-w-[80px] w-full sm:w-auto"
            >
              {review.replied ? 'Edit Reply' : 'Reply'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}