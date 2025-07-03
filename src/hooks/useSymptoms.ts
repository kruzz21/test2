import { useState, useEffect } from 'react';
import { symptomsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching symptoms...');
      
      const data = await symptomsApi.getAll();
      console.log('Symptoms fetched successfully:', data);
      
      setSymptoms(data || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load symptoms';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSymptom = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching symptom with ID:', id);
      
      const data = await symptomsApi.getById(id);
      console.log('Symptom fetched successfully:', data);
      
      return data;
    } catch (error) {
      console.error('Error fetching symptom:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load symptom';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to load symptom details. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  return {
    symptoms,
    loading,
    error,
    fetchSymptoms,
    fetchSymptom
  };
};