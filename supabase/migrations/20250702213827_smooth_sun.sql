/*
  # Final Fix for FAQ Submissions

  1. Security Updates
    - Ensure faq_submissions table exists with proper structure
    - Grant proper permissions to anon role for FAQ submissions
    - Create simple, working RLS policies

  2. Changes
    - Create faq_submissions table if it doesn't exist
    - Grant INSERT/SELECT permissions to anon role
    - Create simple RLS policies that allow anonymous submissions
    - Ensure admin can manage all submissions

  This migration consolidates all the necessary fixes for FAQ submissions.
*/

-- Ensure faq_submissions table exists
CREATE TABLE IF NOT EXISTS faq_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  question_tr text NOT NULL,
  question_az text NOT NULL,
  question_en text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processed')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processed_by text
);

-- Enable RLS on faq_submissions
ALTER TABLE faq_submissions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for faq_submissions to start fresh
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

-- Create simple, working policies for faq_submissions
CREATE POLICY "allow_anonymous_faq_submissions"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "allow_admin_manage_faq_submissions"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.faq_submissions TO anon;
GRANT SELECT ON public.faq_submissions TO anon;

-- Grant full permissions to authenticated users (admin)
GRANT ALL ON public.faq_submissions TO authenticated;

-- Create indexes for performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_faq_submissions_status ON faq_submissions(status);
CREATE INDEX IF NOT EXISTS idx_faq_submissions_created_at ON faq_submissions(created_at);

-- Ensure the main faqs table has proper policies
-- Drop existing policies for faqs table
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'faqs' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.faqs', policy_record.policyname);
    END LOOP;
END $$;

-- Create clean policies for faqs table
CREATE POLICY "allow_read_approved_faqs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "allow_admin_manage_faqs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions for faqs table
GRANT SELECT ON public.faqs TO anon;
GRANT ALL ON public.faqs TO authenticated;