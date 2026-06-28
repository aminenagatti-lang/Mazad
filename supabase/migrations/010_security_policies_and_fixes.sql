-- ============================================================
-- Migration: 010_security_policies_and_fixes.sql
-- Missing RLS policies, security hardening
-- ============================================================

-- 1. vehicle_documents: public read for active vehicle documents
CREATE POLICY IF NOT EXISTS "public_read_vehicle_documents"
  ON vehicle_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_documents.vehicle_id
      AND v.status = 'active'
    )
  );

-- 2. vehicle_photos: public read for active vehicle photos
CREATE POLICY IF NOT EXISTS "public_read_vehicle_photos"
  ON vehicle_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = vehicle_photos.vehicle_id
      AND v.status = 'active'
    )
  );

-- 3. inspection_items: public read for active vehicle inspections
CREATE POLICY IF NOT EXISTS "public_read_inspection_items"
  ON inspection_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles v
      WHERE v.id = inspection_items.vehicle_id
      AND v.status = 'active'
    )
  );

-- 4. wallets: user sees own (already exists in 006, but ensure it covers all)
-- Already covered by "own_wallet" policy

-- 5. Add updated_at trigger for vehicles if missing
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON vehicles;
CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
