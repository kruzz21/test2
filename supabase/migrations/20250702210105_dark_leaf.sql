/*
  # Fix FAQ Insert Policy

  1. Security Changes
    - Drop existing insert policy for FAQs that may be misconfigured
    - Create new insert policy that properly allows public question submission
    - Ensure the policy allows both anonymous and authenticated users to create FAQ questions
    - Set proper WITH CHECK condition to allow inserts

  2. Policy Details
    - Policy name: "Allow public to submit FAQ questions"
    - Target roles: anon, authenticated
    - Operation: INSERT
    - WITH CHECK: true (allows all inserts for question submission)
*/

-- Drop the existing insert policy if it exists
DROP POLICY IF EXISTS "Public can create FAQ questions" ON faqs;

-- Create a new insert policy that properly allows public question submission
CREATE POLICY "Allow public to submit FAQ questions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing select policy is still in place
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faqs' 
    AND policyname = 'Public can read approved FAQs'
  ) THEN
    CREATE POLICY "Public can read approved FAQs"
      ON faqs
      FOR SELECT
      TO anon, authenticated
      USING (approved = true);
  END IF;
END $$;

-- Ensure the admin policy is still in place
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faqs' 
    AND policyname = 'Admin can manage all FAQs'
  ) THEN
    CREATE POLICY "Admin can manage all FAQs"
      ON faqs
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;