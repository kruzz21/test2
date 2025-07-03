/*
  # Fix Admin RLS Policies and Create Session Validation

  1. New Functions
    - `is_admin_session_valid(session_token)` - Validates admin session tokens
    - `get_current_session_token()` - Extracts session token from JWT

  2. Updated RLS Policies
    - All tables now support admin access via custom session validation
    - Maintains public access for appropriate operations
    - Uses custom authentication system instead of Supabase auth

  3. Security
    - Admin operations require valid session tokens
    - Public operations remain unrestricted where appropriate
    - Session validation checks expiry and admin status
*/

-- Create function to validate admin session tokens
CREATE OR REPLACE FUNCTION is_admin_session_valid(session_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_exists boolean := false;
BEGIN
    -- Check if session exists, is not expired, and admin is active
    SELECT EXISTS (
        SELECT 1 
        FROM admin_sessions s
        JOIN admin_users u ON s.admin_id = u.id
        WHERE s.session_token = is_admin_session_valid.session_token
        AND s.expires_at > now()
        AND u.is_active = true
    ) INTO session_exists;
    
    RETURN session_exists;
END;
$$;

-- Create function to extract session token from current JWT
CREATE OR REPLACE FUNCTION get_current_session_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    token text;
BEGIN
    -- Extract the access_token from the current JWT
    -- This will be the custom session token set by adminAuth
    SELECT auth.jwt() ->> 'access_token' INTO token;
    RETURN token;
END;
$$;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION is_admin_session_valid(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_current_session_token() TO anon, authenticated;

-- Clean up all existing policies on all tables to avoid conflicts
DO $$
DECLARE
    table_name text;
    policy_record RECORD;
BEGIN
    -- List of tables to clean up
    FOR table_name IN VALUES ('appointments'), ('reviews'), ('blog_posts'), ('blog_comments'), ('faqs'), ('faq_submissions'), ('symptoms'), ('admin_users'), ('admin_sessions')
    LOOP
        -- Drop all existing policies for each table
        FOR policy_record IN 
            SELECT policyname 
            FROM pg_policies 
            WHERE tablename = table_name AND schemaname = 'public'
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_record.policyname, table_name);
            RAISE NOTICE 'Dropped policy % on table %', policy_record.policyname, table_name;
        END LOOP;
    END LOOP;
END $$;

-- Create new policies for appointments table
CREATE POLICY "appointments_admin_access"
  ON appointments
  FOR ALL
  TO anon, authenticated
  USING (
    -- Allow if user has valid admin session
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    -- Allow if user has valid admin session
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "appointments_public_insert"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "appointments_public_read"
  ON appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create new policies for reviews table
CREATE POLICY "reviews_admin_access"
  ON reviews
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "reviews_public_insert"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "reviews_public_read_approved"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR is_admin_session_valid(get_current_session_token()));

-- Create new policies for blog_posts table
CREATE POLICY "blog_posts_admin_access"
  ON blog_posts
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "blog_posts_public_read_published"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR is_admin_session_valid(get_current_session_token()));

-- Create new policies for blog_comments table
CREATE POLICY "blog_comments_admin_access"
  ON blog_comments
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "blog_comments_public_insert"
  ON blog_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "blog_comments_public_read_approved"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR is_admin_session_valid(get_current_session_token()));

-- Create new policies for faqs table
CREATE POLICY "faqs_admin_access"
  ON faqs
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "faqs_public_read_approved"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR is_admin_session_valid(get_current_session_token()));

-- Create new policies for faq_submissions table
CREATE POLICY "faq_submissions_admin_access"
  ON faq_submissions
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "faq_submissions_public_insert"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "faq_submissions_public_read"
  ON faq_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create new policies for symptoms table
CREATE POLICY "symptoms_admin_access"
  ON symptoms
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

CREATE POLICY "symptoms_public_read"
  ON symptoms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create new policies for admin_users table
CREATE POLICY "admin_users_access"
  ON admin_users
  FOR ALL
  TO anon, authenticated
  USING (
    is_admin_session_valid(get_current_session_token())
  )
  WITH CHECK (
    is_admin_session_valid(get_current_session_token())
  );

-- Create new policies for admin_sessions table (keep permissive for login)
CREATE POLICY "admin_sessions_full_access"
  ON admin_sessions
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Verify the setup
DO $$
DECLARE
    function_exists boolean;
    policy_count integer;
    table_name text;
    table_policy_count integer;
BEGIN
    -- Check if the validation function exists
    SELECT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'is_admin_session_valid'
    ) INTO function_exists;
    
    IF NOT function_exists THEN
        RAISE EXCEPTION 'Admin session validation function was not created';
    END IF;
    
    -- Count total policies created
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    -- Check each table has policies
    FOR table_name IN VALUES ('appointments'), ('reviews'), ('blog_posts'), ('blog_comments'), ('faqs'), ('faq_submissions'), ('symptoms'), ('admin_users'), ('admin_sessions')
    LOOP
        SELECT COUNT(*) INTO table_policy_count 
        FROM pg_policies 
        WHERE tablename = table_name AND schemaname = 'public';
        
        RAISE NOTICE 'Table % has % policies', table_name, table_policy_count;
        
        IF table_policy_count = 0 THEN
            RAISE WARNING 'Table % has no RLS policies!', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'SUCCESS: Admin RLS policies migration completed';
    RAISE NOTICE 'Admin session validation function created: %', function_exists;
    RAISE NOTICE 'Total policies in database: %', policy_count;
    RAISE NOTICE 'Admin operations should now work with custom authentication';
    RAISE NOTICE 'All existing policies have been replaced with new admin-aware policies';
END $$;