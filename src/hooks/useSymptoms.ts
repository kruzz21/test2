import { useState, useEffect } from 'react';
import { symptomsApi } from '@/lib/api';

export const useSymptoms = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSymptoms = async () => {
    try {
      setLoading(true);
      const data = await symptomsApi.getAll();
      setSymptoms(data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSymptom = async (id: string) => {
    try {
      setLoading(true);
      const data = await symptomsApi.getById(id);
      return data;
    } catch (error) {
      console.error('Error fetching symptom:', error);
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
    fetchSymptoms,
    fetchSymptom
  };
};