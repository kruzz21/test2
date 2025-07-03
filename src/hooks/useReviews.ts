import { useState, useEffect } from 'react';
import { reviewsApi, type ReviewInsert } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsApi.getApproved();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: ReviewInsert & {
    name_tr?: string;
    name_az?: string;
    name_en?: string;
    message_tr?: string;
    message_az?: string;
    message_en?: string;
  }) => {
    try {
      setLoading(true);
      await reviewsApi.create(reviewData);
      toast({
        title: "Success",
        description: "Your review has been submitted successfully. It will be published after approval.",
      });
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    loading,
    fetchReviews,
    createReview
  };
};