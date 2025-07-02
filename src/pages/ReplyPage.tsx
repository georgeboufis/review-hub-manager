import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReviewsService, Review } from '@/services/reviewsService';
import { useReviews } from '@/hooks/useReviews';

const platformLabels = {
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  google: 'Google Reviews',
  tripadvisor: 'TripAdvisor'
};

const platformColors = {
  booking: 'bg-blue-500',
  airbnb: 'bg-red-500',
  google: 'bg-green-500',
  tripadvisor: 'bg-orange-500'
};

export default function ReplyPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateReviewReply } = useReviews();
  const [review, setReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId) return;
      
      setLoading(true);
      const { data, error } = await ReviewsService.getReviewById(reviewId);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load review",
          variant: "destructive",
        });
        navigate('/reviews');
        return;
      }
      
      if (data) {
        setReview(data);
        setReplyText(data.reply_text || '');
      }
      setLoading(false);
    };

    fetchReview();
  }, [reviewId, navigate, toast]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg text-primary">Loading review...</div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Review Not Found</h1>
        <Button onClick={() => navigate('/reviews')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    
    const { success, error } = await updateReviewReply(review.id, replyText);
    
    if (success) {
      toast({
        title: "Reply sent successfully!",
        description: `Your reply to ${review.guest_name} has been posted on ${platformLabels[review.platform as keyof typeof platformLabels]}.`,
      });
      navigate('/reviews');
    } else {
      toast({
        title: "Error",
        description: error?.message || "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const suggestedReplies = [
    "Thank you so much for your wonderful review! We're delighted you enjoyed your stay and look forward to welcoming you back.",
    "We appreciate your feedback and are glad you had a positive experience. Thank you for choosing to stay with us!",
    "Thank you for taking the time to leave this review. We're sorry to hear about the issues you experienced and will address them immediately.",
    "We're thrilled to hear you had such a great experience! Your feedback means the world to us.",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {review.replied ? 'Edit Reply' : 'Reply to Review'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/reviews')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reviews
        </Button>
      </div>

      {/* Original Review */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className={`${platformColors[review.platform as keyof typeof platformColors]} text-white`}>
                {platformLabels[review.platform as keyof typeof platformLabels]}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(review.rating)}</div>
              <span className="text-sm font-medium">{review.rating}/5</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium text-lg text-foreground">{review.guest_name}</span>
            <span>{formatDate(review.date)}</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
          
          {review.replied && review.reply_text && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium text-primary mb-2">Current Reply:</p>
              <p className="text-sm text-gray-700">{review.reply_text}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reply Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{review.replied ? 'Edit Your Reply' : 'Your Reply'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your reply to the guest..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            
            <div className="text-sm text-muted-foreground">
              {replyText.length}/1000 characters
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                This reply will be posted publicly on {platformLabels[review.platform as keyof typeof platformLabels]}
              </div>
              <div className="space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/reviews')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="professional"
                  disabled={!replyText.trim() || isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : review.replied ? 'Update Reply' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Replies */}
        <Card>
          <CardHeader>
            <CardTitle>Suggested Replies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestedReplies.map((suggestion, index) => (
                <div 
                  key={index}
                  className="p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setReplyText(suggestion)}
                >
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}