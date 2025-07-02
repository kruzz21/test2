/*
  # Grant INSERT permissions to anon role for faq_submissions table

  1. Security Updates
    - Grant INSERT permission to anon role on faq_submissions table
    - This allows anonymous users to submit FAQ questions
    - The existing RLS policies will still control what data can be inserted

  2. Changes
    - Add GRANT INSERT statement for anon role
    - Ensure anonymous users can submit questions through the FAQ form
*/

-- Grant INSERT permission to anon role on faq_submissions table
GRANT INSERT ON public.faq_submissions TO anon;

-- Also grant INSERT permission to authenticated users (just to be safe)
GRANT INSERT ON public.faq_submissions TO authenticated;

-- Grant SELECT permission to anon role so they can read their submissions if needed
GRANT SELECT ON public.faq_submissions TO anon;

-- Grant SELECT permission to authenticated users for admin functionality
GRANT SELECT ON public.faq_submissions TO authenticated;

-- Grant UPDATE and DELETE permissions to authenticated users for admin management
GRANT UPDATE ON public.faq_submissions TO authenticated;
GRANT DELETE ON public.faq_submissions TO authenticated;