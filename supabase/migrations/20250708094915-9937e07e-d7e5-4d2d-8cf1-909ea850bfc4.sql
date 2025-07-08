-- Enable required extensions for automated backups
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create backup logs table to track backup history
CREATE TABLE IF NOT EXISTS public.backup_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_id TEXT NOT NULL UNIQUE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tables_backed_up TEXT[] NOT NULL,
  total_records INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on backup logs (admin only)
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Only allow service role to access backup logs
CREATE POLICY "Service role can manage backup logs" 
ON public.backup_logs 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Schedule daily database backup at 2 AM UTC
SELECT cron.schedule(
  'daily-database-backup',
  '0 2 * * *', -- Every day at 2 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://ymjszykyahkmaspgwsby.supabase.co/functions/v1/database-backup',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltanN6eWt5YWhrbWFzcGd3c2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ3NjE4OSwiZXhwIjoyMDY3MDUyMTg5fQ.bfz3Qr9YG0xGmPZ7DPfIGZ1J5JfV5ZOQlZHOVq8PZYk"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Create a function to manually trigger backup
CREATE OR REPLACE FUNCTION public.trigger_manual_backup()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Call the backup edge function
  SELECT net.http_post(
    url := 'https://ymjszykyahkmaspgwsby.supabase.co/functions/v1/database-backup',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltanN6eWt5YWhrbWFzcGd3c2J5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ3NjE4OSwiZXhwIjoyMDY3MDUyMTg5fQ.bfz3Qr9YG0xGmPZ7DPfIGZ1J5JfV5ZOQlZHOVq8PZYk"}'::jsonb,
    body := '{"manual": true}'::jsonb
  ) INTO result;
  
  RETURN result;
END;
$$;