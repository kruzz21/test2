import { useState, useEffect } from 'react';
import { faqApi, faqSubmissionsApi, type FAQSubmissionInsert } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const data = await faqApi.getApproved();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: FAQSubmissionInsert) => {
    try {
      setLoading(true);
      console.log('Creating FAQ submission with data:', questionData);
      
      await faqSubmissionsApi.create(questionData);
      
      toast({
        title: "Success",
        description: "Your question has been submitted successfully. Dr. Eryanılmaz will answer it soon.",
      });
    } catch (error) {
      console.error('Error creating question:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit question. Please try again.';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  return {
    faqs,
    loading,
    fetchFAQs,
    createQuestion
  };
};