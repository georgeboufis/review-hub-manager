-- Add encryption metadata to user_integrations table for better credential security
ALTER TABLE public.user_integrations 
ADD COLUMN IF NOT EXISTS encryption_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_platform 
ON public.user_integrations(user_id, platform);

-- Create index for monitoring access patterns
CREATE INDEX IF NOT EXISTS idx_user_integrations_last_accessed 
ON public.user_integrations(last_accessed);

-- Create function to log credential access
CREATE OR REPLACE FUNCTION public.log_credential_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Update access tracking on SELECT operations
  IF TG_OP = 'SELECT' THEN
    UPDATE public.user_integrations 
    SET 
      last_accessed = NOW(),
      access_count = COALESCE(access_count, 0) + 1
    WHERE id = NEW.id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;