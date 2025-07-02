import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule your consultation with Dr. Gürkan Eryanılmaz
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Appointment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('contact.appointmentForm')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder={t('contact.name')}
                  required
                />
                <Input 
                  placeholder={t('contact.phone')}
                  type="tel"
                  required
                />
              </div>
              
              <Input 
                placeholder={t('contact.email')}
                type="email"
                required
              />
              
              <Input 
                placeholder={t('contact.nationalId')}
                required
              />
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={t('contact.service')} />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder={t('contact.preferredDate')}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contact.preferredTime')} />
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
              
              <Textarea 
                placeholder={t('contact.message')}
                rows={4}
              />
              
              <Button className="w-full" size="lg">
                {t('contact.submit')}
              </Button>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> {t('contact.note')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('contact.contactInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.address')}</h3>
                    <p className="text-gray-600">
                      Afyon Kocatepe Devlet Hastanesi<br />
                      Ortopedi ve Travmatoloji Kliniği<br />
                      Afyon, Turkey
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a 
                      href="tel:+994553977874" 
                      className="text-blue-600 hover:underline"
                    >
                      +994 55 397 78 74
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a 
                      href="mailto:info@drgeryanilmaz.com" 
                      className="text-blue-600 hover:underline"
                    >
                      info@drgeryanilmaz.com
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{t('contact.officeHours')}</h3>
                    <div className="text-gray-600">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 9:00 AM - 1:00 PM</p>
                      <p>Sunday: Emergency Only</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">{t('contact.followUs')}</h3>
                  <div className="flex space-x-4">
                    <a 
                      href="https://instagram.com/uzmantravmatolojiortoped" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>@uzmantravmatolojiortoped</span>
                    </a>
                  </div>
                  <div className="mt-2">
                    <a 
                      href="https://tiktok.com/@opdrgeryanilmaz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-pink-600 hover:text-pink-700"
                    >
                      <span className="font-bold">TT</span>
                      <span>@opdrgeryanilmaz</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.location')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">
                    Google Maps Integration<br />
                    Afyon Kocatepe Devlet Hastanesi
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-12">
                <a 
                  href="https://wa.me/994553977874" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="h-12">
                <a href="tel:+994553977874">
                  Call Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;