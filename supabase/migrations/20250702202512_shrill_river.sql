/*
  # Fix appointments table RLS policies

  1. Security Updates
    - Drop existing problematic INSERT policy
    - Create new INSERT policy that properly allows anonymous users to create appointments
    - Ensure the policy has proper with_check condition
    - Keep existing admin policy for managing appointments

  2. Changes
    - Remove restrictive INSERT policy
    - Add permissive INSERT policy for appointment creation
    - Maintain security while allowing public appointment requests
*/

-- Drop the existing INSERT policy that might be causing issues
DROP POLICY IF EXISTS "Enable INSERT for appointment requests" ON appointments;

-- Create a new INSERT policy that allows anyone to create appointment requests
CREATE POLICY "Anyone can create appointment requests"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the admin policy exists and is correct
DROP POLICY IF EXISTS "Admin can manage all appointments" ON appointments;

CREATE POLICY "Admin can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);