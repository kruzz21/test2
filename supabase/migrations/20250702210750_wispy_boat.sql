/*
  # Final Fix for FAQ Submission RLS Policy

  1. Clean up all existing FAQ policies
  2. Create simple, working policies that match the workflow:
     - Public users can submit questions (approved=false by default)
     - Public users can read approved FAQs only
     - Authenticated users (admin) can manage all FAQs

  3. Ensure the table structure supports the workflow
*/

-- Disable RLS temporarily to clean up all policies
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for faqs table
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

-- Re-enable RLS
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies

-- 1. Allow anyone to submit FAQ questions
CREATE POLICY "allow_faq_submissions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Allow anyone to read approved FAQs
CREATE POLICY "allow_read_approved_faqs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- 3. Allow authenticated users (admin) full access
CREATE POLICY "allow_admin_full_access"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure answer columns can be null (for new submissions)
ALTER TABLE faqs ALTER COLUMN answer_tr DROP NOT NULL;
ALTER TABLE faqs ALTER COLUMN answer_az DROP NOT NULL;
ALTER TABLE faqs ALTER COLUMN answer_en DROP NOT NULL;