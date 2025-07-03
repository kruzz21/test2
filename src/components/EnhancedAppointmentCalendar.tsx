import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, CreditCard, Edit, Trash2, Save, X } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
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
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.preferred_date === dateString);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailDialogOpen(true);
  };

  const openEditDialog = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditDate(new Date(appointment.preferred_date));
    setEditTime(appointment.preferred_time);
    setEditFormData({
      name: appointment.name,
      phone: appointment.phone,
      email: appointment.email,
      national_id: appointment.national_id,
      service: appointment.service,
      message: appointment.message || ''
    });
    setIsDetailDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleEditFormChange = (field: string, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment || !editDate || !editTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

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
      setIsDetailDialogOpen(false);
      setIsEditDialogOpen(false);
      
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

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
      setIsDetailDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Appointment marked as ${newStatus}.`,
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

  // Generate calendar days for the current month
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Appointment Calendar
          </div>
          <div className="text-sm text-gray-600">
            {format(selectedDate, 'MMMM yyyy')}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedDate(addDays(selectedDate, -30))}
            >
              Previous Month
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(addDays(selectedDate, 30))}
            >
              Next Month
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map(day => {
              const dayAppointments = getAppointmentsForDate(day);
              const isCurrentDay = isToday(day);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    isCurrentDay ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                  } hover:bg-gray-50 transition-colors`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayAppointments.map(appointment => (
                      <div
                        key={appointment.id}
                        onClick={() => handleAppointmentClick(appointment)}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        <div className="font-medium truncate">{appointment.name}</div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.preferred_time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="text-center py-4">
              <p>Loading appointments...</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Appointment Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Status and Actions */}
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(selectedAppointment.status)}>
                  {selectedAppointment.status.toUpperCase()}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(selectedAppointment)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedAppointment.id, 'completed')}
                    >
                      Mark Complete
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
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
                    <p className="font-medium">{selectedAppointment.preferred_date}</p>
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

              {/* Service and Message */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service</p>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>
                
                {selectedAppointment.message && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Message</p>
                    <p className="text-gray-800 bg-gray-50 p-3 rounded">{selectedAppointment.message}</p>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 border-t pt-4">
                <p><strong>Created:</strong> {new Date(selectedAppointment.created_at).toLocaleString()}</p>
                <p><strong>Last Updated:</strong> {new Date(selectedAppointment.updated_at).toLocaleString()}</p>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      value={editFormData.name}
                      onChange={(e) => handleEditFormChange('name', e.target.value)}
                      placeholder="Patient name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      value={editFormData.phone}
                      onChange={(e) => handleEditFormChange('phone', e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      value={editFormData.email}
                      onChange={(e) => handleEditFormChange('email', e.target.value)}
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">National ID / Passport</label>
                    <Input
                      value={editFormData.national_id}
                      onChange={(e) => handleEditFormChange('national_id', e.target.value)}
                      placeholder="National ID or Passport number"
                    />
                  </div>
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium mb-2">Service</label>
                <Select value={editFormData.service} onValueChange={(value) => handleEditFormChange('service', value)}>
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
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Date & Time</h3>
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
                          disabled={(date) => date < new Date()}
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
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={editFormData.message}
                  onChange={(e) => handleEditFormChange('message', e.target.value)}
                  placeholder="Additional notes or message"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EnhancedAppointmentCalendar;