import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

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
          name_tr?: string;
          name_az?: string;
          name_en?: string;
          message_tr?: string;
          message_az?: string;
          message_en?: string;
          doctor_reply_tr?: string;
          doctor_reply_az?: string;
          doctor_reply_en?: string;
        };
        Insert: {
          name: string;
          message: string;
          rating: number;
          approved?: boolean;
          doctor_reply?: string;
          name_tr?: string;
          name_az?: string;
          name_en?: string;
          message_tr?: string;
          message_az?: string;
          message_en?: string;
          doctor_reply_tr?: string;
          doctor_reply_az?: string;
          doctor_reply_en?: string;
        };
        Update: {
          name?: string;
          message?: string;
          rating?: number;
          approved?: boolean;
          doctor_reply?: string;
          name_tr?: string;
          name_az?: string;
          name_en?: string;
          message_tr?: string;
          message_az?: string;
          message_en?: string;
          doctor_reply_tr?: string;
          doctor_reply_az?: string;
          doctor_reply_en?: string;
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
          icon_color: string;
          common_causes_tr: string[];
          common_causes_az: string[];
          common_causes_en: string[];
          symptoms_list_tr: string[];
          symptoms_list_az: string[];
          symptoms_list_en: string[];
          conservative_treatments_tr: string[];
          conservative_treatments_az: string[];
          conservative_treatments_en: string[];
          surgical_treatments_tr: string[];
          surgical_treatments_az: string[];
          surgical_treatments_en: string[];
          doctor_approach_tr: string;
          doctor_approach_az: string;
          doctor_approach_en: string;
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
          icon_color: string;
          common_causes_tr: string[];
          common_causes_az: string[];
          common_causes_en: string[];
          symptoms_list_tr: string[];
          symptoms_list_az: string[];
          symptoms_list_en: string[];
          conservative_treatments_tr: string[];
          conservative_treatments_az: string[];
          conservative_treatments_en: string[];
          surgical_treatments_tr: string[];
          surgical_treatments_az: string[];
          surgical_treatments_en: string[];
          doctor_approach_tr: string;
          doctor_approach_az: string;
          doctor_approach_en: string;
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
          icon_color?: string;
          common_causes_tr?: string[];
          common_causes_az?: string[];
          common_causes_en?: string[];
          symptoms_list_tr?: string[];
          symptoms_list_az?: string[];
          symptoms_list_en?: string[];
          conservative_treatments_tr?: string[];
          conservative_treatments_az?: string[];
          conservative_treatments_en?: string[];
          surgical_treatments_tr?: string[];
          surgical_treatments_az?: string[];
          surgical_treatments_en?: string[];
          doctor_approach_tr?: string;
          doctor_approach_az?: string;
          doctor_approach_en?: string;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          type: 'photo' | 'video';
          url: string;
          thumbnail_url?: string;
          title_tr: string;
          title_az: string;
          title_en: string;
          description_tr?: string;
          description_az?: string;
          description_en?: string;
          alt_text_tr?: string;
          alt_text_az?: string;
          alt_text_en?: string;
          categories_tr?: string;
          categories_az?: string;
          categories_en?: string;
          published: boolean;
          display_order?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          type: 'photo' | 'video';
          url: string;
          thumbnail_url?: string;
          title_tr: string;
          title_az: string;
          title_en: string;
          description_tr?: string;
          description_az?: string;
          description_en?: string;
          alt_text_tr?: string;
          alt_text_az?: string;
          alt_text_en?: string;
          categories_tr?: string;
          categories_az?: string;
          categories_en?: string;
          published?: boolean;
          display_order?: number;
        };
        Update: {
          type?: 'photo' | 'video';
          url?: string;
          thumbnail_url?: string;
          title_tr?: string;
          title_az?: string;
          title_en?: string;
          description_tr?: string;
          description_az?: string;
          description_en?: string;
          alt_text_tr?: string;
          alt_text_az?: string;
          alt_text_en?: string;
          categories_tr?: string;
          categories_az?: string;
          categories_en?: string;
          published?: boolean;
          display_order?: number;
        };
      };
    };
  };
};