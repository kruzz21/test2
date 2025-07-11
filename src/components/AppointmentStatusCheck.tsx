import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Calendar, User, Phone, Mail, FileText, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const AppointmentStatusCheck = () => {
  const { t } = useTranslation();
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
        title: t('common.error'),
        description: t('appointmentStatusCheck.validation.allFieldsRequired'),
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
        setAppointment(data);
        toast({
          title: t('appointmentStatusCheck.toast.foundTitle'),
          description: t('appointmentStatusCheck.toast.foundDescription'),
        });
      } else {
        setAppointment(null);
        toast({
          title: t('appointmentStatusCheck.toast.notFoundTitle'),
          description: t('appointmentStatusCheck.toast.notFoundDescription'),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking appointment:', error);
      toast({
        title: t('common.error'),
        description: t('appointmentStatusCheck.toast.checkError'),
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
          {t('appointmentStatusCheck.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            {t('appointmentStatusCheck.dialogTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!appointment ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('appointmentStatusCheck.enterInfoTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input 
                    placeholder={t('appointmentStatusCheck.form.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder={t('appointmentStatusCheck.form.phonePlaceholder')}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                  <Input 
                    placeholder={t('appointmentStatusCheck.form.nationalIdPlaceholder')}
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
                      {loading ? t('common.checking') : t('appointmentStatusCheck.form.checkStatusButton')}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={resetForm}
                    >
                      {t('common.clear')}
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
                <CardTitle className="text-xl">{t('appointmentStatusCheck.details.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.patientName')}</p>
                      <p className="font-medium">{appointment.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.phone')}</p>
                      <p className="font-medium">{appointment.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.email')}</p>
                      <p className="font-medium">{appointment.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.service')}</p>
                      <p className="font-medium">{appointment.service}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.preferredDate')}</p>
                      <p className="font-medium">{appointment.preferred_date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">{t('appointmentStatusCheck.details.preferredTime')}</p>
                      <p className="font-medium">{appointment.preferred_time}</p>
                    </div>
                  </div>
                </div>
                
                {appointment.message && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">{t('appointmentStatusCheck.details.message')}</p>
                    <p className="text-gray-800">{appointment.message}</p>
                  </div>
                )}
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{t('appointmentStatusCheck.details.submitted')}:</strong> {new Date(appointment.created_at).toLocaleDateString()} {t('common.at')} {new Date(appointment.created_at).toLocaleTimeString()}
                  </p>
                  {appointment.updated_at !== appointment.created_at && (
                    <p className="text-sm text-blue-800 mt-1">
                      <strong>{t('appointmentStatusCheck.details.lastUpdated')}:</strong> {new Date(appointment.updated_at).toLocaleDateString()} {t('common.at')} {new Date(appointment.updated_at).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-6">
                  <Button 
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1"
                  >
                    {t('appointmentStatusCheck.details.checkAnother')}
                  </Button>
                  <Button 
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    {t('common.close')}
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