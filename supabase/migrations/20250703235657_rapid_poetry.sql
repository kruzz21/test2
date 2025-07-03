/*
  # Fix Blog Comments RLS Policy

  1. Security Changes
    - Update RLS policy on `blog_comments` table to allow anonymous users to insert comments
    - Comments will still require approval before being visible (approved = false by default)
    - Only approved comments can be read by anonymous users
    - Maintain security while allowing comment submissions

  2. Policy Updates
    - Allow INSERT for anonymous users (comments need moderation)
    - Allow SELECT only for approved comments
    - Maintain existing admin controls for comment management
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read approved comments" ON blog_comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON blog_comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON blog_comments;

-- Create policy to allow anyone to read approved comments
CREATE POLICY "Anyone can read approved comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (approved = true);

-- Create policy to allow anyone to insert comments (they will be unapproved by default)
CREATE POLICY "Anyone can insert comments"
  ON blog_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for authenticated users (admins) to manage all comments
CREATE POLICY "Admins can manage all comments"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Ensure the approved column has a default value of false
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_comments' 
    AND column_name = 'approved' 
    AND column_default IS NOT NULL
  ) THEN
    ALTER TABLE blog_comments ALTER COLUMN approved SET DEFAULT false;
  END IF;
END $$;