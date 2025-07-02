/*
  # Comprehensive Fix for FAQ Submissions RLS Policy

  1. Complete Reset Approach
    - Temporarily disable RLS to ensure clean policy application
    - Revoke all existing grants to start fresh
    - Drop all existing policies to eliminate conflicts
    - Re-grant necessary permissions with explicit grants
    - Recreate simple, working RLS policies

  2. Security Updates
    - Grant fundamental INSERT permission to anon role
    - Grant USAGE on schema and sequences for UUID generation
    - Create permissive INSERT policy for public submissions
    - Create admin policy for full management access

  3. Verification
    - Add verification checks to ensure table exists
    - Add logging for successful policy updates

  This migration addresses potential issues with:
  - Lingering policy conflicts from previous attempts
  - Missing fundamental permissions for anon role
  - Sequence usage permissions for UUID generation
  - Policy caching or application issues
*/

-- Step 1: Temporarily disable RLS to ensure clean policy application
ALTER TABLE public.faq_submissions DISABLE ROW LEVEL SECURITY;

-- Step 2: Revoke all existing grants to start completely fresh
REVOKE ALL ON public.faq_submissions FROM anon;
REVOKE ALL ON public.faq_submissions FROM authenticated;
REVOKE ALL ON public.faq_submissions FROM public;

-- Step 3: Drop all existing policies for faq_submissions table
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

-- Step 4: Re-grant necessary permissions explicitly
-- Grant schema usage to anon role (required for any table access)
GRANT USAGE ON SCHEMA public TO anon;

-- Grant sequence usage to anon role (required for gen_random_uuid())
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Grant specific table permissions to anon role
GRANT INSERT ON public.faq_submissions TO anon;
GRANT SELECT ON public.faq_submissions TO anon;

-- Grant full permissions to authenticated users (admin)
GRANT ALL ON public.faq_submissions TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.faq_submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create new, simple RLS policies

-- Policy 1: Allow public to submit FAQ questions
CREATE POLICY "enable_insert_for_anon_users"
  ON public.faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow authenticated users (admin) to manage all submissions
CREATE POLICY "enable_all_for_authenticated_users"
  ON public.faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 7: Verification and logging
DO $$
BEGIN
  -- Verify the table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'faq_submissions'
  ) THEN
    RAISE EXCEPTION 'faq_submissions table does not exist';
  END IF;
  
  -- Verify RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'faq_submissions' AND c.relrowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS is not enabled on faq_submissions table';
  END IF;
  
  -- Verify policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'faq_submissions' AND policyname = 'enable_insert_for_anon_users'
  ) THEN
    RAISE EXCEPTION 'Insert policy was not created successfully';
  END IF;
  
  -- Log success
  RAISE NOTICE 'FAQ submissions RLS policies have been successfully reset and recreated';
  RAISE NOTICE 'Anonymous users can now submit FAQ questions';
  RAISE NOTICE 'Authenticated users have full management access';
END $$;

-- Step 8: Additional safety check - ensure default values are set correctly
DO $$
BEGIN
  -- Ensure status column has proper default
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'faq_submissions' 
    AND column_name = 'status' 
    AND column_default LIKE '%pending%'
  ) THEN
    ALTER TABLE public.faq_submissions ALTER COLUMN status SET DEFAULT 'pending';
    RAISE NOTICE 'Set default status to pending for new submissions';
  END IF;
END $$;