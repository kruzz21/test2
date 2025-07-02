import { supabase } from './supabase';
import { adminAuth } from './adminAuth';
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
export type FAQSubmission = Database['public']['Tables']['faq_submissions']['Row'];
export type FAQSubmissionInsert = Database['public']['Tables']['faq_submissions']['Insert'];
export type Symptom = Database['public']['Tables']['symptoms']['Row'];

// Helper function to check admin authentication
const checkAdminAuth = () => {
  const session = adminAuth.getCurrentSession();
  if (!session || !adminAuth.isAuthenticated()) {
    throw new Error('Admin authentication required');
  }
  return session;
};

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
    checkAdminAuth(); // Require admin auth for status updates
    
    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    checkAdminAuth(); // Require admin auth for deletions
    
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
    checkAdminAuth(); // Require admin auth for doctor replies
    
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
    console.log('Fetching approved FAQs...');
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching FAQs:', error);
      throw error;
    }
    
    console.log('FAQs fetched successfully:', data);
    return data;
  },

  async create(faq: FAQInsert) {
    console.log('Creating FAQ with data:', faq);
    checkAdminAuth(); // Require admin auth for creating FAQs
    
    const { data, error } = await supabase
      .from('faqs')
      .insert(faq)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating FAQ:', error);
      throw error;
    }
    
    console.log('FAQ created successfully:', data);
    return data;
  }
};

// FAQ Submissions API
export const faqSubmissionsApi = {
  async create(submission: FAQSubmissionInsert) {
    try {
      console.log('Attempting to create FAQ submission:', submission);
      
      const { data, error } = await supabase
        .from('faq_submissions')
        .insert(submission)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating FAQ submission:', error);
        throw new Error(`Failed to submit question: ${error.message}`);
      }
      
      console.log('FAQ submission created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in faqSubmissionsApi.create:', error);
      throw error;
    }
  },

  async getAll() {
    checkAdminAuth(); // Require admin auth to view all submissions
    
    const { data, error } = await supabase
      .from('faq_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPending() {
    checkAdminAuth(); // Require admin auth to view pending submissions
    
    const { data, error } = await supabase
      .from('faq_submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    checkAdminAuth(); // Require admin auth for status updates
    
    const { data, error } = await supabase
      .from('faq_submissions')
      .update({ 
        status, 
        processed_at: new Date().toISOString(),
        processed_by: 'admin' 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    checkAdminAuth(); // Require admin auth for deletions
    
    const { error } = await supabase
      .from('faq_submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async approveAndCreateFAQ(submissionId: string, faqData: { 
    question_tr: string; 
    question_az: string; 
    question_en: string;
    answer_tr: string; 
    answer_az: string; 
    answer_en: string;
  }) {
    try {
      console.log('Starting approveAndCreateFAQ for submission:', submissionId);
      checkAdminAuth(); // Require admin auth
      
      // Get the submission to verify it exists
      const { data: submission, error: fetchError } = await supabase
        .from('faq_submissions')
        .select('*')
        .eq('id', submissionId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching submission:', fetchError);
        throw fetchError;
      }

      console.log('Creating FAQ from submission:', submission);

      // Create the FAQ entry with the provided data
      const newFaqData = {
        question_tr: faqData.question_tr,
        question_az: faqData.question_az,
        question_en: faqData.question_en,
        answer_tr: faqData.answer_tr,
        answer_az: faqData.answer_az,
        answer_en: faqData.answer_en,
        approved: true,
        is_preset: false
      };

      console.log('FAQ data to insert:', newFaqData);

      // Use the faqApi.create method which has better error handling
      const faq = await faqApi.create(newFaqData);

      console.log('FAQ created successfully:', faq);

      // Delete the submission after successfully creating the FAQ
      await this.delete(submissionId);
      console.log('FAQ submission deleted successfully');

      return faq;
    } catch (error) {
      console.error('Error in approveAndCreateFAQ:', error);
      throw error;
    }
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
    checkAdminAuth(); // Require admin auth for stats
    
    const [appointments, reviews, faqSubmissions, blogs] = await Promise.all([
      supabase.from('appointments').select('status'),
      supabase.from('reviews').select('approved'),
      supabase.from('faq_submissions').select('status'),
      supabase.from('blog_posts').select('published')
    ]);

    const pendingAppointments = appointments.data?.filter(a => a.status === 'pending').length || 0;
    const totalPatients = appointments.data?.length || 0;
    const pendingReviews = reviews.data?.filter(r => !r.approved).length || 0;
    const unansweredQuestions = faqSubmissions.data?.filter(f => f.status === 'pending').length || 0;
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
    checkAdminAuth(); // Require admin auth
    
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPendingReviews() {
    checkAdminAuth(); // Require admin auth
    
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async approveReview(id: string) {
    checkAdminAuth(); // Require admin auth
    
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPendingFAQSubmissions() {
    return faqSubmissionsApi.getPending();
  },

  async answerFAQSubmission(id: string, faqData: { 
    question_tr: string; 
    question_az: string; 
    question_en: string;
    answer_tr: string; 
    answer_az: string; 
    answer_en: string;
  }) {
    console.log('Admin API: Answering FAQ submission', id, faqData);
    
    try {
      // Use the approveAndCreateFAQ method which handles both creating the FAQ and deleting the submission
      const result = await faqSubmissionsApi.approveAndCreateFAQ(id, faqData);
      console.log('FAQ submission answered and processed successfully');
      return result;
    } catch (error) {
      console.error('Error in answerFAQSubmission:', error);
      throw error;
    }
  },

  async rejectFAQSubmission(id: string) {
    console.log('Admin API: Rejecting FAQ submission', id);
    checkAdminAuth(); // Require admin auth
    
    try {
      // Simply delete the submission since it's being rejected
      await faqSubmissionsApi.delete(id);
      console.log('FAQ submission rejected and deleted successfully');
    } catch (error) {
      console.error('Error in rejectFAQSubmission:', error);
      throw error;
    }
  }
};