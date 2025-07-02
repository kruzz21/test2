import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Appointment = Database['public']['Tables']['appointments']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];
type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogComment = Database['public']['Tables']['blog_comments']['Row'];
type FAQ = Database['public']['Tables']['faqs']['Row'];

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingAppointments = async (): Promise<Appointment[]> => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching pending appointments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch pending appointments: ${errorMessage}`);
    }
  };

  const fetchPendingReviews = async (): Promise<Review[]> => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching pending reviews:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch pending reviews: ${errorMessage}`);
    }
  };

  const fetchBlogPosts = async (): Promise<BlogPost[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch blog posts: ${errorMessage}`);
    }
  };

  const fetchBlogComments = async (): Promise<BlogComment[]> => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching blog comments:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch blog comments: ${errorMessage}`);
    }
  };

  const fetchFAQs = async (): Promise<FAQ[]> => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      throw new Error(`Failed to fetch FAQs: ${errorMessage}`);
    }
  };

  const updateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('appointments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to update appointment: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (id: string, approved: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('reviews')
        .update({ approved, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error approving review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to approve review: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const replyToReview = async (id: string, reply: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('reviews')
        .update({ doctor_reply: reply, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error replying to review:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to reply to review: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBlogPost = async (post: Database['public']['Tables']['blog_posts']['Insert']) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Error creating blog post:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to create blog post: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBlogPost = async (id: string, updates: Database['public']['Tables']['blog_posts']['Update']) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('blog_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error updating blog post:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to update blog post: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to delete blog post: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveBlogComment = async (id: string, approved: boolean) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('blog_comments')
        .update({ approved })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error approving blog comment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to approve blog comment: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const answerFAQ = async (id: string, answers: { answer_tr: string; answer_az: string; answer_en: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('faqs')
        .update({ 
          ...answers, 
          approved: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }
    } catch (err) {
      console.error('Error answering FAQ:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to answer FAQ: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createFAQ = async (faq: Database['public']['Tables']['faqs']['Insert']) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('faqs')
        .insert({ ...faq, is_preset: true, approved: true })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (err) {
      console.error('Error creating FAQ:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to create FAQ: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchPendingAppointments,
    fetchPendingReviews,
    fetchBlogPosts,
    fetchBlogComments,
    fetchFAQs,
    updateAppointmentStatus,
    approveReview,
    replyToReview,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    approveBlogComment,
    answerFAQ,
    createFAQ,
  };
};