import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Search, Filter, Trash2, Calendar, User, Phone, Mail } from 'lucide-react';
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

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .in('status', ['confirmed', 'rejected', 'completed'])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
      setFilteredAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointment history:', error);
      toast({
        title: "Error",
        description: "Failed to load appointment history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.phone.includes(searchTerm) ||
        apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.preferred_date);
            return aptDate.toDateString() === filterDate.toDateString();
          });
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.preferred_date);
            return aptDate >= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.preferred_date);
            return aptDate >= filterDate;
          });
          break;
        case 'upcoming':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.preferred_date);
            return aptDate >= today;
          });
          break;
        case 'past':
          filtered = filtered.filter(apt => {
            const aptDate = new Date(apt.preferred_date);
            return aptDate < today;
          });
          break;
      }
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAppointments(prev => prev.filter(apt => apt.id !== id));
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
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Appointment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={clearFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredAppointments.length} of {appointments.length} appointments
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading appointment history...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Patient Info */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{appointment.name}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{appointment.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <p className="font-medium text-sm mb-2">{appointment.service}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{appointment.preferred_date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🕐</span>
                          <span>{appointment.preferred_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Dates */}
                    <div>
                      <Badge className={`${getStatusColor(appointment.status)} mb-2`}>
                        {appointment.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Created: {new Date(appointment.created_at).toLocaleDateString()}</p>
                        <p>Updated: {new Date(appointment.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="ml-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to permanently delete this appointment for {appointment.name}? 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteAppointment(appointment.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {/* Message */}
                {appointment.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <strong>Message:</strong> {appointment.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentHistory;