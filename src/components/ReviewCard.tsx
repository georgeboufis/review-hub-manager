import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Review } from '@/services/reviewsService';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewCardProps {
  review: Review;
}

const platformColors = {
  booking: 'bg-blue-600 text-white',
  airbnb: 'bg-red-600 text-white', 
  google: 'bg-green-600 text-white',
  tripadvisor: 'bg-orange-600 text-white'
};

const platformLabelKey = (platform: string) => {
  switch (platform) {
    case 'booking': return 'platform_booking';
    case 'airbnb': return 'platform_airbnb';
    case 'google': return 'platform_google';
    case 'tripadvisor': return 'platform_tripadvisor';
    default: return 'platform_google';
  }
};

export default function ReviewCard({ review }: ReviewCardProps) {
  const { t, currentLanguage } = useLanguage();
  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'el' ? 'el-GR' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
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
            i < rating ? 'text-primary-600 fill-current' : 'text-muted-foreground'
          }`}
      />
    ));
  };

  const reviewText = currentLanguage === 'el' && (review as any).review_text_el
    ? (review as any).review_text_el
    : review.review_text;

  const replyText = currentLanguage === 'el' && (review as any).reply_text_el
    ? (review as any).reply_text_el
    : review.reply_text;

  return (
    <Card className="interactive-card border border-border rounded-xl bg-card shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-200">
      <CardHeader className="pb-3 md:pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <Badge className={`${platformColors[review.platform as keyof typeof platformColors]} text-xs`}>
              {t(platformLabelKey(review.platform))}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="text-sm font-semibold text-foreground">{review.rating}/5</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2 text-sm">
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">{review.guest_name}</span>
          <span className="text-muted-foreground text-xs sm:text-sm">{formatDate(review.date)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3 md:space-y-4">
        <p className="text-sm text-foreground leading-relaxed line-clamp-3 animate-fade-in">
          {reviewText}
        </p>
        
        {review.replied && replyText && (
          <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
            <p className="text-xs font-semibold text-primary mb-2">{t('your_reply')}:</p>
            <p className="text-sm text-foreground leading-relaxed">{replyText}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
          <Badge 
            variant={review.replied ? "secondary" : "outline"}
            className={`${review.replied ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"} text-xs`}
          >
            {review.replied ? t('replied') : t('needs_reply')}
          </Badge>
          
          <Link to={`/reply/${review.id}`} className="w-full sm:w-auto">
            <Button 
              size="sm" 
              variant={review.replied ? "outline" : "professional"}
              className="min-w-[80px] w-full sm:w-auto"
            >
              {review.replied ? t('edit_reply') : t('reply')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}