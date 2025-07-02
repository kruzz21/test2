/*
  # Fix FAQ RLS Policy for Question Submissions

  1. Security Updates
    - Drop and recreate the FAQ submission policy to ensure proper INSERT permissions
    - Allow anonymous and authenticated users to submit questions with specific conditions
    - Ensure the policy allows setting approved=false and is_preset=false for new submissions

  2. Changes
    - Update the INSERT policy to explicitly allow question submissions
    - Ensure all required fields can be set during insertion
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "allow_faq_submissions" ON faqs;

-- Create a new INSERT policy that explicitly allows question submissions
CREATE POLICY "allow_faq_submissions" 
  ON faqs 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (
    -- Allow insertion of questions with these conditions:
    -- 1. Must have question text in at least one language
    -- 2. Can set approved to false (default for new submissions)
    -- 3. Can set is_preset to false (default for user submissions)
    (question_tr IS NOT NULL OR question_az IS NOT NULL OR question_en IS NOT NULL)
    AND (approved IS NULL OR approved = false)
    AND (is_preset IS NULL OR is_preset = false)
  );

-- Also ensure the admin policy allows full access
DROP POLICY IF EXISTS "allow_admin_full_access" ON faqs;

CREATE POLICY "allow_admin_full_access"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);