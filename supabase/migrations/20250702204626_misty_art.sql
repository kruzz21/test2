/*
  # Fix FAQ Insert Policy for Anonymous Users

  1. Security Changes
    - Drop existing restrictive INSERT policy for FAQs
    - Create new policy allowing anonymous users to submit FAQ questions
    - Ensure submitted questions are marked as unapproved by default
    - Maintain existing policies for reading approved FAQs and admin management

  2. Policy Details
    - Anonymous users can INSERT new FAQ questions
    - New questions default to approved = false for moderation
    - Authenticated users (admins) retain full management access
    - Public can still read only approved FAQs
*/

-- Drop the existing INSERT policy that might be too restrictive
DROP POLICY IF EXISTS "Public can submit FAQ questions" ON faqs;

-- Create a new INSERT policy that explicitly allows anonymous users to submit questions
CREATE POLICY "Allow anonymous FAQ submissions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure new submissions are not pre-approved
    approved = false AND
    -- Ensure it's not marked as a preset question
    is_preset = false
  );

-- Ensure the existing SELECT policy for approved FAQs is correct
DROP POLICY IF EXISTS "Public can read approved FAQs" ON faqs;
CREATE POLICY "Public can read approved FAQs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Ensure admin policy exists for full management
DROP POLICY IF EXISTS "Admin can manage all FAQs" ON faqs;
CREATE POLICY "Admin can manage all FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);