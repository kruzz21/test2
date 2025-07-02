import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
}

const AppointmentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConfirmedAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'confirmed')
        .order('preferred_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching confirmed appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedAppointments();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.preferred_date === date);
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const isPastDate = (year: number, month: number, day: number) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(year, month, day);
      const dayAppointments = getAppointmentsForDate(dateString);
      const isCurrentDay = isToday(year, month, day);
      const isPast = isPastDate(year, month, day);
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 ${
            isCurrentDay ? 'bg-blue-50 border-blue-300' : ''
          } ${isPast ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentDay ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-gray-900'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayAppointments.slice(0, 2).map((apt, index) => (
              <div
                key={apt.id}
                className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded truncate"
                title={`${apt.name} - ${apt.service} at ${apt.preferred_time}`}
              >
                {apt.preferred_time} - {apt.name}
              </div>
            ))}
            {dayAppointments.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayAppointments.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(apt => new Date(apt.preferred_date) >= today)
      .sort((a, b) => {
        const dateA = new Date(`${a.preferred_date}T${a.preferred_time}`);
        const dateB = new Date(`${b.preferred_date}T${b.preferred_time}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 5);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointment Calendar
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium min-w-[140px] text-center">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading appointments...</div>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-0">
                {/* Day headers */}
                {dayNames.map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 border-b">
                    {day}
                  </div>
                ))}
                {/* Calendar days */}
                {renderCalendarDays()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getUpcomingAppointments().length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No upcoming confirmed appointments
                </p>
              ) : (
                getUpcomingAppointments().map((apt) => (
                  <div key={apt.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">{apt.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{apt.service}</p>
                      <p className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{apt.preferred_date}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{apt.preferred_time}</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;