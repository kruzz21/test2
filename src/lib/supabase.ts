import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to set admin session in Supabase client
export const setAdminSession = (sessionToken: string) => {
  // Create a custom session object that Supabase can use
  const session = {
    access_token: sessionToken,
    refresh_token: sessionToken,
    expires_in: 28800, // 8 hours
    expires_at: Math.floor(Date.now() / 1000) + 28800,
    token_type: 'bearer',
    user: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@drgeryanilmaz.com',
      role: 'authenticated',
      aud: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  // Set the session in the Supabase client
  supabase.auth.setSession(session as any);
};

// Function to clear admin session from Supabase client
export const clearAdminSession = () => {
  supabase.auth.signOut();
};

// Function to check if admin is authenticated in Supabase
export const isAdminAuthenticated = () => {
  const session = supabase.auth.getSession();
  return session !== null;
};

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          national_id: string;
          service: string;
          preferred_date: string;
          preferred_time: string;
          message?: string;
          status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'deleted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          phone: string;
          email: string;
          national_id: string;
          service: string;
          preferred_date: string;
          preferred_time: string;
          message?: string;
          status?: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'deleted';
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string;
          national_id?: string;
          service?: string;
          preferred_date?: string;
          preferred_time?: string;
          message?: string;
          status?: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'deleted';
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title_tr: string;
          title_az: string;
          title_en: string;
          content_tr: string;
          content_az: string;
          content_en: string;
          excerpt_tr: string;
          excerpt_az: string;
          excerpt_en: string;
          image_url?: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title_tr: string;
          title_az: string;
          title_en: string;
          content_tr: string;
          content_az: string;
          content_en: string;
          excerpt_tr: string;
          excerpt_az: string;
          excerpt_en: string;
          image_url?: string;
          published?: boolean;
        };
        Update: {
          title_tr?: string;
          title_az?: string;
          title_en?: string;
          content_tr?: string;
          content_az?: string;
          content_en?: string;
          excerpt_tr?: string;
          excerpt_az?: string;
          excerpt_en?: string;
          image_url?: string;
          published?: boolean;
        };
      };
      blog_comments: {
        Row: {
          id: string;
          post_id: string;
          name: string;
          message: string;
          approved: boolean;
          created_at: string;
        };
        Insert: {
          post_id: string;
          name: string;
          message: string;
          approved?: boolean;
        };
        Update: {
          name?: string;
          message?: string;
          approved?: boolean;
        };
      };
      reviews: {
        Row: {
          id: string;
          name: string;
          message: string;
          rating: number;
          approved: boolean;
          doctor_reply?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          message: string;
          rating: number;
          approved?: boolean;
          doctor_reply?: string;
        };
        Update: {
          name?: string;
          message?: string;
          rating?: number;
          approved?: boolean;
          doctor_reply?: string;
        };
      };
      faqs: {
        Row: {
          id: string;
          question_tr: string;
          question_az: string;
          question_en: string;
          answer_tr?: string;
          answer_az?: string;
          answer_en?: string;
          approved: boolean;
          is_preset: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          question_tr: string;
          question_az: string;
          question_en: string;
          answer_tr?: string;
          answer_az?: string;
          answer_en?: string;
          approved?: boolean;
          is_preset?: boolean;
        };
        Update: {
          question_tr?: string;
          question_az?: string;
          question_en?: string;
          answer_tr?: string;
          answer_az?: string;
          answer_en?: string;
          approved?: boolean;
        };
      };
      faq_submissions: {
        Row: {
          id: string;
          name: string;
          email?: string;
          question_tr: string;
          question_az: string;
          question_en: string;
          status: 'pending' | 'approved' | 'rejected' | 'processed';
          created_at: string;
          processed_at?: string;
          processed_by?: string;
        };
        Insert: {
          name: string;
          email?: string;
          question_tr: string;
          question_az: string;
          question_en: string;
          status?: 'pending' | 'approved' | 'rejected' | 'processed';
        };
        Update: {
          name?: string;
          email?: string;
          question_tr?: string;
          question_az?: string;
          question_en?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'processed';
          processed_at?: string;
          processed_by?: string;
        };
      };
      symptoms: {
        Row: {
          id: string;
          title_tr: string;
          title_az: string;
          title_en: string;
          description_tr: string;
          description_az: string;
          description_en: string;
          content_tr: string;
          content_az: string;
          content_en: string;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title_tr: string;
          title_az: string;
          title_en: string;
          description_tr: string;
          description_az: string;
          description_en: string;
          content_tr: string;
          content_az: string;
          content_en: string;
          image_url?: string;
        };
        Update: {
          title_tr?: string;
          title_az?: string;
          title_en?: string;
          description_tr?: string;
          description_az?: string;
          description_en?: string;
          content_tr?: string;
          content_az?: string;
          content_en?: string;
          image_url?: string;
        };
      };
    };
  };
};