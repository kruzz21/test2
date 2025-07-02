import { useState, useEffect } from 'react';
import { blogApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getPublished();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (id: string) => {
    try {
      setLoading(true);
      const data = await blogApi.getById(id);
      return data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const data = await blogApi.getComments(postId);
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const addComment = async (comment: { post_id: string; name: string; message: string }) => {
    try {
      await blogApi.addComment(comment);
      toast({
        title: "Success",
        description: "Your comment has been submitted successfully. It will be published after approval.",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to submit comment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    fetchPost,
    fetchComments,
    addComment
  };
};