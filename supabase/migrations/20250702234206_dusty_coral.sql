/*
  # Fix FAQ Submissions Delete Policy

  1. Security Updates
    - Add DELETE policy for faq_submissions table to allow admin operations
    - Grant DELETE permission to authenticated users (admins)
    - This allows the admin panel to remove FAQ submissions after answering them

  2. Changes
    - Add DELETE policy for authenticated users on faq_submissions table
    - Grant DELETE permission to authenticated role
    - Ensure the workflow can complete: answer FAQ → delete submission

  This fixes the "permission denied for table faq_submissions" error when trying to delete
  processed FAQ submissions after answering them.
*/

-- Add DELETE policy for faq_submissions table
CREATE POLICY "faq_submissions_allow_delete"
  ON public.faq_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Grant DELETE permission to authenticated users (admins)
GRANT DELETE ON public.faq_submissions TO authenticated;

-- Verify the policy and permissions were created successfully
DO $$
BEGIN
  -- Check if DELETE policy exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faq_submissions' 
    AND policyname = 'faq_submissions_allow_delete'
    AND cmd = 'DELETE'
  ) THEN
    RAISE NOTICE 'SUCCESS: DELETE policy created for faq_submissions table';
  ELSE
    RAISE EXCEPTION 'Failed to create DELETE policy for faq_submissions table';
  END IF;

  -- Check if DELETE permission is granted
  IF EXISTS (
    SELECT 1 FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'faq_submissions' 
    AND grantee = 'authenticated' 
    AND privilege_type = 'DELETE'
  ) THEN
    RAISE NOTICE 'SUCCESS: DELETE permission granted to authenticated users';
    RAISE NOTICE 'Admin panel can now delete FAQ submissions after answering them';
  ELSE
    RAISE EXCEPTION 'Failed to grant DELETE permission to authenticated users';
  END IF;
END $$;