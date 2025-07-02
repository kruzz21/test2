/*
  # Fix admin session RLS policy for login

  1. Security Changes
    - Update RLS policy on `admin_sessions` table to allow INSERT operations for anonymous users during login
    - This is necessary because the login process happens before authentication
    - The policy ensures only valid admin sessions can be created by checking the admin_id exists

  2. Changes Made
    - Drop existing restrictive policy
    - Create new policy that allows anonymous INSERT operations
    - Maintain security by validating admin_id exists in admin_users table
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin can manage own sessions" ON admin_sessions;

-- Create a policy that allows anonymous users to create sessions (for login)
CREATE POLICY "Allow session creation for login"
  ON admin_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = admin_id AND is_active = true
    )
  );

-- Create a policy for authenticated users to read their own sessions
CREATE POLICY "Admin can read own sessions"
  ON admin_sessions
  FOR SELECT
  TO authenticated
  USING (admin_id = auth.uid());

-- Create a policy for authenticated users to delete their own sessions
CREATE POLICY "Admin can delete own sessions"
  ON admin_sessions
  FOR DELETE
  TO authenticated
  USING (admin_id = auth.uid());

-- Create a policy for authenticated users to update their own sessions
CREATE POLICY "Admin can update own sessions"
  ON admin_sessions
  FOR UPDATE
  TO authenticated
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());