-- ============================================================
-- Migration: 007_modify_existing.sql
-- Add wallet/commission columns to existing tables
-- ============================================================

-- 1. Profiles: commission rate + wallet reference
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS commission_rate decimal(5,4) NOT NULL DEFAULT 0.02,
  ADD COLUMN IF NOT EXISTS wallet_id uuid REFERENCES wallets(id) ON DELETE SET NULL;

-- 2. Bids: wallet verification timestamp
ALTER TABLE bids
  ADD COLUMN IF NOT EXISTS wallet_verified_at timestamptz;

-- 3. Auctions: commission tracking + seller release tracking
ALTER TABLE auctions
  ADD COLUMN IF NOT EXISTS commission_amount int,
  ADD COLUMN IF NOT EXISTS commission_paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS seller_coordinates_released_at timestamptz,
  ADD COLUMN IF NOT EXISTS buyer_winner_notified_at timestamptz;

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bids_wallet_verified ON bids(wallet_verified_at);
CREATE INDEX IF NOT EXISTS idx_auctions_commission ON auctions(commission_amount);
CREATE INDEX IF NOT EXISTS idx_auctions_commission_paid ON auctions(commission_paid_at);
CREATE INDEX IF NOT EXISTS idx_profiles_wallet ON profiles(wallet_id);
