/*
  # Create Admin Authentication System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `created_at` (timestamp)
      - `last_login` (timestamp)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for admin access only
    - Create secure login function
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz,
  is_active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies - only authenticated admins can access
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Insert default admin user (password: admin123)
-- In production, this should be changed immediately
INSERT INTO admin_users (email, password_hash, name) 
VALUES (
  'admin@drgeryanilmaz.com',
  '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', -- This is a placeholder hash
  'Dr. Gürkan Eryanılmaz'
) ON CONFLICT (email) DO NOTHING;

-- Create admin session table for tracking logged in admins
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_used timestamptz DEFAULT now()
);

-- Enable RLS on admin_sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_sessions
CREATE POLICY "Admin can manage own sessions"
  ON admin_sessions
  FOR ALL
  TO authenticated
  USING (admin_id = auth.uid());

-- Create indexes for admin_sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < now();
END;
$$;

-- Create a function to validate admin session
CREATE OR REPLACE FUNCTION validate_admin_session(session_token text)
RETURNS TABLE(admin_id uuid, email text, name text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clean up expired sessions first
  PERFORM cleanup_expired_admin_sessions();
  
  -- Update last_used timestamp and return admin info
  UPDATE admin_sessions 
  SET last_used = now() 
  WHERE admin_sessions.session_token = validate_admin_session.session_token 
    AND expires_at > now();
  
  -- Return admin info if session is valid
  RETURN QUERY
  SELECT au.id, au.email, au.name
  FROM admin_users au
  JOIN admin_sessions as_table ON au.id = as_table.admin_id
  WHERE as_table.session_token = validate_admin_session.session_token
    AND as_table.expires_at > now()
    AND au.is_active = true;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON admin_users TO authenticated;
GRANT ALL ON admin_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION validate_admin_session(text) TO anon;
GRANT EXECUTE ON FUNCTION cleanup_expired_admin_sessions() TO authenticated;