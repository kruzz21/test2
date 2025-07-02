/*
  # Fix appointments table RLS policy for creation

  1. Changes
    - Drop the existing "Allow appointment creation" policy that has restrictive with_check
    - Create a new policy that properly allows anonymous and authenticated users to create appointments
    - Ensure the policy allows insertion without restrictive conditions

  2. Security
    - Maintains security by allowing anyone to create appointments (common for contact forms)
    - Keeps admin-only access for reading/updating appointments
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow appointment creation" ON appointments;

-- Create a new policy that allows appointment creation for everyone
CREATE POLICY "Anyone can create appointments"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);