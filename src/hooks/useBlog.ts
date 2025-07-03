import { useState, useEffect } from 'react';
import { blogApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useBlog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log('Fetching blog posts...');
      
      const data = await blogApi.getPublished();
      console.log('Blog posts fetched successfully:', data);
      
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load blog posts';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Always set loading to false, regardless of success or failure
    }
  };

  const fetchBlogPost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching blog post with ID:', id);
      
      const data = await blogApi.getById(id);
      console.log('Blog post fetched successfully:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load blog post';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw so the component can handle it
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogComments = async (postId: string) => {
    try {
      console.log('Fetching comments for post ID:', postId);
      
      const data = await blogApi.getComments(postId);
      console.log('Blog comments fetched successfully:', data);
      
      return data || [];
    } catch (error) {
      console.error('Error fetching blog comments:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load comments';
      
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
      return []; // Return empty array on error
    }
  };

  const addBlogComment = async (comment: { post_id: string; name: string; message: string }) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Adding blog comment:', comment);
      
      const data = await blogApi.addComment(comment);
      console.log('Blog comment added successfully:', data);
      
      toast({
        title: "Success",
        description: "Your comment has been submitted and is awaiting approval.",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding blog comment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return {
    blogPosts,
    loading,
    error,
    fetchBlogPosts,
    fetchBlogPost,
    fetchBlogComments,
    addBlogComment
  };
};