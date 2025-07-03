/*
  # Gallery System Enhancements

  1. New Columns
    - Add multilingual alt text fields (alt_text_tr, alt_text_az, alt_text_en)
    - Add multilingual categories fields (categories_tr, categories_az, categories_en)
    - Add display_order field for sorting
  
  2. Sample Data
    - Update existing gallery items with new field values
    - Add comprehensive sample data for testing
*/

-- Add new columns to gallery_items table
DO $$
BEGIN
  -- Add alt text columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'alt_text_tr'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN alt_text_tr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'alt_text_az'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN alt_text_az text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'alt_text_en'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN alt_text_en text;
  END IF;

  -- Add categories columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'categories_tr'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN categories_tr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'categories_az'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN categories_az text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'categories_en'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN categories_en text;
  END IF;

  -- Add display order column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_items' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE gallery_items ADD COLUMN display_order integer DEFAULT 0;
  END IF;
END $$;

-- Create index for display_order for better sorting performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_display_order ON gallery_items (display_order);

-- Clear existing sample data and insert comprehensive sample data
DELETE FROM gallery_items;

INSERT INTO gallery_items (
  type, url, thumbnail_url, 
  title_tr, title_az, title_en,
  description_tr, description_az, description_en,
  alt_text_tr, alt_text_az, alt_text_en,
  categories_tr, categories_az, categories_en,
  published, display_order
) VALUES 
(
  'photo',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Ameliyathane - Diz Cerrahisi',
  'Əməliyyatxana - Diz Cərrahiyyəsi',
  'Operating Room - Knee Surgery',
  'Modern ameliyathanede diz cerrahisi prosedürü',
  'Müasir əməliyyatxanada diz cərrahiyyəsi proseduru',
  'Knee surgery procedure in modern operating room',
  'Ameliyathanede diz cerrahisi yapılırken',
  'Əməliyyatxanada diz cərrahiyyəsi zamanı',
  'Knee surgery being performed in operating room',
  'cerrahi, diz, ameliyat',
  'cərrahi, diz, əməliyyat',
  'surgery, knee, operation',
  true,
  1
),
(
  'photo',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Cerrahi Ekipmanlar',
  'Cərrahi Avadanlıqlar',
  'Surgical Equipment',
  'Ortopedik cerrahi için kullanılan modern ekipmanlar',
  'Ortopedik cərrahi üçün istifadə olunan müasir avadanlıqlar',
  'Modern equipment used for orthopedic surgery',
  'Cerrahi ekipmanları görünümü',
  'Cərrahi avadanlıqlarının görünüşü',
  'View of surgical equipment',
  'ekipman, cerrahi, teknoloji',
  'avadanlıq, cərrahi, texnologiya',
  'equipment, surgery, technology',
  true,
  2
),
(
  'photo',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Dr. Eryanılmaz Hasta Konsültasyonu',
  'Dr. Eryanılmaz Xəstə Məsləhəti',
  'Dr. Eryanılmaz Patient Consultation',
  'Dr. Gürkan Eryanılmaz hasta ile konsültasyon yaparken',
  'Dr. Gürkan Eryanılmaz xəstə ilə məsləhət zamanı',
  'Dr. Gürkan Eryanılmaz during patient consultation',
  'Doktor hasta konsültasyonu',
  'Həkim xəstə məsləhəti',
  'Doctor patient consultation',
  'konsültasyon, hasta, muayene',
  'məsləhət, xəstə, müayinə',
  'consultation, patient, examination',
  true,
  3
),
(
  'photo',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Pediatrik Konsültasyon',
  'Pediatrik Məsləhət',
  'Pediatric Consultation',
  'Çocuk hastalar için özel konsültasyon hizmeti',
  'Uşaq xəstələr üçün xüsusi məsləhət xidməti',
  'Specialized consultation service for pediatric patients',
  'Çocuk hasta muayenesi',
  'Uşaq xəstə müayinəsi',
  'Pediatric patient examination',
  'pediatrik, çocuk, konsültasyon',
  'pediatrik, uşaq, məsləhət',
  'pediatric, children, consultation',
  true,
  4
),
(
  'photo',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Spor Hekimliği Kliniği',
  'İdman Təbabəti Klinikası',
  'Sports Medicine Clinic',
  'Spor yaralanmaları ve rehabilitasyon merkezi',
  'İdman zədələri və reabilitasiya mərkəzi',
  'Sports injuries and rehabilitation center',
  'Spor hekimliği kliniği görünümü',
  'İdman təbabəti klinikasının görünüşü',
  'Sports medicine clinic view',
  'spor, rehabilitasyon, fizik tedavi',
  'idman, reabilitasiya, fiziki müalicə',
  'sports, rehabilitation, physical therapy',
  true,
  5
),
(
  'video',
  'https://example.com/videos/dr-introduction.mp4',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Dr. Gürkan Eryanılmaz Tanıtım Videosu',
  'Dr. Gürkan Eryanılmaz Tanıtım Videosu',
  'Dr. Gürkan Eryanılmaz Introduction Video',
  'Dr. Eryanılmaz\'dan kişisel tanıtım ve deneyim paylaşımı',
  'Dr. Eryanılmaz\'dan şəxsi tanıtım və təcrübə paylaşımı',
  'Personal introduction and experience sharing from Dr. Eryanılmaz',
  'Doktor tanıtım videosu',
  'Həkim tanıtım videosu',
  'Doctor introduction video',
  'tanıtım, video, doktor',
  'tanıtım, video, həkim',
  'introduction, video, doctor',
  true,
  6
),
(
  'video',
  'https://example.com/videos/knee-replacement-overview.mp4',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Diz Protezi Ameliyatı Genel Bakış',
  'Diz Protezi Əməliyyatı Ümumi Baxış',
  'Knee Replacement Surgery Overview',
  'Diz protezi ameliyatı hakkında eğitici video',
  'Diz protezi əməliyyatı haqqında təlim videosu',
  'Educational video about knee replacement procedures',
  'Diz protezi ameliyatı eğitim videosu',
  'Diz protezi əməliyyatı təlim videosu',
  'Knee replacement surgery educational video',
  'diz protezi, ameliyat, eğitim',
  'diz protezi, əməliyyat, təlim',
  'knee replacement, surgery, education',
  true,
  7
),
(
  'video',
  'https://example.com/videos/post-surgery-rehabilitation.mp4',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  'Ameliyat Sonrası Rehabilitasyon',
  'Əməliyyatdan Sonra Reabilitasiya',
  'Post-Surgery Rehabilitation',
  'Ameliyat sonrası bakım ve rehabilitasyon rehberi',
  'Əməliyyatdan sonra baxım və reabilitasiya bələdçisi',
  'Guidelines for post-operative care and rehabilitation',
  'Rehabilitasyon egzersizleri videosu',
  'Reabilitasiya məşqləri videosu',
  'Rehabilitation exercises video',
  'rehabilitasyon, egzersiz, iyileşme',
  'reabilitasiya, məşq, sağalma',
  'rehabilitation, exercise, recovery',
  true,
  8
);