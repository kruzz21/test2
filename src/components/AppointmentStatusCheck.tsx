import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Calendar, User, Phone, Mail, FileText, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AppointmentStatusCheck = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    national_id: ''
  });
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      case 'completed':
        return '✨';
      default:
        return '📋';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.national_id) {
      toast({
        title: "Error",
        description: "Please fill in all fields to check your appointment status.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('name', formData.name)
        .eq('phone', formData.phone)
        .eq('national_id', formData.national_id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        setAppointment(data[0]);
        toast({
          title: "Appointment Found",
          description: "Your appointment details have been retrieved successfully.",
        });
      } else {
        setAppointment(null);
        toast({
          title: "No Appointment Found",
          description: "No appointment found with the provided information. Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to check appointment status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', national_id: '' });
    setAppointment(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4" onClick={resetForm}>
          <Search className="mr-2 h-4 w-4" />
          Check Appointment Status
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Check Your Appointment Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!appointment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Enter Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input 
                    placeholder="Full Name (as submitted)"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder="National ID / Passport Number"
                    value={formData.national_id}
                    onChange={(e) => handleInputChange('national_id', e.target.value)}
                    required
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Checking...' : 'Check Status'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={resetForm}
                    >
                      Clear
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="relative">
                <div className="absolute top-4 right-4">
                  <Badge className={`${getStatusColor(appointment.status)} font-medium`}>
                    {getStatusIcon(appointment.status)} {appointment.status.toUpperCase()}
                  </Badge>
                </div>
                <CardTitle className="text-xl">Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Patient Name</p>
                      <p className="font-medium">{appointment.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{appointment.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{appointment.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Service</p>
                      <p className="font-medium">{appointment.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Preferred Date</p>
                      <p className="font-medium">{appointment.preferred_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Preferred Time</p>
                      <p className="font-medium">{appointment.preferred_time}</p>
                    </div>
                  </div>
                </div>
                
                {appointment.message && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Message</p>
                    <p className="text-gray-800">{appointment.message}</p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Submitted:</strong> {new Date(appointment.created_at).toLocaleDateString()} at {new Date(appointment.created_at).toLocaleTimeString()}
                  </p>
                  {appointment.updated_at !== appointment.created_at && (
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>Last Updated:</strong> {new Date(appointment.updated_at).toLocaleDateString()} at {new Date(appointment.updated_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    Check Another Appointment
                  </Button>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentStatusCheck;