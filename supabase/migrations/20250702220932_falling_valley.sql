/*
  # Fix FAQ Submissions RLS Policy

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

-- Drop existing policies for faq_submissions table
DROP POLICY IF EXISTS "Public can create appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "Admin can manage all appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "Public can read appointments" ON public.faq_submissions;
DROP POLICY IF EXISTS "enable_insert_for_anon_users" ON public.faq_submissions;
DROP POLICY IF EXISTS "enable_all_for_authenticated_users" ON public.faq_submissions;
DROP POLICY IF EXISTS "Public can submit FAQ questions" ON public.faq_submissions;
DROP POLICY IF EXISTS "Admin can manage all FAQ submissions" ON public.faq_submissions;

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.faq_submissions TO anon;
GRANT SELECT ON public.faq_submissions TO anon;

-- Grant full permissions to authenticated users (admin)
GRANT ALL ON public.faq_submissions TO authenticated;

-- Create simple RLS policies that work

-- Policy 1: Allow public to submit FAQ questions
CREATE POLICY "enable_insert_for_anon_users"
  ON public.faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Allow authenticated users (admin) to manage all submissions
CREATE POLICY "enable_all_for_authenticated_users"
  ON public.faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);