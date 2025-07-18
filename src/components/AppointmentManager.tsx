import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Edit, Check, X, Trash2, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
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

const AppointmentManager = () => {
  const { t } = useTranslation();
  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editTime, setEditTime] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingAppointments(data || []);
    } catch (error) {
      console.error('Error fetching pending appointments:', error);
      toast({
        title: t('common.error'),
        description: t('appointmentManager.loadError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const handleAppointmentAction = async (id: string, status: string, updatedDate?: string, updatedTime?: string) => {
    try {
      setLoading(true);
      
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (updatedDate) updateData.preferred_date = updatedDate;
      if (updatedTime) updateData.preferred_time = updatedTime;

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Refresh pending appointments
      await fetchPendingAppointments();
      
      toast({
        title: t('common.success'),
        description: status === 'confirmed' ? t('appointmentManager.appointmentConfirmed') : t('appointmentManager.appointmentRejected'),
      });

      // Close edit dialog if open
      setEditingAppointment(null);
      setEditDate(undefined);
      setEditTime('');
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointmentManager.updateError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditDate(new Date(appointment.preferred_date));
    setEditTime(appointment.preferred_time);
  };

  const handleEditSave = () => {
    if (!editingAppointment || !editDate || !editTime) return;

    const formattedDate = format(editDate, 'yyyy-MM-dd');
    handleAppointmentAction(editingAppointment.id, 'confirmed', formattedDate, editTime);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          {t('appointmentManager.title')} ({pendingAppointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>{t('appointmentManager.loading')}</p>
            </div>
          ) : pendingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">{t('appointmentManager.noAppointments')}</p>
            </div>
          ) : (
            pendingAppointments.map((appointment) => (
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
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-3 w-3" />
                          <span className="text-xs">{t('appointmentManager.nationalId')}: {appointment.national_id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <p className="font-medium text-sm mb-2">{appointment.service}</p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{appointment.preferred_date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.preferred_time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div>
                      <Badge className={`${getStatusColor(appointment.status)} mb-3`}>
                        {appointment.status.toUpperCase()}
                      </Badge>
                      <div className="flex flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(appointment)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              {t('appointmentManager.editAndConfirm')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t('appointmentCalendar.editAppointment')}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Patient Details Display */}
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-medium mb-2">{t('appointmentManager.patientInfo')}</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">{t('appointmentHistory.patientName')}:</span>
                                    <span className="ml-2 font-medium">{editingAppointment?.name}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">{t('appointmentHistory.phone')}:</span>
                                    <span className="ml-2">{editingAppointment?.phone}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">{t('appointmentHistory.email')}:</span>
                                    <span className="ml-2">{editingAppointment?.email}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">{t('appointmentHistory.nationalId')}:</span>
                                    <span className="ml-2 font-mono">{editingAppointment?.national_id}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">{t('appointmentHistory.date')}</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {editDate ? format(editDate, 'PPP') : t('appointmentManager.pickDate')}
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
                                <label className="block text-sm font-medium mb-2">{t('appointmentHistory.time')}</label>
                                <Select value={editTime} onValueChange={setEditTime}>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t('appointmentManager.selectTime')} />
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
                              <div className="flex space-x-2">
                                <Button onClick={handleEditSave} className="flex-1">
                                  <Check className="h-4 w-4 mr-2" />
                                  {t('appointmentManager.confirmAppointment')}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setEditingAppointment(null)}
                                >
                                  {t('common.cancel')}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button 
                          size="sm" 
                          onClick={() => handleAppointmentAction(appointment.id, 'confirmed')}
                          disabled={loading}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {t('appointmentManager.quickConfirm')}
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-3 w-3 mr-1" />
                              {t('appointmentManager.reject')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('appointmentManager.rejectAppointment')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('appointmentManager.rejectConfirmation', { name: appointment.name })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {t('appointmentManager.reject')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {appointment.message && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                    <strong>{t('appointmentManager.message')}:</strong> {appointment.message}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentManager;