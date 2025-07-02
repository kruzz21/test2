import { supabase } from './supabase';
import type { Database } from './supabase';

// Types
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogComment = Database['public']['Tables']['blog_comments']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type FAQInsert = Database['public']['Tables']['faqs']['Insert'];
export type Symptom = Database['public']['Tables']['symptoms']['Row'];

// Appointments API
export const appointmentsApi = {
  async create(appointment: AppointmentInsert) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Blog API
export const blogApi = {
  async getPublished() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('blog_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addComment(comment: { post_id: string; name: string; message: string }) {
    const { data, error } = await supabase
      .from('blog_comments')
      .insert(comment)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Reviews API
export const reviewsApi = {
  async getApproved() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(review: ReviewInsert) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async addDoctorReply(id: string, reply: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ doctor_reply: reply, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// FAQ API
export const faqApi = {
  async getApproved() {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(faq: FAQInsert) {
    const { data, error } = await supabase
      .from('faqs')
      .insert(faq)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Symptoms API
export const symptomsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Admin API
export const adminApi = {
  async getStats() {
    const [appointments, reviews, faqs, blogs] = await Promise.all([
      supabase.from('appointments').select('status'),
      supabase.from('reviews').select('approved'),
      supabase.from('faqs').select('approved'),
      supabase.from('blog_posts').select('published')
    ]);

    const pendingAppointments = appointments.data?.filter(a => a.status === 'pending').length || 0;
    const totalPatients = appointments.data?.length || 0;
    const pendingReviews = reviews.data?.filter(r => !r.approved).length || 0;
    const unansweredQuestions = faqs.data?.filter(f => !f.approved).length || 0;
    const publishedBlogs = blogs.data?.filter(b => b.published).length || 0;

    return {
      pendingAppointments,
      totalPatients,
      pendingReviews,
      unansweredQuestions,
      publishedBlogs,
      totalViews: 8932 // Placeholder
    };
  },

  async getPendingAppointments() {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPendingReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async approveReview(id: string) {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPendingFAQs() {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async answerFAQ(id: string, answers: { answer_tr: string; answer_az: string; answer_en: string }) {
    const { data, error } = await supabase
      .from('faqs')
      .update({ 
        ...answers, 
        approved: true, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};