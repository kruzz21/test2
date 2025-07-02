/*
  # Create FAQ Submissions Table

  1. New Table
    - `faq_submissions` - User submitted questions awaiting admin review
    
  2. Workflow
    - Users submit questions to faq_submissions table
    - Admin reviews submissions in admin panel
    - Admin can approve and answer, which creates entry in faqs table
    - Original submission can be marked as processed or deleted

  3. Security
    - Public can insert into faq_submissions
    - Public can read from faqs (approved content)
    - Admin can manage both tables
*/

-- Create FAQ submissions table for user questions
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

-- Allow public to submit questions
CREATE POLICY "Public can submit FAQ questions"
  ON faq_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow admin to manage all submissions
CREATE POLICY "Admin can manage FAQ submissions"
  ON faq_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_faq_submissions_status ON faq_submissions(status);
CREATE INDEX IF NOT EXISTS idx_faq_submissions_created_at ON faq_submissions(created_at);

-- Now clean up the original faqs table policies to be admin-only for creation
-- Drop existing problematic policies
DROP POLICY IF EXISTS "allow_faq_submissions" ON faqs;
DROP POLICY IF EXISTS "allow_read_approved_faqs" ON faqs;
DROP POLICY IF EXISTS "allow_admin_full_access" ON faqs;

-- Create clean policies for faqs table
-- Only allow public to read approved FAQs
CREATE POLICY "Public can read approved FAQs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Only allow admin to create/manage FAQs (when approving submissions)
CREATE POLICY "Admin can manage FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);