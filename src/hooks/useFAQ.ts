import { useState, useEffect } from 'react';
import { faqApi, type FAQInsert } from '@/lib/api';
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
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: FAQInsert) => {
    try {
      setLoading(true);
      
      // Create the question with minimal required data
      const faqData = {
        question_tr: questionData.question_tr,
        question_az: questionData.question_az,
        question_en: questionData.question_en,
        // Don't include answer fields - they will be null by default
        approved: false,
        is_preset: false
      };

      await faqApi.create(faqData);
      toast({
        title: "Success",
        description: "Your question has been submitted successfully. Dr. Eryanılmaz will answer it soon.",
      });
    } catch (error) {
      console.error('Error creating question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
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