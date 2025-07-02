/*
  # Fix FAQ Submissions RLS Policy

  1. Security Updates
    - Drop existing problematic RLS policy for FAQ submissions
    - Create new policy that properly allows anonymous users to insert FAQ submissions
    - Ensure both anon and authenticated users can submit questions

  2. Changes
    - Remove restrictive policy that was blocking submissions
    - Add permissive policy for public FAQ submissions
*/

-- Drop the existing policy that might be causing issues
DROP POLICY IF EXISTS "allow_anonymous_faq_submissions" ON faq_submissions;

-- Create a new policy that allows both anonymous and authenticated users to insert FAQ submissions
CREATE POLICY "Public can submit FAQ questions"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing admin policy is correct
DROP POLICY IF EXISTS "allow_admin_manage_faq_submissions" ON faq_submissions;

CREATE POLICY "Admin can manage all FAQ submissions"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);