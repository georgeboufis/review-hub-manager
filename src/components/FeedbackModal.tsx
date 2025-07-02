import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { FeedbackService } from '@/services/feedbackService';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const { data, error } = await FeedbackService.submitFeedback({
      rating,
      comment: comment.trim() || undefined,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      });
      handleClose();
    }
    
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);
      
      return (
        <Star
          key={i}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            isActive 
              ? 'text-yellow-400 fill-current' 
              : 'text-muted-foreground hover:text-yellow-300'
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Rating Section */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              How would you rate your experience?
            </p>
            <div className="flex justify-center space-x-1">
              {renderStars()}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Comment Section */}
          <div>
            <label htmlFor="feedback-comment" className="block text-sm font-medium mb-2">
              Comments (optional)
            </label>
            <Textarea
              id="feedback-comment"
              placeholder="Tell us more about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}