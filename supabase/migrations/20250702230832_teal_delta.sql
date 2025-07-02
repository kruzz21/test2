/*
  # Fix FAQ submissions table permissions

  1. Security Updates
    - Drop existing conflicting policies on `faq_submissions` table
    - Create clear, non-overlapping policies for different operations
    - Ensure authenticated users (admins) can update FAQ submissions
    - Maintain public access for creating and reading submissions

  2. Policy Changes
    - Allow anonymous and authenticated users to insert FAQ submissions
    - Allow anonymous and authenticated users to select FAQ submissions
    - Allow authenticated users (admins) to update and delete FAQ submissions
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "faq_submissions_admin_policy" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_insert_policy" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_select_policy" ON faq_submissions;

-- Create new clear policies
CREATE POLICY "faq_submissions_public_insert"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "faq_submissions_public_select"
  ON faq_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "faq_submissions_admin_update"
  ON faq_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "faq_submissions_admin_delete"
  ON faq_submissions
  FOR DELETE
  TO authenticated
  USING (true);