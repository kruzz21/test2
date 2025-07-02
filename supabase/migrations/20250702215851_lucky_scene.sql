/*
  # Fix FAQ Submissions RLS Policy

  1. Security Updates
    - Drop all existing policies for faq_submissions table
    - Grant proper permissions to anon role for FAQ submissions
    - Create simple, working RLS policies that allow anonymous submissions
    - Ensure admin can manage all submissions

  2. Changes
    - Disable RLS temporarily to clean up policies
    - Grant INSERT/SELECT permissions to anon role
    - Create permissive policies for public submissions
    - Re-enable RLS with proper policies

  This migration fixes the "new row violates row-level security policy" error.
*/

-- Disable RLS temporarily to ensure clean policy application
ALTER TABLE faq_submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies for faq_submissions table to start fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'faq_submissions' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.faq_submissions', policy_record.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE faq_submissions ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role
-- This ensures the anon role has the fundamental ability to insert data
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.faq_submissions TO anon;
GRANT SELECT ON public.faq_submissions TO anon;

-- Grant full permissions to authenticated users (admin)
GRANT ALL ON public.faq_submissions TO authenticated;

-- Create the RLS policy to allow anonymous and authenticated users to insert
CREATE POLICY "Public can submit FAQ questions"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create the RLS policy to allow authenticated users (admin) to manage all submissions
CREATE POLICY "Admin can manage all FAQ submissions"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Also ensure the anon role can use the sequence for UUID generation
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verify the table structure is correct
DO $$
BEGIN
  -- Ensure the table exists with proper structure
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'faq_submissions') THEN
    RAISE EXCEPTION 'faq_submissions table does not exist';
  END IF;
  
  -- Log success
  RAISE NOTICE 'FAQ submissions RLS policies have been successfully updated';
END $$;