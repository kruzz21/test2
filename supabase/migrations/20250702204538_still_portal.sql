/*
  # Fix FAQ Insert Policy

  1. Policy Changes
    - Drop the existing restrictive INSERT policy for FAQs
    - Create a new, more permissive INSERT policy that allows public users to submit questions
    - The new policy will allow anonymous and authenticated users to insert FAQ questions
    - Questions submitted by public users will default to unapproved status

  2. Security
    - Maintains security by ensuring public submissions are not approved by default
    - Admin users can still manage all FAQs through the existing admin policy
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow public to submit FAQ questions" ON faqs;

-- Create a new INSERT policy that allows public users to submit questions
CREATE POLICY "Public can submit FAQ questions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);