/*
  # Fix FAQ Submissions Delete for Anon Role

  1. Security Updates
    - Add DELETE policy for faq_submissions table that allows anon role
    - Grant DELETE permission to anon role on faq_submissions table
    - This is needed because the current admin system operates as anon from Supabase's perspective

  2. Changes
    - Allow anon role to delete FAQ submissions (needed for admin operations)
    - Maintain existing policies for other operations
    - Ensure the admin workflow can complete successfully

  This fixes the "401 Unauthorized" error when trying to delete FAQ submissions after answering them.
*/

-- Drop the existing DELETE policy that only allows authenticated users
DROP POLICY IF EXISTS "faq_submissions_allow_delete" ON faq_submissions;

-- Create a new DELETE policy that allows both anon and authenticated users
CREATE POLICY "faq_submissions_allow_delete_anon"
  ON faq_submissions
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Grant DELETE permission to anon role (needed for current admin system)
GRANT DELETE ON public.faq_submissions TO anon;

-- Verify the policy and permissions were created successfully
DO $$
BEGIN
  -- Check if DELETE policy exists for anon role
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faq_submissions' 
    AND policyname = 'faq_submissions_allow_delete_anon'
    AND cmd = 'DELETE'
  ) THEN
    RAISE NOTICE 'SUCCESS: DELETE policy created for faq_submissions table (anon + authenticated)';
  ELSE
    RAISE EXCEPTION 'Failed to create DELETE policy for faq_submissions table';
  END IF;

  -- Check if DELETE permission is granted to anon role
  IF EXISTS (
    SELECT 1 FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'faq_submissions' 
    AND grantee = 'anon' 
    AND privilege_type = 'DELETE'
  ) THEN
    RAISE NOTICE 'SUCCESS: DELETE permission granted to anon role';
    RAISE NOTICE 'Admin panel can now delete FAQ submissions after answering them';
  ELSE
    RAISE EXCEPTION 'Failed to grant DELETE permission to anon role';
  END IF;

  -- Also verify authenticated role has DELETE permission
  IF EXISTS (
    SELECT 1 FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'faq_submissions' 
    AND grantee = 'authenticated' 
    AND privilege_type = 'DELETE'
  ) THEN
    RAISE NOTICE 'SUCCESS: DELETE permission also available for authenticated role';
  END IF;
END $$;

-- Show current permissions for verification
DO $$
DECLARE
    perm_record RECORD;
BEGIN
    RAISE NOTICE 'Current DELETE permissions on faq_submissions table:';
    FOR perm_record IN 
        SELECT grantee, privilege_type 
        FROM information_schema.table_privileges 
        WHERE table_schema = 'public' 
        AND table_name = 'faq_submissions' 
        AND privilege_type = 'DELETE'
    LOOP
        RAISE NOTICE 'Role: % | Permission: %', perm_record.grantee, perm_record.privilege_type;
    END LOOP;
END $$;