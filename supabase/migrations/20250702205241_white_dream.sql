/*
  # Fix FAQ RLS Policy for Anonymous Submissions

  1. Security Updates
    - Update the FAQ insertion policy to properly handle nullable answer fields
    - Ensure anonymous users can submit questions without providing answers
    - Maintain security by ensuring only unapproved, non-preset FAQs can be created by anonymous users

  2. Changes
    - Modify the existing INSERT policy to handle the case where answer fields are NULL
    - This allows the frontend to submit questions without answer fields, which will be filled by admins later
*/

-- Drop the existing policy and recreate it with proper NULL handling
DROP POLICY IF EXISTS "Allow anonymous FAQ submissions" ON faqs;

CREATE POLICY "Allow anonymous FAQ submissions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    approved = false 
    AND is_preset = false 
    AND (answer_tr IS NULL OR answer_tr = '')
    AND (answer_az IS NULL OR answer_az = '')
    AND (answer_en IS NULL OR answer_en = '')
  );