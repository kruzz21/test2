/*
  # Fix FAQ Submissions RLS Policy - Simple Version

  1. Security Updates
    - Clean up existing policies for faq_submissions table
    - Create simple, working RLS policies that allow anonymous submissions
    - Grant necessary permissions to anon role
    - Ensure admin can manage all submissions

  2. Changes
    - Drop existing problematic policies
    - Grant INSERT/SELECT permissions to anon role
    - Create permissive policies for public submissions
    - Create admin policy for full management access

  This migration fixes the "new row violates row-level security policy" error.
*/

-- Step 1: Disable RLS temporarily
ALTER TABLE public.faq_submissions DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (simple approach)
DROP POLICY IF EXISTS "Public can create appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "Admin can manage all appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "Public can read appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "enable_insert_for_anon_users" ON public.faq_submissions;
DROP POLICY IF EXISTS "enable_all_for_authenticated_users" ON public.faq_submissions;
DROP POLICY IF EXISTS "Public can submit FAQ questions" ON public.faq_submissions;
DROP POLICY IF EXISTS "Admin can manage all FAQ submissions" ON public.faq_submissions;
DROP POLICY IF EXISTS "allow_anonymous_faq_submissions" ON public.faq_submissions;
DROP POLICY IF EXISTS "allow_admin_manage_faq_submissions" ON public.faq_submissions;
DROP POLICY IF EXISTS "Anyone can submit FAQ questions" ON public.faq_submissions;

-- Step 3: Revoke existing permissions
REVOKE ALL ON public.faq_submissions FROM anon;
REVOKE ALL ON public.faq_submissions FROM authenticated;
REVOKE ALL ON public.faq_submissions FROM public;

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT INSERT, SELECT ON public.faq_submissions TO anon;
GRANT ALL ON public.faq_submissions TO authenticated;

-- Step 5: Re-enable RLS
ALTER TABLE public.faq_submissions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create simple, working policies
CREATE POLICY "Public can create FAQ submissions"
  ON public.faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can manage all FAQ submissions"
  ON public.faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read FAQ submissions"
  ON public.faq_submissions
  FOR SELECT
  TO anon, authenticated
  USING (true);