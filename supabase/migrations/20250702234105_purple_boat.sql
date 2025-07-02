/*
  # Add INSERT policy for FAQs table

  1. Security Updates
    - Add RLS policy to allow INSERT operations on faqs table for both anon and authenticated users
    - This enables the admin panel to create FAQ entries when answering submissions
    - Maintains existing SELECT policy for reading approved FAQs

  2. Changes
    - Create new INSERT policy that allows both anon and authenticated users to insert FAQs
    - This resolves the RLS policy violation when admins answer FAQ submissions
*/

-- Add INSERT policy for faqs table to allow admin operations
CREATE POLICY "faqs_allow_insert"
  ON public.faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify the policy was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faqs' 
    AND policyname = 'faqs_allow_insert'
    AND cmd = 'INSERT'
  ) THEN
    RAISE NOTICE 'SUCCESS: INSERT policy created for faqs table';
    RAISE NOTICE 'Admin panel can now create FAQ entries when answering submissions';
  ELSE
    RAISE EXCEPTION 'Failed to create INSERT policy for faqs table';
  END IF;
END $$;