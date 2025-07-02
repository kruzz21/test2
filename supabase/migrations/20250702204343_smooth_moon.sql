/*
  # Fix FAQ Insert Policy

  1. Security Updates
    - Drop existing INSERT policy for FAQs that may be causing conflicts
    - Create new INSERT policy that explicitly allows anonymous users to create FAQ questions
    - Ensure the policy allows inserts without additional restrictions

  2. Changes
    - Remove potentially conflicting INSERT policy
    - Add clear INSERT policy for anonymous and authenticated users
*/

-- Drop the existing INSERT policy that might be causing issues
DROP POLICY IF EXISTS "Public can create FAQ questions" ON faqs;

-- Create a new INSERT policy that explicitly allows public FAQ creation
CREATE POLICY "Allow public to create FAQ questions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);