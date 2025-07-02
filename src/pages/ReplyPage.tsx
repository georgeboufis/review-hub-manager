import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { mockReviews } from '@/data/mockData';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const platformLabels = {
  booking: 'Booking.com',
  airbnb: 'Airbnb',
  google: 'Google',
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
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const review = mockReviews.find(r => r.id === reviewId);

  useEffect(() => {
    if (review?.replied && review.replyText) {
      setReplyText(review.replyText);
    }
  }, [review]);

  if (!review) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Review Not Found</h1>
        <Button onClick={() => navigate('/reviews')}>
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Reply sent successfully!",
      description: `Your reply to ${review.guestName} has been posted on ${platformLabels[review.platform]}.`,
    });
    
    setIsSubmitting(false);
    navigate('/reviews');
  };

  const suggestedReplies = [
    "Thank you so much for your wonderful review! We're delighted you enjoyed your stay and look forward to welcoming you back.",
    "We appreciate your feedback and are glad you had a positive experience. Thank you for choosing to stay with us!",
    "Thank you for taking the time to leave this review. We're sorry to hear about the issues you experienced and will address them immediately.",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {review.replied ? 'Edit Reply' : 'Reply to Review'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/reviews')}>
          Back to Reviews
        </Button>
      </div>

      {/* Original Review */}
      <Card>
        <CardHeader>
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
            <span className="font-medium text-lg text-foreground">{review.guestName}</span>
            <span>{formatDate(review.date)}</span>
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{review.text}</p>
        </CardContent>
      </Card>

      {/* Reply Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Reply</CardTitle>
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
                This reply will be posted publicly on {platformLabels[review.platform]}
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