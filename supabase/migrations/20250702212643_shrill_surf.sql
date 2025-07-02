/*
  # Fix FAQ submissions RLS policy

  1. Security Changes
    - Update the INSERT policy for `faq_submissions` table to allow both anonymous and authenticated users
    - This allows visitors to submit FAQ questions without requiring authentication

  2. Changes Made
    - Modified the existing INSERT policy to include both 'anon' and 'authenticated' roles
    - Ensures the form on the FAQ page works for all users
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Public can submit FAQ questions" ON faq_submissions;

-- Create a new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Anyone can submit FAQ questions"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);