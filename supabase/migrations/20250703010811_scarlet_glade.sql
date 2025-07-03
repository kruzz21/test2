/*
  # Fix Reviews Table Permissions

  1. Security Updates
    - Grant INSERT permission to anon role on reviews table
    - This allows anonymous users to submit reviews (which will be pending approval)
    - Maintains existing RLS policies for security

  2. Changes
    - Add INSERT permission for anon role on public.reviews table
    - Verify the permission was granted successfully

  This migration fixes the "new row violates row-level security policy" error
  that occurs when anonymous users try to submit reviews.
*/

-- Grant INSERT permission to anon role on reviews table
-- This allows anonymous users to submit reviews for approval
GRANT INSERT ON public.reviews TO anon;

-- Also ensure SELECT permission exists for reading approved reviews
GRANT SELECT ON public.reviews TO anon;

-- Grant full permissions to authenticated users (admin)
GRANT ALL ON public.reviews TO authenticated;

-- Verify the permissions were granted successfully
DO $$
BEGIN
  -- Check if anon role has INSERT permission on reviews table
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND grantee = 'anon' 
    AND privilege_type = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Failed to grant INSERT permission to anon role on reviews table';
  END IF;
  
  -- Check if anon role has SELECT permission on reviews table
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND grantee = 'anon' 
    AND privilege_type = 'SELECT'
  ) THEN
    RAISE EXCEPTION 'Failed to grant SELECT permission to anon role on reviews table';
  END IF;
  
  RAISE NOTICE 'SUCCESS: anon role now has INSERT and SELECT permissions on reviews table';
  RAISE NOTICE 'Anonymous users can now submit reviews for approval';
  RAISE NOTICE 'Existing RLS policies will ensure only approved reviews are publicly visible';
END $$;

-- Show current permissions for verification
DO $$
DECLARE
    perm_record RECORD;
BEGIN
    RAISE NOTICE 'Current permissions on reviews table:';
    FOR perm_record IN 
        SELECT grantee, privilege_type 
        FROM information_schema.table_privileges 
        WHERE table_schema = 'public' 
        AND table_name = 'reviews' 
        ORDER BY grantee, privilege_type
    LOOP
        RAISE NOTICE 'Role: % | Permission: %', perm_record.grantee, perm_record.privilege_type;
    END LOOP;
END $$;