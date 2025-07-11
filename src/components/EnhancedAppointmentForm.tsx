import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays, isAfter, startOfDay } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const EnhancedAppointmentForm = () => {
  const { t } = useTranslation();
  const { createAppointment, loading } = useAppointments();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    national_id: '',
    service: '',
    message: ''
  });
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const serviceOptions = [
    { id: 'arthroscopic-surgery', labelKey: 'expertise.arthroscopic.title' },
    { id: 'joint-replacement', labelKey: 'expertise.jointReplacement.title' },
    { id: 'trauma-fracture', labelKey: 'expertise.trauma.title' },
    { id: 'pediatric-orthopedics', labelKey: 'expertise.pediatric.title' },
    { id: 'sports-injuries', labelKey: 'expertise.sports.title' },
    { id: 'joint-nerve', labelKey: 'expertise.jointNerve.title' },
    { id: 'general-consultation', labelKey: 'appointmentForm.services.generalConsultation' }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  // Fetch booked slots for selected date
  const fetchBookedSlots = async (date: Date) => {
    try {
      setLoadingSlots(true);
      const dateString = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('preferred_time')
        .eq('preferred_date', dateString)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;
      
      const booked = data.map(apt => apt.preferred_time);
      setBookedSlots(booked);
    } catch (error) {
      console.error('Error fetching booked slots:', error);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Update booked slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.email || !formData.national_id || 
        !formData.service || !selectedDate || !selectedTime) {
      toast({
        title: t('common.error'),
        description: t('appointmentForm.validation.allFieldsRequired'),
        variant: "destructive",
      });
      return;
    }

    // Check if selected time is available
    if (bookedSlots.includes(selectedTime)) {
      toast({
        title: t('common.error'),
        description: t('appointmentForm.validation.timeTaken'),
        variant: "destructive",
      });
      return;
    }

    try {
      const appointmentData = {
        ...formData,
        service: serviceOptions.find(opt => opt.id === formData.service)?.labelKey 
          ? t(serviceOptions.find(opt => opt.id === formData.service)!.labelKey)
          : formData.service,
        preferred_date: format(selectedDate, 'yyyy-MM-dd'),
        preferred_time: selectedTime
      };

      await createAppointment(appointmentData);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        national_id: '',
        service: '',
        message: ''
      });
      setSelectedDate(undefined);
      setSelectedTime('');
      setBookedSlots([]);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return !isAfter(date, addDays(today, -1)); // Disable past dates
  };

  const isTimeSlotBooked = (time: string) => {
    return bookedSlots.includes(time);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('appointmentForm.title')}</CardTitle>
        <p className="text-gray-600">{t('appointmentForm.subtitle')}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('appointmentForm.personalInfo.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                placeholder={t('appointmentForm.personalInfo.fullNamePlaceholder')}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              <Input 
                placeholder={t('appointmentForm.personalInfo.phonePlaceholder')}
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <Input 
              placeholder={t('appointmentForm.personalInfo.emailPlaceholder')}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
            
            <Input 
              placeholder={t('appointmentForm.personalInfo.nationalIdPlaceholder')}
              value={formData.national_id}
              onChange={(e) => handleInputChange('national_id', e.target.value)}
              required
            />
          </div>

          {/* Service Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('appointmentForm.serviceSelection.title')}</h3>
            <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('appointmentForm.serviceSelection.placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('appointmentForm.dateTimeSelection.title')}</h3>
            
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">{t('appointmentForm.dateTimeSelection.selectDate')}</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'EEEE, MMMM do, yyyy') : t('appointmentForm.dateTimeSelection.chooseDatePlaceholder')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                    className="rounded-md border"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('appointmentForm.dateTimeSelection.selectTime')}
                  {loadingSlots && <span className="text-sm text-gray-500 ml-2">({t('appointmentForm.dateTimeSelection.loadingTimes')})</span>}
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const isBooked = isTimeSlotBooked(time);
                    const isSelected = selectedTime === time;
                    
                    return (
                      <Button
                        key={time}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        className={`h-12 ${
                          isBooked 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                            : isSelected 
                              ? 'bg-blue-600 text-white' 
                              : 'hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => !isBooked && handleTimeSelect(time)}
                        disabled={isBooked || loadingSlots}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                        {isBooked && <span className="ml-1 text-xs">({t('appointmentForm.dateTimeSelection.booked')})</span>}
                      </Button>
                    );
                  })}
                </div>
                {selectedDate && bookedSlots.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('appointmentForm.dateTimeSelection.bookedTimesMessage')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Additional Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('appointmentForm.additionalInfo.title')}</h3>
            <Textarea 
              placeholder={t('appointmentForm.additionalInfo.placeholder')}
              rows={4}
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg" 
            disabled={loading || !selectedDate || !selectedTime}
          >
            {loading ? t('common.submitting') : t('appointmentForm.submitButton')}
          </Button>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{t('appointmentForm.note.title')}:</strong> {t('appointmentForm.note.description')}
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedAppointmentForm;