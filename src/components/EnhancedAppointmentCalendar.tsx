import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, ChevronLeft, ChevronRight, User, Phone, Mail, Clock, CreditCard } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  national_id: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const EnhancedAppointmentCalendar = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .in('status', ['confirmed', 'completed'])
        .order('preferred_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getAppointmentsForDate = (dateString: string) => {
    return appointments.filter(apt => apt.preferred_date === dateString);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Header with day names
    dayNames.forEach(day => {
      days.push(
        <div key={day} className="p-2 text-center font-medium text-gray-600 bg-gray-50">
          {day}
        </div>
      );
    });

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(year, month, day);
      const dayAppointments = getAppointmentsForDate(dateString);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 border border-gray-200 min-h-[100px] ${
            isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
          }`}
        >
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.map((appointment) => (
              <Dialog key={appointment.id}>
                <DialogTrigger asChild>
                  <div
                    className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${getStatusColor(appointment.status)}`}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="font-medium truncate">{appointment.time || appointment.preferred_time}</div>
                    <div className="truncate">{appointment.name}</div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Appointment Details</DialogTitle>
                  </DialogHeader>
                  {selectedAppointment && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Patient Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{selectedAppointment.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-blue-600" />
                              <span>{selectedAppointment.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span>{selectedAppointment.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CreditCard className="h-4 w-4 text-blue-600" />
                              <span className="font-mono text-xs">{selectedAppointment.national_id}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Appointment Details</h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-600">Service:</span>
                              <span className="ml-2">{selectedAppointment.service}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span>{selectedAppointment.preferred_date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{selectedAppointment.preferred_time}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span>
                              <Badge className={`ml-2 ${getStatusColor(selectedAppointment.status)}`}>
                                {selectedAppointment.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedAppointment.message && (
                        <div>
                          <h4 className="font-medium mb-2">Patient Message</h4>
                          <div className="bg-gray-50 p-3 rounded text-sm">
                            {selectedAppointment.message}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 p-3 rounded">
                        <h4 className="font-medium mb-2">Timeline</h4>
                        <div className="text-sm space-y-1">
                          <div>
                            <span className="text-blue-800 font-medium">Created:</span>
                            <span className="ml-2">
                              {new Date(selectedAppointment.created_at).toLocaleDateString()} at{' '}
                              {new Date(selectedAppointment.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          {selectedAppointment.updated_at !== selectedAppointment.created_at && (
                            <div>
                              <span className="text-blue-800 font-medium">Last Updated:</span>
                              <span className="ml-2">
                                {new Date(selectedAppointment.updated_at).toLocaleDateString()} at{' '}
                                {new Date(selectedAppointment.updated_at).toLocaleTimeString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Appointment Calendar
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading calendar...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
            {renderCalendarGrid()}
          </div>
        )}
        
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Completed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedAppointmentCalendar;