import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { History, User, Phone, Mail, Calendar, Clock, Search, Filter, Trash2, CreditCard } from 'lucide-react';
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .neq('status', 'pending')
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
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.phone.includes(searchTerm) ||
        appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.national_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(appointment => appointment.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const handleDeleteAppointment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'deleted' })
        .eq('id', id);

      if (error) throw error;

      await fetchAppointments();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deleted':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'rejected':
        return '❌';
      case 'completed':
        return '✨';
      case 'deleted':
        return '🗑️';
      default:
        return '📋';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Appointment History ({filteredAppointments.length})
        </CardTitle>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, phone, email, ID, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading appointment history...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No appointments match your search criteria' 
                  : 'No appointment history available'
                }
              </p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          <span className="truncate">{appointment.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-3 w-3" />
                          <span className="text-xs font-mono">{appointment.national_id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div>
                      <p className="font-medium text-sm mb-2">{appointment.service}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>{appointment.preferred_date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.preferred_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Dates */}
                    <div>
                      <Badge className={`${getStatusColor(appointment.status)} mb-2`}>
                        {getStatusIcon(appointment.status)} {appointment.status.toUpperCase()}
                      </Badge>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Created:</span>
                          <br />
                          {new Date(appointment.created_at).toLocaleDateString()} at{' '}
                          {new Date(appointment.created_at).toLocaleTimeString()}
                        </div>
                        {appointment.updated_at !== appointment.created_at && (
                          <div>
                            <span className="font-medium">Updated:</span>
                            <br />
                            {new Date(appointment.updated_at).toLocaleDateString()} at{' '}
                            {new Date(appointment.updated_at).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            View Details
                          </Button>
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
                                    <div>
                                      <span className="text-gray-600">Name:</span>
                                      <span className="ml-2 font-medium">{selectedAppointment.name}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Phone:</span>
                                      <span className="ml-2">{selectedAppointment.phone}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Email:</span>
                                      <span className="ml-2">{selectedAppointment.email}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">National ID:</span>
                                      <span className="ml-2 font-mono">{selectedAppointment.national_id}</span>
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
                                    <div>
                                      <span className="text-gray-600">Date:</span>
                                      <span className="ml-2">{selectedAppointment.preferred_date}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Time:</span>
                                      <span className="ml-2">{selectedAppointment.preferred_time}</span>
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

                      {appointment.status !== 'deleted' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this appointment for {appointment.name}? 
                                This action will mark the appointment as deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentHistory;