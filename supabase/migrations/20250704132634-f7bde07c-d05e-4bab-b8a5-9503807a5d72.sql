-- Set up the cron job to run daily at 07:00
SELECT cron.schedule(
  'daily-data-sync',
  '0 7 * * *', -- Every day at 07:00
  $$
  SELECT
    net.http_post(
      url := 'https://ymjszykyahkmaspgwsby.supabase.co/functions/v1/daily-data-sync',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltanN6eWt5YWhrbWFzcGd3c2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzYxODksImV4cCI6MjA2NzA1MjE4OX0.tztOR2k8lIV5t79vI3B9apxy68roHSC5-39Y81PFhwg"}'::jsonb,
      body := '{"source": "cron"}'::jsonb
    ) as request_id;
  $$
);