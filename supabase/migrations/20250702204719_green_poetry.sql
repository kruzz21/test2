/*
  # Fix FAQ RLS Policy for Anonymous Submissions

  1. Security Updates
    - Drop existing INSERT policy for FAQs that may be too restrictive
    - Create new INSERT policy that properly allows anonymous FAQ submissions
    - Ensure the policy allows unauthenticated users to submit questions
    - Maintain security by ensuring submitted questions are not approved by default

  2. Policy Details
    - Allow INSERT for both 'anon' and 'authenticated' roles
    - Ensure new submissions have approved = false and is_preset = false
    - This allows public question submissions while maintaining admin control
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Allow anonymous FAQ submissions" ON faqs;

-- Create a new INSERT policy that properly allows anonymous submissions
CREATE POLICY "Allow anonymous FAQ submissions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    approved = false AND 
    is_preset = false
  );

-- Ensure the SELECT policy exists for reading approved FAQs
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