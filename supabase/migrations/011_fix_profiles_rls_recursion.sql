-- ============================================================
-- Migration: 011_fix_profiles_rls_recursion.sql
-- Fix infinite recursion in profiles RLS policy
-- ============================================================

-- The admin_all_profiles policy queries the profiles table itself,
-- which triggers RLS again -> infinite recursion.
-- Fix: use a security definer function that bypasses RLS.

CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the recursive policy and recreate using the function
DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;

CREATE POLICY "admin_all_profiles"
  ON profiles FOR ALL
  USING (is_admin(auth.uid()));
