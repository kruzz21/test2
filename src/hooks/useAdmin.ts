import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useAdmin = () => {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    totalPatients: 0,
    pendingReviews: 0,
    unansweredQuestions: 0,
    publishedBlogs: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAppointments = async () => {
    try {
      const data = await adminApi.getPendingAppointments();
      return data;
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
      return [];
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const data = await adminApi.getPendingReviews();
      return data;
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      return [];
    }
  };

  const approveReview = async (id: string) => {
    try {
      await adminApi.approveReview(id);
      await fetchStats(); // Refresh stats
      toast({
        title: "Success",
        description: "Review approved successfully.",
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review.",
        variant: "destructive",
      });
    }
  };

  const fetchPendingFAQs = async () => {
    try {
      const data = await adminApi.getPendingFAQs();
      return data;
    } catch (error) {
      console.error('Error fetching pending FAQs:', error);
      return [];
    }
  };

  const answerFAQ = async (id: string, answers: { answer_tr: string; answer_az: string; answer_en: string }) => {
    try {
      await adminApi.answerFAQ(id, answers);
      await fetchStats(); // Refresh stats
      toast({
        title: "Success",
        description: "FAQ answered and approved successfully.",
      });
    } catch (error) {
      console.error('Error answering FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to answer FAQ.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    fetchStats,
    fetchPendingAppointments,
    fetchPendingReviews,
    approveReview,
    fetchPendingFAQs,
    answerFAQ
  };
};