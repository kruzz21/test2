import { useState, useEffect } from 'react';
import { appointmentsApi, type AppointmentInsert } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const createAppointment = async (appointmentData: AppointmentInsert) => {
    try {
      setLoading(true);
      const newAppointment = await appointmentsApi.create(appointmentData);
      toast({
        title: "Success",
        description: "Your appointment request has been submitted successfully. We will contact you within 24 hours.",
      });
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to submit appointment request. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      await appointmentsApi.updateStatus(id, status);
      await fetchAppointments(); // Refresh the list
      toast({
        title: "Success",
        description: "Appointment status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    createAppointment,
    fetchAppointments,
    updateAppointmentStatus
  };
};