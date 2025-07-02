import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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