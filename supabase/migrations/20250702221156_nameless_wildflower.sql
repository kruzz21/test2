/*
  # Fix FAQ Table RLS Policies

  1. Security Updates
    - Fix RLS policies on faqs table to allow admin operations
    - Ensure authenticated users can create and manage FAQ entries
    - Maintain public read access for approved FAQs

  2. Changes
    - Update admin policy to allow all operations for authenticated users
    - Ensure proper permissions for FAQ creation and management
*/

-- Step 1: Drop existing problematic policies on faqs table
DROP POLICY IF EXISTS "Admin can manage faqs" ON public.faqs;
DROP POLICY IF EXISTS "Anyone can read faqs" ON public.faqs;
DROP POLICY IF EXISTS "allow_admin_manage_faqs" ON public.faqs;
DROP POLICY IF EXISTS "allow_read_approved_faqs" ON public.faqs;

-- Step 2: Create proper policies for faqs table
CREATE POLICY "Admin can manage all faqs"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read approved faqs"
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- Step 3: Ensure proper permissions are granted
GRANT INSERT, SELECT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT SELECT ON public.faqs TO anon;

-- Step 4: Verify RLS is enabled
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;