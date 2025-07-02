import { Review } from '@/data/mockData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewCardProps {
  review: Review;
}

const platformColors = {
  booking: 'bg-blue-500',
  airbnb: 'bg-red-500',
  google: 'bg-green-500',
  tripadvisor: 'bg-orange-500'
};

const platformLabels = {
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  google: 'Google',
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
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={`${platformColors[review.platform]} text-white`}>
              {platformLabels[review.platform]}
            </Badge>
            <span className="text-sm text-muted-foreground">{review.propertyName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm font-medium">{review.rating}/5</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-medium">{review.guestName}</span>
          <span>{formatDate(review.date)}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-700 mb-4 line-clamp-3">{review.text}</p>
        
        {review.replied && review.replyText && (
          <div className="bg-primary-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-medium text-primary mb-1">Your Reply:</p>
            <p className="text-sm text-gray-700">{review.replyText}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Badge variant={review.replied ? "secondary" : "outline"}>
            {review.replied ? 'Replied' : 'Needs Reply'}
          </Badge>
          
          {!review.replied && (
            <Link to={`/reply/${review.id}`}>
              <Button size="sm" variant="professional">
                Reply
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}