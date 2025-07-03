import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Edit, Check, X, Trash2, CreditCard, Bell, AlertCircle } from 'lucide-react';
import { format, addDays, isAfter, startOfDay, isSameDay, parseISO, isToday, isTomorrow, addWeeks } from 'date-fns';
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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editTime, setEditTime] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    national_id: '',
    service: '',
    message: ''
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const services = [
    'Arthroscopic Surgery',
    'Joint Replacement Surgery',
    'Trauma & Fractures',
    'Pediatric Orthopedics',
    'Sports Injuries',
    'Joint & Nerve Surgery',
    'General Consultation'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

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

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(parseISO(appointment.preferred_date), date)
    );
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    const nextWeek = addWeeks(today, 1);
    
    return appointments
      .filter(appointment => {
        const appointmentDate = parseISO(appointment.preferred_date);
        return isAfter(appointmentDate, today) && appointmentDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.preferred_date).getTime() - new Date(b.preferred_date).getTime())
      .slice(0, 5); // Show next 5 upcoming appointments
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

  const getAppointmentCardColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'completed':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditDate(parseISO(appointment.preferred_date));
    setEditTime(appointment.preferred_time);
    setEditFormData({
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email,
      national_id: appointment.national_id,
      service: appointment.service,
      message: appointment.message || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment || !editDate || !editTime) return;

    try {
      setLoading(true);
      
      const updateData = {
        ...editFormData,
        preferred_date: format(editDate, 'yyyy-MM-dd'),
        preferred_time: editTime,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', editingAppointment.id);

      if (error) throw error;

      await fetchAppointments();
      setIsEditDialogOpen(false);
      setEditingAppointment(null);
      
      toast({
        title: "Success",
        description: "Appointment updated successfully.",
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'deleted',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
      setIsDetailsDialogOpen(false);
      setSelectedAppointment(null);
      
      toast({
        title: "Success",
        description: "Appointment deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (appointmentId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
      setIsDetailsDialogOpen(false);
      setSelectedAppointment(null);
      
      toast({
        title: "Success",
        description: "Appointment marked as completed.",
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Appointment Calendar
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Completed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Calendar */}
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasAppointments: (date) => getAppointmentsForDate(date).length > 0
                  }}
                  modifiersStyles={{
                    hasAppointments: { 
                      backgroundColor: '#dbeafe', 
                      fontWeight: 'bold',
                      color: '#1e40af'
                    }
                  }}
                />
              </div>

              {/* Appointments for Selected Date */}
              <div>
                <h3 className="font-semibold mb-4">
                  Appointments for {format(selectedDate, 'MMMM dd, yyyy')}
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center py-4">
                      <p>Loading appointments...</p>
                    </div>
                  ) : getAppointmentsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No appointments for this date</p>
                    </div>
                  ) : (
                    getAppointmentsForDate(selectedDate).map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getAppointmentCardColor(appointment.status)}`}
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsDetailsDialogOpen(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <Clock className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">{appointment.preferred_time}</span>
                              <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                                {appointment.status.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">{appointment.name}</span>
                            </div>
                            <p className="text-sm text-gray-600">{appointment.service}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments Sidebar */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getUpcomingAppointments().length === 0 ? (
                <div className="text-center py-4">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No upcoming appointments</p>
                </div>
              ) : (
                getUpcomingAppointments().map((appointment) => (
                  <div 
                    key={appointment.id}
                    className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getAppointmentCardColor(appointment.status)}`}
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDetailsDialogOpen(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDateForDisplay(appointment.preferred_date)}
                      </div>
                      <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                        {appointment.status === 'confirmed' ? 'CONF' : 'COMP'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-sm font-medium">{appointment.preferred_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{appointment.name}</span>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {appointment.service}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(selectedAppointment.status)} font-medium`}>
                  {selectedAppointment.status.toUpperCase()}
                </Badge>
                <div className="text-sm text-gray-500">
                  Last updated: {format(new Date(selectedAppointment.updated_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>

              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-medium">{selectedAppointment.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedAppointment.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedAppointment.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">National ID</p>
                    <p className="font-medium font-mono">{selectedAppointment.national_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{format(parseISO(selectedAppointment.preferred_date), 'MMMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{selectedAppointment.preferred_time}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Service</p>
                <p className="font-medium text-lg">{selectedAppointment.service}</p>
              </div>
              
              {/* Message */}
              {selectedAppointment.message && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Message</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-800">{selectedAppointment.message}</p>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button 
                  onClick={() => handleEditAppointment(selectedAppointment)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Appointment
                </Button>
                
                {selectedAppointment.status === 'confirmed' && (
                  <Button 
                    onClick={() => handleMarkCompleted(selectedAppointment.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark Completed
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this appointment for {selectedAppointment.name}? 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {editingAppointment && (
            <div className="space-y-6">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Patient Name</label>
                  <Input
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">National ID</label>
                  <Input
                    value={editFormData.national_id}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, national_id: e.target.value }))}
                    placeholder="National ID / Passport"
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select 
                  value={editFormData.service} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, service: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editDate ? format(editDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        disabled={(date) => date < startOfDay(new Date())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Select value={editTime} onValueChange={setEditTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={editFormData.message}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Additional notes or message"
                  rows={3}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  onClick={handleSaveEdit}
                  disabled={loading || !editDate || !editTime}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedAppointmentCalendar;