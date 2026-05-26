-- Add missing notification columns
alter table profiles 
  add column if not exists sms_enabled boolean default false,
  add column if not exists email_notifications boolean default true;

alter table auctions 
  add column if not exists ending_soon_notified boolean default false;
