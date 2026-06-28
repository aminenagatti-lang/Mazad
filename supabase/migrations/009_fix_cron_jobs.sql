-- Migration: 009_fix_cron_jobs.sql
-- Fix cron jobs with actual Supabase URL and service role key

-- Remove existing jobs
SELECT cron.unschedule('check-ending-auctions');
SELECT cron.unschedule('finalize-ended-auctions');

-- Recreate with hardcoded values (safe for this project)
SELECT cron.schedule(
  'check-ending-auctions',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/check-ending-auctions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer your-service-role-key'
    )
  )
  $$
);

SELECT cron.schedule(
  'finalize-ended-auctions',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/finalize-ended-auctions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer your-service-role-key'
    )
  )
  $$
);
