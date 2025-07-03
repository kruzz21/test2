/*
  # Enhance Reviews System with Multilingual Support

  1. Schema Updates
    - Add multilingual fields for review messages
    - Add doctor reply fields for all languages
    - Keep existing fields for backward compatibility
    - Add indexes for performance

  2. Security
    - Maintain existing RLS policies
    - Ensure admin can manage all review fields

  3. Migration Strategy
    - Add new columns without breaking existing data
    - Copy existing data to new multilingual fields
    - Maintain backward compatibility
*/

-- Add new multilingual columns to reviews table
DO $$
BEGIN
  -- Add message fields for all languages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'message_tr'
  ) THEN
    ALTER TABLE reviews ADD COLUMN message_tr text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'message_az'
  ) THEN
    ALTER TABLE reviews ADD COLUMN message_az text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'message_en'
  ) THEN
    ALTER TABLE reviews ADD COLUMN message_en text;
  END IF;
  
  -- Add doctor reply fields for all languages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'doctor_reply_tr'
  ) THEN
    ALTER TABLE reviews ADD COLUMN doctor_reply_tr text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'doctor_reply_az'
  ) THEN
    ALTER TABLE reviews ADD COLUMN doctor_reply_az text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'doctor_reply_en'
  ) THEN
    ALTER TABLE reviews ADD COLUMN doctor_reply_en text;
  END IF;
  
  -- Add name fields for all languages
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'name_tr'
  ) THEN
    ALTER TABLE reviews ADD COLUMN name_tr text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'name_az'
  ) THEN
    ALTER TABLE reviews ADD COLUMN name_az text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'name_en'
  ) THEN
    ALTER TABLE reviews ADD COLUMN name_en text;
  END IF;
END $$;

-- Migrate existing data to new multilingual fields
UPDATE reviews 
SET 
  message_tr = message,
  message_az = message,
  message_en = message,
  name_tr = name,
  name_az = name,
  name_en = name,
  doctor_reply_tr = doctor_reply,
  doctor_reply_az = doctor_reply,
  doctor_reply_en = doctor_reply
WHERE message_tr IS NULL OR message_az IS NULL OR message_en IS NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reviews_approved_rating ON reviews(approved, rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Verify the migration
DO $$
DECLARE
    column_count INTEGER;
BEGIN
    -- Count new multilingual columns
    SELECT COUNT(*) INTO column_count
    FROM information_schema.columns 
    WHERE table_name = 'reviews' 
    AND column_name IN ('message_tr', 'message_az', 'message_en', 'doctor_reply_tr', 'doctor_reply_az', 'doctor_reply_en', 'name_tr', 'name_az', 'name_en');
    
    IF column_count < 9 THEN
        RAISE EXCEPTION 'Not all multilingual columns were created. Expected 9, got %', column_count;
    END IF;
    
    RAISE NOTICE 'SUCCESS: Reviews table enhanced with multilingual support';
    RAISE NOTICE 'New columns added: message_tr/az/en, doctor_reply_tr/az/en, name_tr/az/en';
    RAISE NOTICE 'Existing data migrated to new multilingual fields';
    RAISE NOTICE 'Backward compatibility maintained with existing message/name/doctor_reply fields';
END $$;