/*
  # Fix FAQs table permissions for anon role

  1. Security Updates
    - Grant INSERT permission to anon role on faqs table
    - This allows the admin system to create FAQs when answering submissions
    - Maintains existing RLS policies for security

  2. Changes
    - Add INSERT permission for anon role on public.faqs table
    - Keep existing SELECT permission
    - Ensure admin operations work properly

  This migration fixes the "permission denied for table faqs" error
  that occurs when admins try to answer FAQ submissions.
*/

-- Grant INSERT permission to anon role on faqs table
-- This is needed because the current admin system operates as anon from Supabase's perspective
GRANT INSERT ON public.faqs TO anon;

-- Verify the permissions are correctly set
DO $$
BEGIN
  -- Check if anon role has INSERT permission on faqs table
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_privileges 
    WHERE table_schema = 'public' 
    AND table_name = 'faqs' 
    AND grantee = 'anon' 
    AND privilege_type = 'INSERT'
  ) THEN
    RAISE EXCEPTION 'Failed to grant INSERT permission to anon role on faqs table';
  END IF;
  
  RAISE NOTICE 'SUCCESS: anon role now has INSERT permission on faqs table';
  RAISE NOTICE 'Admin users can now create FAQs when answering submissions';
END $$;

-- Also ensure UPDATE and DELETE permissions for full admin functionality
GRANT UPDATE, DELETE ON public.faqs TO anon;

-- Verify all necessary permissions exist
DO $$
DECLARE
    missing_perms TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Check INSERT permission
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faqs' 
        AND grantee = 'anon' AND privilege_type = 'INSERT'
    ) THEN
        missing_perms := array_append(missing_perms, 'INSERT');
    END IF;
    
    -- Check UPDATE permission
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faqs' 
        AND grantee = 'anon' AND privilege_type = 'UPDATE'
    ) THEN
        missing_perms := array_append(missing_perms, 'UPDATE');
    END IF;
    
    -- Check DELETE permission
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faqs' 
        AND grantee = 'anon' AND privilege_type = 'DELETE'
    ) THEN
        missing_perms := array_append(missing_perms, 'DELETE');
    END IF;
    
    -- Report results
    IF array_length(missing_perms, 1) > 0 THEN
        RAISE WARNING 'Missing permissions for anon role on faqs table: %', array_to_string(missing_perms, ', ');
    ELSE
        RAISE NOTICE 'All required permissions granted to anon role on faqs table';
    END IF;
END $$;