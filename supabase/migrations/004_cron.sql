-- Enable pg_cron extension (run once)
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'check-ending-auctions',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/check-ending-auctions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    )
  )
  $$
);

select cron.schedule(
  'finalize-ended-auctions',
  '* * * * *',
  $$
  select net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/finalize-ended-auctions',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.service_role_key')
    )
  )
  $$
);
