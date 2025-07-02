/*
  # Medical Website Database Schema

  1. New Tables
    - `appointments` - Patient appointment requests and management
    - `blog_posts` - Multilingual blog content
    - `blog_comments` - User comments on blog posts
    - `reviews` - Patient reviews and ratings
    - `faqs` - Frequently asked questions
    - `symptoms` - Symptoms and treatment information

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access where appropriate
    - Add policies for admin management

  3. Indexes
    - Add performance indexes for common queries
*/

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  national_id text NOT NULL,
  service text NOT NULL,
  preferred_date text NOT NULL,
  preferred_time text NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'completed', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create appointments"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can manage all appointments"
  ON appointments
  FOR ALL
  TO authenticated
  USING (true);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  title_az text NOT NULL,
  title_en text NOT NULL,
  content_tr text NOT NULL,
  content_az text NOT NULL,
  content_en text NOT NULL,
  excerpt_tr text NOT NULL,
  excerpt_az text NOT NULL,
  excerpt_en text NOT NULL,
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admin can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  name text NOT NULL,
  message text NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create blog comments"
  ON blog_comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved blog comments"
  ON blog_comments
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admin can manage blog comments"
  ON blog_comments
  FOR ALL
  TO authenticated
  USING (true);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  approved boolean DEFAULT false,
  doctor_reply text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reviews"
  ON reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved reviews"
  ON reviews
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admin can manage reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true);

-- FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_tr text NOT NULL,
  question_az text NOT NULL,
  question_en text NOT NULL,
  answer_tr text,
  answer_az text,
  answer_en text,
  approved boolean DEFAULT false,
  is_preset boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create FAQ questions"
  ON faqs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved FAQs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Admin can manage FAQs"
  ON faqs
  FOR ALL
  TO authenticated
  USING (true);

-- Symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tr text NOT NULL,
  title_az text NOT NULL,
  title_en text NOT NULL,
  description_tr text NOT NULL,
  description_az text NOT NULL,
  description_en text NOT NULL,
  content_tr text NOT NULL,
  content_az text NOT NULL,
  content_en text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read symptoms"
  ON symptoms
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage symptoms"
  ON symptoms
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
CREATE INDEX IF NOT EXISTS idx_faqs_approved ON faqs(approved);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);