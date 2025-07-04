-- Create pricing table for storing price data from platforms
CREATE TABLE public.pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  property_id TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pricing data" 
ON public.pricing 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pricing data" 
ON public.pricing 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pricing data" 
ON public.pricing 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pricing data" 
ON public.pricing 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_pricing_updated_at
BEFORE UPDATE ON public.pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION if not exists pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION if not exists pg_net;