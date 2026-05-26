-- Migration: 005_fixes.sql
-- Fixes for schema mismatches, missing RLS policies, and missing indexes

-- 1. Add ending_soon_notified column to auctions (used by check-ending-auctions Edge Function)
ALTER TABLE auctions
ADD COLUMN IF NOT EXISTS ending_soon_notified boolean DEFAULT false;

-- 2. RLS policies for kyc_documents
CREATE POLICY "users_own_kyc_docs"
  ON kyc_documents
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Add WITH CHECK to existing policies that only had USING
-- profiles
CREATE POLICY "users_own_profile_insert"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- bids
CREATE POLICY "bidder_own_bids_insert"
  ON bids
  FOR INSERT
  WITH CHECK (auth.uid() = bidder_id);

-- watchlist
CREATE POLICY "own_watchlist_insert"
  ON watchlist
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- notifications
CREATE POLICY "own_notifications_insert"
  ON notifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- vehicles (seller can insert their own)
CREATE POLICY "seller_own_vehicles_insert"
  ON vehicles
  FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

-- 4. Missing indexes on foreign key columns
CREATE INDEX IF NOT EXISTS idx_vehicles_seller ON vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_auctions_vehicle ON auctions(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_auctions_winner ON auctions(winner_id);
CREATE INDEX IF NOT EXISTS idx_bids_auction ON bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_docs_user ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle ON vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle ON vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inspection_items_vehicle ON inspection_items(vehicle_id);
