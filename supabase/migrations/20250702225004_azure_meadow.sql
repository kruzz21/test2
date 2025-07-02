/*
  # Fix Admin User Creation

  1. Changes
    - Create or update the default admin user that the application expects
    - Handle both ID and email conflicts properly
    - Ensure the admin user exists with the correct ID for foreign key references

  2. Security
    - Uses placeholder password hash (should be changed in production)
    - Creates admin user with proper permissions
*/

-- First, try to update existing admin user if it exists
UPDATE admin_users 
SET 
  id = '00000000-0000-0000-0000-000000000001',
  password_hash = '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ',
  name = 'Dr. Gürkan Eryanılmaz',
  is_active = true
WHERE email = 'admin@drgeryanilmaz.com';

-- If no rows were updated, insert the new admin user
INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  created_at,
  is_active
)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  'admin@drgeryanilmaz.com',
  '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ',
  'Dr. Gürkan Eryanılmaz',
  now(),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@drgeryanilmaz.com'
);

-- Verify the admin user exists with the correct ID
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = '00000000-0000-0000-0000-000000000001' 
    AND email = 'admin@drgeryanilmaz.com'
  ) THEN
    RAISE EXCEPTION 'Failed to create or update admin user with required ID';
  END IF;
  
  RAISE NOTICE 'SUCCESS: Admin user exists with ID 00000000-0000-0000-0000-000000000001';
END $$;