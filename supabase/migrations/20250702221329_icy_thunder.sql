/*
  # Fix FAQ Table Permissions

  1. Security
    - Reset all RLS policies on faqs table
    - Create proper policies for admin access
    - Ensure public can read approved FAQs
    - Allow authenticated users to manage all FAQs
*/

-- Step 1: Disable RLS temporarily to clean up
ALTER TABLE public.faqs DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start fresh
DO $$
DECLARE
    policy_name TEXT;
BEGIN
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'faqs' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.faqs', policy_name);
        RAISE NOTICE 'Dropped policy: %', policy_name;
    END LOOP;
END $$;

-- Step 3: Revoke all permissions and start fresh
REVOKE ALL ON public.faqs FROM anon;
REVOKE ALL ON public.faqs FROM authenticated;
REVOKE ALL ON public.faqs FROM public;

-- Step 4: Grant basic schema access
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Step 5: Grant sequence permissions for UUID generation
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Step 6: Grant table permissions
GRANT SELECT ON public.faqs TO anon;
GRANT ALL ON public.faqs TO authenticated;

-- Step 7: Re-enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Step 8: Create new policies with clear names
CREATE POLICY "faqs_public_read_approved"
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "faqs_admin_full_access"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Step 9: Verify the setup
DO $$
DECLARE
    policy_count INTEGER;
    rls_enabled BOOLEAN;
BEGIN
    -- Check RLS is enabled
    SELECT c.relrowsecurity INTO rls_enabled
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'faqs';
    
    IF NOT rls_enabled THEN
        RAISE EXCEPTION 'RLS is not enabled on faqs table';
    END IF;
    
    -- Check policies exist
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE tablename = 'faqs' AND schemaname = 'public';
    
    IF policy_count < 2 THEN
        RAISE EXCEPTION 'Not enough policies created. Expected 2, got %', policy_count;
    END IF;
    
    RAISE NOTICE 'SUCCESS: FAQ table permissions fixed';
    RAISE NOTICE 'Policies created: %', policy_count;
    RAISE NOTICE 'RLS enabled: %', rls_enabled;
END $$;

-- Step 10: Show current policies for verification
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE 'Current policies on faqs table:';
    FOR policy_record IN 
        SELECT policyname, cmd, roles::text, qual, with_check
        FROM pg_policies 
        WHERE tablename = 'faqs' AND schemaname = 'public'
    LOOP
        RAISE NOTICE 'Policy: % | Command: % | Roles: % | Using: % | Check: %', 
            policy_record.policyname, 
            policy_record.cmd, 
            policy_record.roles,
            policy_record.qual,
            policy_record.with_check;
    END LOOP;
END $$;