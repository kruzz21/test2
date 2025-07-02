/*
  # Add UPDATE policy for FAQ submissions

  1. Security Changes
    - Add policy to allow authenticated users (admins) to update FAQ submissions
    - This enables the admin panel to change status and add processed_by/processed_at fields

  2. Policy Details
    - Allows UPDATE operations on faq_submissions table for authenticated role
    - Maintains existing INSERT and SELECT policies
*/

-- Add UPDATE policy for FAQ submissions to allow admins to update status and processing info
CREATE POLICY "Admin can update faq submissions"
  ON faq_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);