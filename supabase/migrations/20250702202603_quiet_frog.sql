/*
  # Fix appointments table RLS policy

  1. Security Updates
    - Drop existing INSERT policy for appointments
    - Create new INSERT policy that properly allows anonymous users to create appointments
    - Ensure the policy allows both anonymous and authenticated users to insert appointment requests

  2. Changes
    - Remove the problematic INSERT policy
    - Add a new, properly configured INSERT policy for appointment creation
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anyone can create appointment requests" ON appointments;

-- Create a new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Allow appointment creation"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);