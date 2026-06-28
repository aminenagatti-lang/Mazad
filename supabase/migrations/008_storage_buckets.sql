-- Migration: 008_storage_buckets.sql
-- Create storage buckets and policies for vehicle photos and KYC documents

-- Vehicle photos bucket (public read, authenticated write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vehicle-photos',
  'vehicle-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- KYC documents bucket (private, authenticated read/write)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'kyc-documents',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Policies for vehicle-photos
CREATE POLICY "Public read vehicle photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'vehicle-photos');

CREATE POLICY "Authenticated upload vehicle photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Owner delete vehicle photos"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'vehicle-photos'
    AND auth.uid() = owner
  );

-- Policies for kyc-documents
CREATE POLICY "Owner read kyc documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid() = owner
  );

CREATE POLICY "Owner upload kyc documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Owner delete kyc documents"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid() = owner
  );

CREATE POLICY "Admin read all kyc documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'kyc-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
