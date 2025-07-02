/*
  # Fix RLS policies for faq_submissions table

  1. Security Updates
    - Clean up all existing RLS policies on faq_submissions table
    - Create clear, distinct policies for different operations
    - Ensure authenticated users (admin) can perform all operations
    - Allow anonymous users to submit questions

  2. Changes
    - Drop all existing policies to avoid conflicts
    - Grant necessary permissions to both anon and authenticated roles
    - Create three distinct policies:
      - INSERT policy for public question submissions
      - SELECT policy for reading submissions
      - ALL policy for admin management (includes UPDATE and DELETE)

  This fixes the "permission denied for table faq_submissions" error when updating submission status.
*/

-- Step 1: Disable RLS temporarily to clean up all policies
ALTER TABLE public.faq_submissions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start completely fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'faq_submissions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.faq_submissions', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 3: Revoke all existing permissions and start fresh
REVOKE ALL ON public.faq_submissions FROM anon;
REVOKE ALL ON public.faq_submissions FROM authenticated;
REVOKE ALL ON public.faq_submissions FROM public;

-- Step 4: Grant necessary permissions
-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant sequence usage for UUID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant table permissions
GRANT INSERT, SELECT ON public.faq_submissions TO anon;
GRANT ALL ON public.faq_submissions TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.faq_submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create clear, distinct RLS policies

-- Policy 1: Allow public to submit FAQ questions
CREATE POLICY "faq_submissions_insert_policy"
  ON public.faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow reading of FAQ submissions
CREATE POLICY "faq_submissions_select_policy"
  ON public.faq_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 3: Allow authenticated users (admin) full management access
CREATE POLICY "faq_submissions_admin_policy"
  ON public.faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 7: Verify the setup
DO $$
DECLARE
    policy_count INTEGER;
    rls_enabled BOOLEAN;
    insert_perm BOOLEAN := false;
    update_perm BOOLEAN := false;
    delete_perm BOOLEAN := false;
BEGIN
    -- Check RLS is enabled
    SELECT c.relrowsecurity INTO rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'faq_submissions';
    
    IF NOT rls_enabled THEN
        RAISE EXCEPTION 'RLS is not enabled on faq_submissions table';
    END IF;
    
    -- Check policies exist
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'faq_submissions' AND schemaname = 'public';
    
    IF policy_count < 3 THEN
        RAISE EXCEPTION 'Not enough policies created. Expected 3, got %', policy_count;
    END IF;
    
    -- Check permissions for authenticated role
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faq_submissions' 
        AND grantee = 'authenticated' AND privilege_type = 'INSERT'
    ) INTO insert_perm;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faq_submissions' 
        AND grantee = 'authenticated' AND privilege_type = 'UPDATE'
    ) INTO update_perm;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.table_privileges 
        WHERE table_schema = 'public' AND table_name = 'faq_submissions' 
        AND grantee = 'authenticated' AND privilege_type = 'DELETE'
    ) INTO delete_perm;
    
    IF NOT (insert_perm AND update_perm AND delete_perm) THEN
        RAISE EXCEPTION 'Missing permissions for authenticated role. INSERT: %, UPDATE: %, DELETE: %', 
            insert_perm, update_perm, delete_perm;
    END IF;
    
    RAISE NOTICE 'SUCCESS: FAQ submissions RLS policies fixed';
    RAISE NOTICE 'Policies created: %', policy_count;
    RAISE NOTICE 'RLS enabled: %', rls_enabled;
    RAISE NOTICE 'Authenticated role has full permissions: INSERT, UPDATE, DELETE';
    RAISE NOTICE 'Admin can now update FAQ submission status after answering/rejecting';
END $$;

-- Step 8: Show current policies for verification
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE 'Current policies on faq_submissions table:';
    FOR policy_record IN 
        SELECT policyname, cmd, roles::text, qual, with_check
        FROM pg_policies 
        WHERE tablename = 'faq_submissions' AND schemaname = 'public'
        ORDER BY policyname
    LOOP
        RAISE NOTICE 'Policy: % | Command: % | Roles: %', 
            policy_record.policyname, 
            policy_record.cmd, 
            policy_record.roles;
    END LOOP;
END $$;