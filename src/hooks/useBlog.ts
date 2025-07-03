import { useState, useEffect } from 'react';
import { blogApi, type BlogPost, type BlogComment } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getPublished();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPostById = async (id: string): Promise<BlogPost | null> => {
    try {
      setLoading(true);
      const post = await blogApi.getById(id);
      return post;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string): Promise<BlogComment[]> => {
    try {
      const comments = await blogApi.getComments(postId);
      return comments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const addComment = async (commentData: { post_id: string; name: string; message: string }) => {
    try {
      await blogApi.addComment(commentData);
      toast({
        title: "Success",
        description: "Your comment has been submitted and is awaiting approval.",
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
    fetchPostById,
    fetchComments,
    addComment
  };
};