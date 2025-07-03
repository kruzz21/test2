/*
  # Update RLS Policies for Admin Authentication

  1. Security Updates
    - Replace custom session validation with Supabase auth
    - Use app_metadata.is_admin for admin access control
    - Simplify RLS policies to use built-in auth functions

  2. Policy Updates
    - Update all admin-only policies to check app_metadata.is_admin
    - Maintain public read access where appropriate
    - Ensure proper access control for all tables
*/

-- Drop existing admin session validation function if it exists
DROP FUNCTION IF EXISTS is_admin_session_valid(text);
DROP FUNCTION IF EXISTS get_current_session_token();

-- Update appointments table policies
DROP POLICY IF EXISTS "appointments_admin_access" ON appointments;
DROP POLICY IF EXISTS "appointments_public_insert" ON appointments;
DROP POLICY IF EXISTS "appointments_public_read" ON appointments;

CREATE POLICY "appointments_admin_full_access"
  ON appointments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

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

-- Update blog_posts table policies
DROP POLICY IF EXISTS "blog_posts_admin_access" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_public_read_published" ON blog_posts;

CREATE POLICY "blog_posts_admin_full_access"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "blog_posts_public_read_published"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Update blog_comments table policies
DROP POLICY IF EXISTS "blog_comments_admin_access" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_public_insert" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_public_read_approved" ON blog_comments;

CREATE POLICY "blog_comments_admin_full_access"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "blog_comments_public_insert"
  ON blog_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "blog_comments_public_read_approved"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Update reviews table policies
DROP POLICY IF EXISTS "reviews_admin_access" ON reviews;
DROP POLICY IF EXISTS "reviews_public_insert" ON reviews;
DROP POLICY IF EXISTS "reviews_public_read_approved" ON reviews;

CREATE POLICY "reviews_admin_full_access"
  ON reviews
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "reviews_public_insert"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "reviews_public_read_approved"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Update symptoms table policies
DROP POLICY IF EXISTS "symptoms_admin_access" ON symptoms;
DROP POLICY IF EXISTS "symptoms_public_read" ON symptoms;

CREATE POLICY "symptoms_admin_full_access"
  ON symptoms
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "symptoms_public_read"
  ON symptoms
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update faqs table policies
DROP POLICY IF EXISTS "faqs_admin_access" ON faqs;
DROP POLICY IF EXISTS "faqs_public_read_approved" ON faqs;

CREATE POLICY "faqs_admin_full_access"
  ON faqs
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

CREATE POLICY "faqs_public_read_approved"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true OR auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Update faq_submissions table policies
DROP POLICY IF EXISTS "faq_submissions_admin_access" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_public_insert" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_public_read" ON faq_submissions;

CREATE POLICY "faq_submissions_admin_full_access"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

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

-- Update admin_users table policies
DROP POLICY IF EXISTS "admin_users_access" ON admin_users;

CREATE POLICY "admin_users_admin_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Update admin_sessions table policies (keeping for potential logging)
DROP POLICY IF EXISTS "admin_sessions_full_access" ON admin_sessions;

CREATE POLICY "admin_sessions_admin_access"
  ON admin_sessions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');