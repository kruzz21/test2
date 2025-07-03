/*
  # Update Reviews RLS Policy

  1. Security Updates
    - Drop the existing restrictive SELECT policy for reviews
    - Create new SELECT policy that allows public access to all reviews
    - This matches the policy structure used for appointments and faq_submissions tables
    - Maintains existing admin access and public insert policies

  2. Changes
    - Drop `reviews_public_read_approved` policy
    - Create `reviews_public_read` policy that allows reading all reviews
    - Keep existing admin access and public insert policies unchanged

  This aligns the reviews table with the same RLS policy pattern used for other public-facing tables.
*/

-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "reviews_public_read_approved" ON reviews;

-- Create new SELECT policy that allows public access to all reviews
-- This matches the pattern used for appointments and faq_submissions tables
CREATE POLICY "reviews_public_read"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Verify the policy was created successfully
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' 
    AND policyname = 'reviews_public_read'
    AND cmd = 'SELECT'
  ) THEN
    RAISE NOTICE 'SUCCESS: New SELECT policy created for reviews table';
    RAISE NOTICE 'Public users can now read all reviews (matching appointments/faq_submissions pattern)';
  ELSE
    RAISE EXCEPTION 'Failed to create SELECT policy for reviews table';
  END IF;
END $$;

-- Show current policies for verification
DO $$
DECLARE
    policy_rec RECORD;
BEGIN
    RAISE NOTICE 'Current policies on reviews table:';
    FOR policy_rec IN 
        SELECT policyname, cmd, roles 
        FROM pg_policies 
        WHERE tablename = 'reviews' AND schemaname = 'public'
        ORDER BY policyname
    LOOP
        RAISE NOTICE 'Policy: % | Command: % | Roles: %', policy_rec.policyname, policy_rec.cmd, policy_rec.roles;
    END LOOP;
END $$;