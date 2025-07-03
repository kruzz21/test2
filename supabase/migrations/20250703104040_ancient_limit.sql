/*
  # Create Gallery Items Table

  1. New Table
    - `gallery_items` - Store photos and videos for the gallery
      - `id` (uuid, primary key)
      - `type` (text, NOT NULL) - 'photo' or 'video'
      - `url` (text, NOT NULL) - URL to the image/video
      - `thumbnail_url` (text, nullable) - Optional thumbnail for videos
      - `title_tr` (text, NOT NULL) - Turkish title
      - `title_az` (text, NOT NULL) - Azerbaijani title
      - `title_en` (text, NOT NULL) - English title
      - `description_tr` (text, nullable) - Turkish description
      - `description_az` (text, nullable) - Azerbaijani description
      - `description_en` (text, nullable) - English description
      - `published` (boolean, default false) - Whether item is published
      - `created_at` (timestamp with time zone, default now())
      - `updated_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `gallery_items` table
    - Add policies for public read access to published items
    - Add policies for admin management access

  3. Indexes
    - Add performance indexes for common queries
*/

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('photo', 'video')),
  url text NOT NULL,
  thumbnail_url text,
  title_tr text NOT NULL,
  title_az text NOT NULL,
  title_en text NOT NULL,
  description_tr text,
  description_az text,
  description_en text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery_items
CREATE POLICY "gallery_items_public_read"
  ON gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (
    published = true 
    OR (
      jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
      AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    )
  );

CREATE POLICY "gallery_items_admin_access"
  ON gallery_items
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Grant necessary permissions
GRANT SELECT ON public.gallery_items TO anon;
GRANT ALL ON public.gallery_items TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_published ON gallery_items(published);
CREATE INDEX IF NOT EXISTS idx_gallery_items_type ON gallery_items(type);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON gallery_items(created_at);

-- Insert sample gallery items
INSERT INTO gallery_items (
  type, url, thumbnail_url, title_tr, title_az, title_en,
  description_tr, description_az, description_en, published
) VALUES 
(
  'photo',
  'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  null,
  'Modern Ameliyathane',
  'Müasir Əməliyyatxana',
  'Modern Operating Room',
  'Son teknoloji ile donatılmış ameliyathanemiz',
  'Ən son texnologiya ilə təchiz edilmiş əməliyyatxanamız',
  'Our operating room equipped with the latest technology',
  true
),
(
  'photo',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  null,
  'Hasta Muayene Odası',
  'Xəstə Müayinə Otağı',
  'Patient Examination Room',
  'Konforlu ve steril muayene ortamımız',
  'Rahat və steril müayinə mühitimiz',
  'Our comfortable and sterile examination environment',
  true
),
(
  'photo',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  null,
  'Fizik Tedavi Ünitesi',
  'Fiziki Müalicə Bölməsi',
  'Physical Therapy Unit',
  'Rehabilitasyon ve fizik tedavi hizmetlerimiz',
  'Reabilitasiya və fiziki müalicə xidmətlərimiz',
  'Our rehabilitation and physical therapy services',
  true
);

-- Verify the setup
DO $$
DECLARE
    table_exists boolean;
    policy_count integer;
    sample_count integer;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'gallery_items'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE EXCEPTION 'gallery_items table was not created';
    END IF;
    
    -- Check policies exist
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'gallery_items' AND schemaname = 'public';
    
    IF policy_count < 2 THEN
        RAISE EXCEPTION 'Not enough policies created for gallery_items. Expected 2, got %', policy_count;
    END IF;
    
    -- Check sample data
    SELECT COUNT(*) INTO sample_count FROM gallery_items;
    
    RAISE NOTICE 'SUCCESS: Gallery items table created successfully';
    RAISE NOTICE 'Policies created: %', policy_count;
    RAISE NOTICE 'Sample items inserted: %', sample_count;
    RAISE NOTICE 'Admin users can manage all gallery items';
    RAISE NOTICE 'Public users can view published gallery items';
END $$;