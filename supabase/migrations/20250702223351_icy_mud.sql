/*
  # Fix Admin Session RLS Policy for Login

  1. Security Updates
    - Drop all existing policies on admin_sessions table
    - Create new policies that allow anonymous session creation during login
    - Ensure proper security while allowing the login flow to work

  2. Changes
    - Allow anonymous users to create sessions (needed for login)
    - Allow authenticated users to manage their own sessions
    - Maintain security by validating admin_id exists and is active
*/

-- Step 1: Disable RLS temporarily to clean up policies
ALTER TABLE admin_sessions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies for admin_sessions table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'admin_sessions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_sessions', policy_record.policyname);
        RAISE NOTICE 'Dropped policy: %', policy_record.policyname;
    END LOOP;
END $$;

-- Step 3: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT INSERT, SELECT ON public.admin_sessions TO anon;
GRANT ALL ON public.admin_sessions TO authenticated;

-- Step 4: Re-enable RLS
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create new policies

-- Allow anonymous users to create sessions (needed for login)
CREATE POLICY "Allow session creation for login"
  ON admin_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = admin_sessions.admin_id 
      AND admin_users.is_active = true
    )
  );

-- Allow authenticated users to read their own sessions
CREATE POLICY "Admin can read own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (admin_id = auth.uid());

-- Allow authenticated users to update their own sessions
CREATE POLICY "Admin can update own sessions"
  ON admin_sessions
  FOR UPDATE
  TO authenticated
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

-- Allow authenticated users to delete their own sessions
CREATE POLICY "Admin can delete own sessions"
  ON admin_sessions
  FOR DELETE
  TO authenticated
  USING (admin_id = auth.uid());

-- Step 6: Verify the setup
DO $$
DECLARE
    policy_count INTEGER;
    rls_enabled BOOLEAN;
BEGIN
    -- Check RLS is enabled
    SELECT c.relrowsecurity INTO rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'admin_sessions';
    
    IF NOT rls_enabled THEN
        RAISE EXCEPTION 'RLS is not enabled on admin_sessions table';
    END IF;
    
    -- Check policies exist
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'admin_sessions' AND schemaname = 'public';
    
    IF policy_count < 4 THEN
        RAISE EXCEPTION 'Not enough policies created. Expected 4, got %', policy_count;
    END IF;
    
    RAISE NOTICE 'SUCCESS: Admin session policies fixed';
    RAISE NOTICE 'Policies created: %', policy_count;
    RAISE NOTICE 'Anonymous users can now create sessions during login';
END $$;