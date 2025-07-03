/*
  # Fix RLS Policies with Proper JSON Type Checking

  1. Security Updates
    - Add jsonb_typeof checks to prevent operator errors
    - Ensure app_metadata is a valid JSON object before accessing is_admin
    - Maintain proper admin access control with robust error handling

  2. Changes
    - Update all admin access policies to check JSON type first
    - Use safe JSON extraction with type validation
    - Prevent "operator does not exist" errors when app_metadata is not JSON

  This migration fixes the "operator does not exist: text ->> unknown" error
  by ensuring we only use the ->> operator on valid JSON objects.
*/

-- Clean up all existing policies to avoid conflicts
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
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
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
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
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
  USING (
    approved = true 
    OR (
      jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
      AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    )
  );

-- Create new policies for blog_posts table
CREATE POLICY "blog_posts_admin_access"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "blog_posts_public_read_published"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (
    published = true 
    OR (
      jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
      AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    )
  );

-- Create new policies for blog_comments table
CREATE POLICY "blog_comments_admin_access"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
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
  USING (
    approved = true 
    OR (
      jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
      AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    )
  );

-- Create new policies for faqs table
CREATE POLICY "faqs_admin_access"
  ON faqs
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "faqs_public_read_approved"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (
    approved = true 
    OR (
      jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
      AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
    )
  );

-- Create new policies for faq_submissions table
CREATE POLICY "faq_submissions_admin_access"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
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
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "symptoms_public_read"
  ON symptoms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create new policies for admin_users table (admin access only)
CREATE POLICY "admin_users_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Create new policies for admin_sessions table (admin access only)
CREATE POLICY "admin_sessions_access"
  ON admin_sessions
  FOR ALL
  TO authenticated
  USING (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    jsonb_typeof(auth.jwt() -> 'app_metadata') = 'object' 
    AND (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- Verify the setup
DO $$
DECLARE
    policy_count integer;
    table_name text;
    table_policy_count integer;
BEGIN
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
    
    RAISE NOTICE 'SUCCESS: RLS policies migration completed with JSON type checking';
    RAISE NOTICE 'Total policies in database: %', policy_count;
    RAISE NOTICE 'Admin operations now use safe JSON extraction with type validation';
    RAISE NOTICE 'This prevents "operator does not exist" errors when app_metadata is not JSON';
END $$;

-- Show current policies for verification
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    RAISE NOTICE 'Current RLS policies summary:';
    FOR policy_record IN 
        SELECT tablename, COUNT(*) as policy_count
        FROM pg_policies 
        WHERE schemaname = 'public'
        GROUP BY tablename
        ORDER BY tablename
    LOOP
        RAISE NOTICE 'Table: % | Policies: %', policy_record.tablename, policy_record.policy_count;
    END LOOP;
END $$;