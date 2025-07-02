/*
  # Fix FAQ Insert Policy

  1. Security Updates
    - Drop existing INSERT policy for FAQs
    - Create new INSERT policy that allows anonymous users to submit questions
    - Ensure all required fields have proper defaults or are handled correctly

  2. Policy Changes
    - Allow anonymous users to insert FAQ questions
    - Ensure the policy works with the current data structure
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Public can submit questions" ON faqs;

-- Create a new INSERT policy that allows anonymous users to submit questions
CREATE POLICY "Allow anonymous FAQ submissions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the table structure supports the expected data
-- Add any missing constraints or defaults if needed
DO $$
BEGIN
  -- Ensure answer fields can be null for new submissions
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer_tr' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE faqs ALTER COLUMN answer_tr DROP NOT NULL;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer_az' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE faqs ALTER COLUMN answer_az DROP NOT NULL;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faqs' AND column_name = 'answer_en' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE faqs ALTER COLUMN answer_en DROP NOT NULL;
  END IF;
END $$;