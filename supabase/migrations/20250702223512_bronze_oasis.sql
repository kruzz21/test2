/*
  # Fix Admin Sessions RLS Policy

  1. Security Updates
    - Update the INSERT policy for admin_sessions table to allow login process
    - Ensure only valid admin users can create sessions
    - Maintain security by checking admin_users table during insert

  2. Changes
    - Modify the existing INSERT policy to be more permissive during login
    - Keep validation that admin user exists and is active
*/

-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Allow session creation for login" ON admin_sessions;

-- Create a new INSERT policy that allows session creation during login
CREATE POLICY "Allow session creation during login"
  ON admin_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 
      FROM admin_users 
      WHERE admin_users.id = admin_sessions.admin_id 
      AND admin_users.is_active = true
    )
  );