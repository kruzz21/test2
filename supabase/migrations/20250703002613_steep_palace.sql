/*
  # Fix Admin RLS Policies and Session Validation

  1. New Functions
    - `is_admin_session_valid` - Validates custom admin session tokens
    - `get_current_session_token` - Extracts session token from JWT

  2. Updated RLS Policies
    - Update all admin-managed tables to recognize custom admin sessions
    - Allow operations when valid admin session token is present
    - Maintain existing public access where appropriate

  3. Security
    - Uses SECURITY DEFINER to bypass RLS for session validation
    - Validates session expiry and admin status
    - Maintains data security while enabling admin operations
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

-- Update appointments table policies
DROP POLICY IF EXISTS "appointments_new_admin_access" ON appointments;
DROP POLICY IF EXISTS "appointments_new_public_insert" ON appointments;
DROP POLICY IF EXISTS "appointments_new_public_read" ON appointments;

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

-- Update reviews table policies
DROP POLICY IF EXISTS "reviews_new_admin_access" ON reviews;
DROP POLICY IF EXISTS "reviews_new_public_insert" ON reviews;
DROP POLICY IF EXISTS "reviews_new_public_read_approved" ON reviews;

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

-- Update blog_posts table policies
DROP POLICY IF EXISTS "blog_posts_new_admin_access" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_new_public_read_published" ON blog_posts;

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

-- Update blog_comments table policies
DROP POLICY IF EXISTS "blog_comments_new_admin_access" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_new_public_insert" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_new_public_read_approved" ON blog_comments;

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

-- Update faqs table policies
DROP POLICY IF EXISTS "faqs_new_admin_access" ON faqs;
DROP POLICY IF EXISTS "faqs_new_public_read_approved" ON faqs;
DROP POLICY IF EXISTS "faqs_allow_insert" ON faqs;

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

-- Update faq_submissions table policies
DROP POLICY IF EXISTS "faq_submissions_new_admin_access" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_new_public_insert" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_new_public_read" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_allow_delete_anon" ON faq_submissions;

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

-- Update symptoms table policies
DROP POLICY IF EXISTS "symptoms_new_admin_access" ON symptoms;
DROP POLICY IF EXISTS "symptoms_new_public_read" ON symptoms;

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

-- Update admin_users table policies
DROP POLICY IF EXISTS "admin_users_new_access" ON admin_users;

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

-- Update admin_sessions table policies (keep permissive for login)
DROP POLICY IF EXISTS "admin_sessions_new_access" ON admin_sessions;

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
    WHERE schemaname = 'public' 
    AND policyname LIKE '%admin_access%';
    
    RAISE NOTICE 'SUCCESS: Admin RLS policies updated';
    RAISE NOTICE 'Admin session validation function created';
    RAISE NOTICE 'Admin access policies created: %', policy_count;
    RAISE NOTICE 'Admin operations should now work with custom authentication';
END $$;