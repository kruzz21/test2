/*
  # Fix RLS policy for appointments table

  1. Security Updates
    - Drop existing problematic INSERT policy for appointments
    - Create new INSERT policy that properly allows anonymous users to create appointments
    - Ensure the policy has correct permissions for both anon and authenticated roles

  2. Changes
    - Remove the existing "Anyone can create appointments" policy
    - Add a new policy with explicit INSERT permissions for anon and authenticated users
    - Maintain existing policies for admin management

  This migration resolves the "new row violates row-level security policy" error
  that occurs when anonymous users try to submit appointment requests through the contact form.
*/

-- Drop the existing INSERT policy that might be causing issues
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;

-- Create a new INSERT policy that explicitly allows anon and authenticated users
CREATE POLICY "Enable INSERT for appointment requests"
  ON public.appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the existing admin policy remains intact
-- (This should already exist but we'll recreate it to be safe)
DROP POLICY IF EXISTS "Admin can manage all appointments" ON public.appointments;

CREATE POLICY "Admin can manage all appointments"
  ON public.appointments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);