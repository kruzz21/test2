import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import AppointmentStatusCheck from '@/components/AppointmentStatusCheck';
import EnhancedAppointmentForm from '@/components/EnhancedAppointmentForm';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Enhanced Appointment Form */}
          <EnhancedAppointmentForm />

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
                    <h3 className="font-semibold mb-1">{t('contact.phone')}</h3>
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
                    <h3 className="font-semibold mb-1">{t('contact.email')}</h3>
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
                      <p>{t('contact.hours.mondayFriday')}</p>
                      <p>{t('contact.hours.saturday')}</p>
                      <p>{t('contact.hours.sunday')}</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">{t('contact.followUs')}</h3>
                  <div className="space-y-3">
                    <a 
                      href="https://instagram.com/uzmantravmatolojiortoped" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-pink-400" />
                      <span>@uzmantravmatolojiortoped</span>
                    </a>
                    <a 
                      href="https://tiktok.com/@opdrgeryanilmaz" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors"
                    >
                      <span className="h-5 w-5 text-pink-400 font-bold">TT</span>
                      <span>@opdrgeryanilmaz</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Status Check */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.checkAppointment.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t('contact.checkAppointment.description')}
                </p>
                <AppointmentStatusCheck />
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
                    {t('contact.mapPlaceholder.line1')}<br />
                    {t('contact.mapPlaceholder.line2')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Contact;