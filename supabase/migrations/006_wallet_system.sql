-- ============================================================
-- Migration: 006_wallet_system.sql
-- Wallet, transactions, commission payments, seller releases
-- ============================================================

-- 1. Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'forfeited')),
  deposit_verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_wallet_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_wallets_user ON wallets(user_id);

-- 2. Wallet transactions (audit complet)
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'refund', 'reserve', 'commission', 'forfeit', 'release')),
  amount int NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('konnect', 'flouci', 'virement')),
  external_ref text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  proof_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON wallet_transactions(status);

-- 3. Commission payments (liée à une enchère gagnée)
CREATE TABLE IF NOT EXISTS commission_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_commission int NOT NULL,
  caution_credit int NOT NULL DEFAULT 200,
  remaining_amount int NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'forfeited')),
  paid_at timestamptz,
  forfeited_at timestamptz,
  due_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commission_payments_auction ON commission_payments(auction_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_user ON commission_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_commission_payments_status ON commission_payments(status);

-- 4. Seller releases (déblocage coordonnées)
CREATE TABLE IF NOT EXISTS seller_releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL UNIQUE REFERENCES auctions(id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  commission_payment_id uuid REFERENCES commission_payments(id) ON DELETE SET NULL,
  coordinates_released_at timestamptz,
  proof_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_seller_releases_auction ON seller_releases(auction_id);
CREATE INDEX IF NOT EXISTS idx_seller_releases_seller ON seller_releases(seller_id);

-- 5. Payment methods (moyens de paiement enregistrés)
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('konnect', 'flouci', 'virement')),
  provider_ref text,
  rib text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON payment_methods(user_id);

-- RLS Policies
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Wallets: user sees own, admin sees all
CREATE POLICY "own_wallet" ON wallets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_wallet" ON wallets FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Transactions: user sees own wallet's transactions
CREATE POLICY "own_wallet_transactions" ON wallet_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM wallets w WHERE w.id = wallet_transactions.wallet_id AND w.user_id = auth.uid())
);
CREATE POLICY "admin_wallet_transactions" ON wallet_transactions FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Commission payments: user sees own
CREATE POLICY "own_commission" ON commission_payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_commission" ON commission_payments FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Seller releases: seller or buyer sees theirs
CREATE POLICY "involved_seller_release" ON seller_releases FOR ALL USING (auth.uid() = seller_id OR auth.uid() = buyer_id);
CREATE POLICY "admin_seller_release" ON seller_releases FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payment methods: user manages own
CREATE POLICY "own_payment_method" ON payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "admin_payment_method" ON payment_methods FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
