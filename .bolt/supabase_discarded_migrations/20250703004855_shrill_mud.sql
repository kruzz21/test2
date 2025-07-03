/*
  # Update RLS Policies for Proper Admin Authentication

  1. Changes Made
    - Remove dependency on custom session validation functions
    - Update all policies to use Supabase's built-in JWT authentication
    - Use app_metadata.is_admin for admin access control
    - Maintain public access for appropriate operations

  2. Security
    - Admin access requires authenticated user with is_admin = true in app_metadata
    - Public users can still insert submissions and read published content
    - All admin operations are properly secured

  3. Tables Updated
    - appointments: Admin full access, public insert/read
    - blog_posts: Admin full access, public read published
    - blog_comments: Admin full access, public insert/read approved
    - reviews: Admin full access, public insert/read approved
    - symptoms: Admin full access, public read
    - faqs: Admin full access, public read approved
    - faq_submissions: Admin full access, public insert/read
    - admin_users: Admin access only
    - admin_sessions: Admin access only
*/

-- First, drop all policies that depend on the custom functions
DROP POLICY IF EXISTS "appointments_admin_access" ON appointments;
DROP POLICY IF EXISTS "appointments_public_insert" ON appointments;
DROP POLICY IF EXISTS "appointments_public_read" ON appointments;

DROP POLICY IF EXISTS "blog_posts_admin_access" ON blog_posts;
DROP POLICY IF EXISTS "blog_posts_public_read_published" ON blog_posts;

DROP POLICY IF EXISTS "blog_comments_admin_access" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_public_insert" ON blog_comments;
DROP POLICY IF EXISTS "blog_comments_public_read_approved" ON blog_comments;

DROP POLICY IF EXISTS "reviews_admin_access" ON reviews;
DROP POLICY IF EXISTS "reviews_public_insert" ON reviews;
DROP POLICY IF EXISTS "reviews_public_read_approved" ON reviews;

DROP POLICY IF EXISTS "symptoms_admin_access" ON symptoms;
DROP POLICY IF EXISTS "symptoms_public_read" ON symptoms;

DROP POLICY IF EXISTS "faqs_admin_access" ON faqs;
DROP POLICY IF EXISTS "faqs_public_read_approved" ON faqs;

DROP POLICY IF EXISTS "faq_submissions_admin_access" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_public_insert" ON faq_submissions;
DROP POLICY IF EXISTS "faq_submissions_public_read" ON faq_submissions;

DROP POLICY IF EXISTS "admin_users_access" ON admin_users;
DROP POLICY IF EXISTS "admin_sessions_full_access" ON admin_sessions;

-- Now we can safely drop the custom functions
DROP FUNCTION IF EXISTS is_admin_session_valid(text);
DROP FUNCTION IF EXISTS get_current_session_token();

-- Create new policies using Supabase's built-in JWT authentication

-- Appointments table policies
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

-- Blog posts table policies
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

-- Blog comments table policies
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

-- Reviews table policies
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

-- Symptoms table policies
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

-- FAQs table policies
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

-- FAQ submissions table policies
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

-- Admin users table policies
CREATE POLICY "admin_users_admin_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');

-- Admin sessions table policies (keeping for potential logging)
CREATE POLICY "admin_sessions_admin_access"
  ON admin_sessions
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true')
  WITH CHECK (auth.jwt() ->> 'app_metadata' ->> 'is_admin' = 'true');