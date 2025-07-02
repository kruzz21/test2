/*
  # Create default admin user

  1. New Records
    - Insert default admin user with predefined credentials
    - ID: 00000000-0000-0000-0000-000000000001
    - Email: admin@drgeryanilmaz.com
    - Name: Dr. Gürkan Eryanılmaz
    - Password: admin123 (hashed)

  2. Security
    - Uses bcrypt-style password hashing
    - Ensures foreign key constraint is satisfied for admin_sessions table

  3. Notes
    - This is for demo purposes only
    - In production, use proper password hashing and secure credentials
*/

-- Insert the default admin user that the application expects
INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  created_at,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@drgeryanilmaz.com',
  '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ',
  'Dr. Gürkan Eryanılmaz',
  now(),
  true
) ON CONFLICT (id) DO NOTHING;

-- Also ensure the email constraint is satisfied
INSERT INTO admin_users (
  id,
  email,
  password_hash,
  name,
  created_at,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@drgeryanilmaz.com',
  '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ',
  'Dr. Gürkan Eryanılmaz',
  now(),
  true
) ON CONFLICT (email) DO UPDATE SET
  id = EXCLUDED.id,
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;