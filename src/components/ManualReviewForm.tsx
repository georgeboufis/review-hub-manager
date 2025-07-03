import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useReviews } from '@/hooks/useReviews';
import { validateReviewText, validateGuestName, checkRateLimit } from '@/lib/security';
import { sanitizeErrorMessage } from '@/lib/errorHandling';

const reviewFormSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  guest_name: z.string().min(1, 'Guest name is required').refine((val) => {
    const validation = validateGuestName(val);
    return validation.isValid;
  }, 'Invalid guest name format'),
  date: z.date({
    required_error: 'Date is required',
  }),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  review_text: z.string().min(1, 'Review text is required').refine((val) => {
    const validation = validateReviewText(val);
    return validation.isValid;
  }, 'Review text contains invalid content'),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ManualReviewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const platformOptions = [
  { value: 'google', label: 'Google' },
  { value: 'booking', label: 'Booking.com' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'tripadvisor', label: 'TripAdvisor' },
  { value: 'other', label: 'Other' },
];

export function ManualReviewForm({ open, onOpenChange }: ManualReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createReview } = useReviews();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      platform: '',
      guest_name: '',
      date: new Date(),
      rating: 5,
      review_text: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    // Rate limiting check
    const clientId = `review_form_${navigator.userAgent.slice(0, 20)}`;
    if (!checkRateLimit(clientId, 10, 300000)) { // 10 attempts per 5 minutes
      toast({
        title: 'Too Many Requests',
        description: 'Please wait before submitting another review.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Additional validation and sanitization
      const guestNameValidation = validateGuestName(data.guest_name);
      const reviewTextValidation = validateReviewText(data.review_text);

      if (!guestNameValidation.isValid || !reviewTextValidation.isValid) {
        throw new Error('Invalid input data');
      }

      const result = await createReview({
        platform: data.platform,
        guest_name: guestNameValidation.sanitized,
        date: format(data.date, 'yyyy-MM-dd'),
        rating: data.rating,
        review_text: reviewTextValidation.sanitized,
      });

      if (result.success) {
        toast({
          title: 'Review Added',
          description: 'The review has been successfully added.',
        });
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error(result.error?.message || 'Failed to create review');
      }
    } catch (error) {
      const sanitizedMessage = sanitizeErrorMessage(error);
      toast({
        title: 'Error',
        description: sanitizedMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Review Manually</DialogTitle>
          <DialogDescription>
            Enter review details from any platform or source.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Enter rating (1-5)"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the review text..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Review...
                  </>
                ) : (
                  'Add Review'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}