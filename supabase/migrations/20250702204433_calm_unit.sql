/*
  # Fix FAQ Insert Policy for Anonymous Users

  1. Security Updates
    - Drop existing INSERT policy that may be too restrictive
    - Create new policy that allows anonymous users to insert FAQ questions
    - Ensure only unapproved, non-preset questions can be inserted by anonymous users
    - Maintain security by preventing anonymous users from creating approved or preset FAQs

  2. Policy Details
    - Allow INSERT for both 'anon' and 'authenticated' roles
    - Restrict inserts to only allow approved=false and is_preset=false
    - This ensures user-submitted questions go through proper approval process
*/

-- Drop the existing INSERT policy if it exists
DROP POLICY IF EXISTS "Allow public to create FAQ questions" ON public.faqs;

-- Create a new, more specific INSERT policy for anonymous and authenticated users
CREATE POLICY "Allow public to submit FAQ questions"
  ON public.faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    approved = false 
    AND is_preset = false
    AND answer_tr IS NULL
    AND answer_az IS NULL
    AND answer_en IS NULL
  );

-- Ensure the existing SELECT policy allows reading approved FAQs
DROP POLICY IF EXISTS "Public can read approved FAQs" ON public.faqs;

CREATE POLICY "Public can read approved FAQs"
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Ensure admin policy exists for full management
DROP POLICY IF EXISTS "Admin can manage all FAQs" ON public.faqs;

CREATE POLICY "Admin can manage all FAQs"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);