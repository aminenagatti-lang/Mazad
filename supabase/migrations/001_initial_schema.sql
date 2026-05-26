-- ENUMS
create type user_role as enum ('buyer', 'seller', 'admin');
create type seller_type as enum ('particulier', 'entreprise');
create type kyc_status as enum ('pending', 'verified', 'rejected');
create type vehicle_status as enum ('draft','pending_inspection','active','sold','unsold','cancelled');
create type auction_status as enum ('scheduled','active','ended','cancelled');
create type bid_status as enum ('active','outbid','won','cancelled');
create type document_type as enum ('cin_recto','cin_verso','selfie','rib','patente','statuts','carte_grise','rapport_inspection');
create type transmission as enum ('manuelle','automatique');
create type fuel_type as enum ('essence','diesel','hybride','electrique','gpl');

-- PROFILES (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'buyer',
  seller_type seller_type,
  first_name text,
  last_name text,
  phone text,
  city text,
  company_name text,
  matricule_fiscal text,
  secteur text,
  representant_legal text,
  adresse_siege text,
  kyc_status kyc_status default 'pending',
  kyc_submitted_at timestamptz,
  kyc_verified_at timestamptz,
  kyc_rejection_reason text,
  deposit_paid boolean default false,
  deposit_amount int,
  deposit_paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- KYC DOCUMENTS
create table kyc_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  document_type document_type not null,
  storage_path text not null,
  file_name text,
  file_size int,
  uploaded_at timestamptz default now(),
  verified boolean default false
);

-- VEHICLES
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references profiles(id) on delete cascade,
  status vehicle_status default 'draft',
  marque text not null,
  modele text not null,
  version text,
  annee int not null,
  kilometrage int not null,
  carburant fuel_type not null,
  transmission transmission not null,
  couleur text,
  nb_portes int,
  puissance_cv int,
  origine text default 'Tunisie',
  prix_depart int not null,
  prix_reserve int,
  description text,
  slug text unique,
  inspection_date timestamptz,
  inspection_score int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- VEHICLE PHOTOS
create table vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  storage_path text not null,
  is_cover boolean default false,
  display_order int default 0,
  uploaded_at timestamptz default now()
);

-- VEHICLE DOCUMENTS
create table vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  document_type document_type not null,
  storage_path text not null,
  file_name text,
  uploaded_at timestamptz default now()
);

-- INSPECTION ITEMS
create table inspection_items (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade,
  category text not null,
  label text not null,
  status text not null,
  note text
);

-- AUCTIONS
create table auctions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid unique references vehicles(id) on delete cascade,
  status auction_status default 'scheduled',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  current_price int not null,
  bid_count int default 0,
  winner_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- BIDS
create table bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid references auctions(id) on delete cascade,
  bidder_id uuid references profiles(id) on delete cascade,
  amount int not null,
  status bid_status default 'active',
  placed_at timestamptz default now()
);

-- WATCHLIST
create table watchlist (
  user_id uuid references profiles(id) on delete cascade,
  auction_id uuid references auctions(id) on delete cascade,
  added_at timestamptz default now(),
  primary key (user_id, auction_id)
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS POLICIES
alter table profiles enable row level security;
alter table kyc_documents enable row level security;
alter table vehicles enable row level security;
alter table vehicle_photos enable row level security;
alter table vehicle_documents enable row level security;
alter table auctions enable row level security;
alter table bids enable row level security;
alter table watchlist enable row level security;
alter table notifications enable row level security;

create policy "users_own_profile" on profiles for all using (auth.uid() = id);
create policy "admin_all_profiles" on profiles for all using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

create policy "public_active_vehicles" on vehicles for select using (status = 'active');
create policy "seller_own_vehicles" on vehicles for all using (auth.uid() = seller_id);

create policy "public_read_auctions" on auctions for select using (true);

create policy "bidder_own_bids" on bids for all using (auth.uid() = bidder_id);
create policy "public_read_bids" on bids for select using (true);

create policy "own_watchlist" on watchlist for all using (auth.uid() = user_id);

create policy "own_notifications" on notifications for all using (auth.uid() = user_id);

-- FUNCTIONS
create or replace function update_auction_price()
returns trigger as $$
begin
  update auctions set current_price = NEW.amount, bid_count = bid_count + 1 where id = NEW.auction_id;
  update bids set status = 'outbid' where auction_id = NEW.auction_id and id != NEW.id and status = 'active';
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_new_bid
  after insert on bids
  for each row execute function update_auction_price();
