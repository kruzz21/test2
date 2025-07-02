/*
  # Fix FAQ RLS Policies - Final Solution

  1. Complete Reset
    - Drop ALL existing policies for the faqs table
    - Recreate clean, simple policies that match the working appointments structure
    - Ensure anonymous users can submit FAQ questions
    - Ensure proper read access for approved FAQs
    - Ensure admin access for management

  2. Security
    - Public can INSERT new FAQ questions (will be unapproved by default)
    - Public can SELECT only approved FAQs
    - Authenticated users (admins) have full access to all FAQs

  This migration completely resets the RLS policies to ensure they work correctly.
*/

-- First, disable RLS temporarily to clean up
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for faqs table to start fresh
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

-- Create new, clean policies

-- 1. Allow public to insert FAQ questions (they will be unapproved by default)
CREATE POLICY "faqs_insert_policy"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 2. Allow public to read only approved FAQs
CREATE POLICY "faqs_select_policy"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

-- 3. Allow authenticated users (admins) full access to all FAQs
CREATE POLICY "faqs_admin_policy"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);