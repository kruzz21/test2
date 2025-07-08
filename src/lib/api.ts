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
export type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
export type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert'];
export type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update'];

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

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
  async getPublished(searchTerm?: string) {
    try {
      console.log('blogApi.getPublished: Starting fetch...', searchTerm ? `with search: ${searchTerm}` : '');
      
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true);

      // Add search functionality if searchTerm is provided
      if (searchTerm && searchTerm.trim()) {
        const trimmedSearch = searchTerm.trim();
        query = query.or(`title_en.ilike.%${trimmedSearch}%,title_tr.ilike.%${trimmedSearch}%,title_az.ilike.%${trimmedSearch}%,excerpt_en.ilike.%${trimmedSearch}%,excerpt_tr.ilike.%${trimmedSearch}%,excerpt_az.ilike.%${trimmedSearch}%,content_en.ilike.%${trimmedSearch}%,content_tr.ilike.%${trimmedSearch}%,content_az.ilike.%${trimmedSearch}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('blogApi.getPublished: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('blogApi.getPublished: Success, fetched', data?.length || 0, 'posts', searchTerm ? `(filtered by: ${searchTerm})` : '');
      return data || [];
    } catch (error) {
      console.error('blogApi.getPublished: Unexpected error:', error);
      throw error; // Re-throw to ensure the error propagates to the calling hook
    }
  },

  async getById(id: string) {
    try {
      console.log('blogApi.getById: Fetching post with ID:', id);
      
      // Validate UUID format before making the request
      if (!isValidUUID(id)) {
        console.error('blogApi.getById: Invalid UUID format:', id);
        throw new Error(`Invalid blog post ID format: "${id}". Expected a valid UUID.`);
      }
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();
      
      if (error) {
        console.error('blogApi.getById: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('blogApi.getById: Success, fetched post:', data?.title_en || 'Unknown title');
      return data;
    } catch (error) {
      console.error('blogApi.getById: Unexpected error:', error);
      throw error;
    }
  },

  async getComments(postId: string) {
    try {
      console.log('blogApi.getComments: Fetching comments for post ID:', postId);
      
      // Validate UUID format before making the request
      if (!isValidUUID(postId)) {
        console.error('blogApi.getComments: Invalid UUID format:', postId);
        throw new Error(`Invalid post ID format: "${postId}". Expected a valid UUID.`);
      }
      
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('approved', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('blogApi.getComments: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('blogApi.getComments: Success, fetched', data?.length || 0, 'comments');
      return data || [];
    } catch (error) {
      console.error('blogApi.getComments: Unexpected error:', error);
      throw error;
    }
  },

  async addComment(comment: { post_id: string; name: string; message: string }) {
    try {
      console.log('blogApi.addComment: Adding comment:', comment);
      
      // Validate UUID format before making the request
      if (!isValidUUID(comment.post_id)) {
        console.error('blogApi.addComment: Invalid UUID format:', comment.post_id);
        throw new Error(`Invalid post ID format: "${comment.post_id}". Expected a valid UUID.`);
      }
      
      // Insert comment without selecting it back to avoid RLS violation
      // New comments are unapproved by default and can't be read by public users
      const { error } = await supabase
        .from('blog_comments')
        .insert(comment);
      
      if (error) {
        console.error('blogApi.addComment: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('blogApi.addComment: Success, comment submitted for moderation');
      
      // Return a success indicator instead of the actual comment data
      return { success: true, message: 'Comment submitted for moderation' };
    } catch (error) {
      console.error('blogApi.addComment: Unexpected error:', error);
      throw error;
    }
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

  async create(review: ReviewInsert & {
    name_tr?: string;
    name_az?: string;
    name_en?: string;
    message_tr?: string;
    message_az?: string;
    message_en?: string;
  }) {
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

// Gallery API
export const galleryApi = {
  async getAllPublished() {
    try {
      console.log('galleryApi.getAllPublished: Starting fetch...');
      
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('galleryApi.getAllPublished: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('galleryApi.getAllPublished: Success, fetched', data?.length || 0, 'items');
      return data || [];
    } catch (error) {
      console.error('galleryApi.getAllPublished: Unexpected error:', error);
      throw error;
    }
  },

  async getAll() {
    try {
      checkAdminAuth(); // Require admin auth to view all items
      
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('galleryApi.getAll: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('galleryApi.getAll: Success, fetched', data?.length || 0, 'items');
      return data || [];
    } catch (error) {
      console.error('galleryApi.getAll: Unexpected error:', error);
      throw error;
    }
  },

  async create(itemData: GalleryItemInsert) {
    try {
      checkAdminAuth(); // Require admin auth for creating items
      
      const { data, error } = await supabase
        .from('gallery_items')
        .insert(itemData)
        .select()
        .single();
      
      if (error) {
        console.error('galleryApi.create: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('galleryApi.create: Success, created item with ID:', data?.id);
      return data;
    } catch (error) {
      console.error('galleryApi.create: Unexpected error:', error);
      throw error;
    }
  },

  async update(id: string, itemData: GalleryItemUpdate) {
    try {
      checkAdminAuth(); // Require admin auth for updating items
      
      const { data, error } = await supabase
        .from('gallery_items')
        .update({ ...itemData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('galleryApi.update: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('galleryApi.update: Success, updated item with ID:', data?.id);
      return data;
    } catch (error) {
      console.error('galleryApi.update: Unexpected error:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      checkAdminAuth(); // Require admin auth for deleting items
      
      const { error } = await supabase
        .from('gallery_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('galleryApi.delete: Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('galleryApi.delete: Success, deleted item with ID:', id);
    } catch (error) {
      console.error('galleryApi.delete: Unexpected error:', error);
      throw error;
    }
  }
};

// Admin API
export const adminApi = {
  async getStats() {
    checkAdminAuth(); // Require admin auth for stats
    
    const [appointments, reviews, faqSubmissions, blogs, galleryItems] = await Promise.all([
      supabase.from('appointments').select('status'),
      supabase.from('reviews').select('approved'),
      supabase.from('faq_submissions').select('status'),
      supabase.from('blog_posts').select('published'),
      supabase.from('gallery_items').select('published')
    ]);

    const pendingAppointments = appointments.data?.filter(a => a.status === 'pending').length || 0;
    const totalPatients = appointments.data?.length || 0;
    const pendingReviews = reviews.data?.filter(r => !r.approved).length || 0;
    const unansweredQuestions = faqSubmissions.data?.filter(f => f.status === 'pending').length || 0;
    const publishedBlogs = blogs.data?.filter(b => b.published).length || 0;
    const publishedGalleryItems = galleryItems.data?.filter(g => g.published).length || 0;

    return {
      pendingAppointments,
      totalPatients,
      pendingReviews,
      unansweredQuestions,
      publishedBlogs,
      publishedGalleryItems,
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