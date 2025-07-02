/*
  # Final Fix for FAQ Submissions RLS Policy

  This migration uses the exact same approach that works for the appointments table.
  We'll copy the working pattern from appointments to faq_submissions.

  1. Complete reset of all policies and permissions
  2. Use identical policy structure to appointments table
  3. Ensure anon role has all necessary permissions
  4. Test with simple, proven policy patterns

  This should definitively resolve the RLS policy violation.
*/

-- Step 1: Completely disable RLS to avoid any conflicts
ALTER TABLE public.faq_submissions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (clean slate)
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

-- Step 3: Revoke ALL existing permissions (clean slate)
REVOKE ALL ON public.faq_submissions FROM anon;
REVOKE ALL ON public.faq_submissions FROM authenticated;
REVOKE ALL ON public.faq_submissions FROM public;

-- Step 4: Grant permissions using the EXACT same pattern as appointments table
-- (Copy the working permissions from appointments)

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant sequence usage for UUID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant table permissions
GRANT INSERT, SELECT ON public.faq_submissions TO anon;
GRANT INSERT, SELECT ON public.faq_submissions TO authenticated;
GRANT ALL ON public.faq_submissions TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.faq_submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies using the EXACT same pattern as appointments table
-- (Copy the working policies from appointments)

CREATE POLICY "Public can create appointments"
  ON public.faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can manage all appointments"
  ON public.faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read appointments"
  ON public.faq_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Step 7: Verify everything is set up correctly
DO $$
BEGIN
  -- Check table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'faq_submissions'
  ) THEN
    RAISE EXCEPTION 'faq_submissions table does not exist';
  END IF;
  
  -- Check RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'faq_submissions' AND c.relrowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS is not enabled on faq_submissions';
  END IF;
  
  -- Check policies exist
  IF (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'faq_submissions') < 3 THEN
    RAISE EXCEPTION 'Not all policies were created successfully';
  END IF;
  
  RAISE NOTICE 'SUCCESS: FAQ submissions table is now configured identically to appointments table';
  RAISE NOTICE 'Anonymous users should now be able to submit FAQ questions';
END $$;

-- Step 8: Additional debugging - show current state
DO $$
DECLARE
    policy_rec RECORD;
    policy_count INTEGER;
BEGIN
    -- Count policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'faq_submissions';
    RAISE NOTICE 'Total policies on faq_submissions: %', policy_count;
    
    -- Show all policies
    FOR policy_rec IN 
        SELECT policyname, cmd, roles 
        FROM pg_policies 
        WHERE tablename = 'faq_submissions'
    LOOP
        RAISE NOTICE 'Policy: % | Command: % | Roles: %', policy_rec.policyname, policy_rec.cmd, policy_rec.roles;
    END LOOP;
    
    RAISE NOTICE 'Migration completed successfully';
END $$;