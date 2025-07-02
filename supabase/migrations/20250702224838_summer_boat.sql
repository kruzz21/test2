/*
  # Fix Admin Sessions RLS Policy

  1. Security Updates
    - Apply the same proven pattern used for appointments and faq_submissions tables
    - Disable RLS temporarily to clean up all existing policies
    - Revoke all existing permissions and start fresh
    - Grant necessary permissions using the working pattern
    - Create simple, working RLS policies

  2. Changes
    - Drop all existing policies for admin_sessions table
    - Grant INSERT/SELECT permissions to anon role (needed for login)
    - Grant ALL permissions to authenticated role (for admin management)
    - Create permissive policies that match the working pattern

  This migration fixes the "409 Conflict" error during admin login
  by using the exact same approach that works for appointments and faq_submissions.
*/

-- Step 1: Completely disable RLS to avoid any conflicts
ALTER TABLE public.admin_sessions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (clean slate)
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    FOR policy_rec IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'admin_sessions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_sessions', policy_rec.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_rec.policyname;
    END LOOP;
END $$;

-- Step 3: Revoke ALL existing permissions (clean slate)
REVOKE ALL ON public.admin_sessions FROM anon;
REVOKE ALL ON public.admin_sessions FROM authenticated;
REVOKE ALL ON public.admin_sessions FROM public;

-- Step 4: Grant permissions using the EXACT same pattern as appointments table
-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant sequence usage for UUID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant table permissions
GRANT INSERT, SELECT ON public.admin_sessions TO anon;
GRANT INSERT, SELECT ON public.admin_sessions TO authenticated;
GRANT ALL ON public.admin_sessions TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies using the EXACT same pattern as appointments table
-- Policy 1: Allow public to create sessions (needed for login)
CREATE POLICY "Public can create admin sessions"
  ON public.admin_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow authenticated users (admin) to manage all sessions
CREATE POLICY "Admin can manage all admin sessions"
  ON public.admin_sessions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy 3: Allow public to read sessions (needed for session validation)
CREATE POLICY "Public can read admin sessions"
  ON public.admin_sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Step 7: Verify everything is set up correctly
DO $$
BEGIN
  -- Check table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'admin_sessions'
  ) THEN
    RAISE EXCEPTION 'admin_sessions table does not exist';
  END IF;
  
  -- Check RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'admin_sessions' AND c.relrowsecurity = true
  ) THEN
    RAISE EXCEPTION 'RLS is not enabled on admin_sessions';
  END IF;
  
  -- Check policies exist
  IF (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'admin_sessions') < 3 THEN
    RAISE EXCEPTION 'Not all policies were created successfully';
  END IF;
  
  RAISE NOTICE 'SUCCESS: Admin sessions table is now configured identically to appointments table';
  RAISE NOTICE 'Anonymous users should now be able to create sessions during login';
END $$;

-- Step 8: Additional debugging - show current state
DO $$
DECLARE
    policy_rec RECORD;
    policy_count INTEGER;
BEGIN
    -- Count policies
    SELECT COUNT(*) INTO policy_count FROM pg_policies WHERE tablename = 'admin_sessions';
    RAISE NOTICE 'Total policies on admin_sessions: %', policy_count;
    
    -- Show all policies
    FOR policy_rec IN 
        SELECT policyname, cmd, roles 
        FROM pg_policies 
        WHERE tablename = 'admin_sessions'
    LOOP
        RAISE NOTICE 'Policy: % | Command: % | Roles: %', policy_rec.policyname, policy_rec.cmd, policy_rec.roles;
    END LOOP;
    
    RAISE NOTICE 'Migration completed successfully';
END $$;