-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('booking', 'airbnb', 'google', 'tripadvisor')),
  guest_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  reply_text TEXT,
  replied BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platforms table for reference
CREATE TABLE public.platforms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert platform data
INSERT INTO public.platforms (name, color) VALUES
  ('Booking.com', 'bg-blue-500'),
  ('Airbnb', 'bg-red-500'),
  ('Google Reviews', 'bg-green-500'),
  ('TripAdvisor', 'bg-orange-500');

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reviews
CREATE POLICY "Users can view their own reviews" 
ON public.reviews 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for platforms (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view platforms" 
ON public.platforms 
FOR SELECT 
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_platform ON public.reviews(platform);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_date ON public.reviews(date DESC);

-- Create trigger for automatic timestamp updates on reviews
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for testing (these will be associated with the first user that signs up)
-- Note: We'll insert data with a placeholder user_id that can be updated later
CREATE OR REPLACE FUNCTION insert_dummy_reviews(_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO public.reviews (platform, guest_name, date, rating, review_text, reply_text, replied, user_id) VALUES
    ('booking', 'Sarah Johnson', '2024-06-15', 5, 'Amazing stay! The apartment was spotless and exactly as described. Host was very responsive and helpful throughout our visit.', 'Thank you so much Sarah! We''re delighted you enjoyed your stay with us.', true, _user_id),
    ('airbnb', 'Mike Chen', '2024-06-10', 4, 'Great location and clean space. Only minor issue was the WiFi being a bit slow, but everything else was perfect.', NULL, false, _user_id),
    ('google', 'Emma Wilson', '2024-06-08', 5, 'Fantastic experience! Beautiful apartment in the heart of the city. Would definitely recommend to anyone visiting.', 'We appreciate your wonderful review Emma! Hope to host you again soon.', true, _user_id),
    ('tripadvisor', 'David Brown', '2024-06-05', 3, 'The place was okay, but not as clean as expected. The location was good though.', NULL, false, _user_id),
    ('booking', 'Lisa Garcia', '2024-06-01', 5, 'Outstanding hospitality! The host went above and beyond to make our stay comfortable. Highly recommended!', 'Thank you Lisa! Your kind words mean the world to us.', true, _user_id),
    ('airbnb', 'John Smith', '2024-05-28', 4, 'Nice apartment with great amenities. Check-in process was smooth and the host was very accommodating.', NULL, false, _user_id),
    ('google', 'Maria Rodriguez', '2024-05-25', 5, 'Perfect location, beautiful space, and excellent communication from the host. Everything was exactly as promised.', 'Thanks Maria! We''re so happy you had a great experience.', true, _user_id),
    ('booking', 'Tom Anderson', '2024-05-20', 2, 'Had some issues with the heating and the place wasn''t as clean as expected. Location was good but overall disappointed.', NULL, false, _user_id);
END;
$$ LANGUAGE plpgsql;