import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Global error handler for Supabase auth errors
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
    // Clear any cached data or perform cleanup
    localStorage.removeItem('supabase.auth.token');
  }
});

// Helper function to handle auth errors
export const handleAuthError = (error: any) => {
  console.error('Supabase auth error:', error);
  
  // Check for refresh token errors
  if (error?.message?.includes('refresh_token_not_found') || 
      error?.message?.includes('Invalid Refresh Token') ||
      error?.message?.includes('Refresh Token Not Found')) {
    
    console.log('Refresh token error detected, clearing session...');
    
    // Clear the session
    supabase.auth.signOut().catch(console.error);
    
    // Clear local storage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
    
    // Reload the page to reset the application state
    window.location.reload();
    
    return true; // Indicates the error was handled
  }
  
  return false; // Error was not handled
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