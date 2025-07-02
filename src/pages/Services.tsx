import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t('services.arthroscopy.title'),
      description: t('services.arthroscopy.description'),
      icon: '🔍',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Knee Arthroscopy',
        'Shoulder Arthroscopy', 
        'Elbow Arthroscopy',
        'ACL Reconstruction',
        'Meniscus Repair',
        'Bankart Repair',
        'Impingement Syndrome'
      ]
    },
    {
      title: t('services.replacement.title'),
      description: t('services.replacement.description'),
      icon: '🦴',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Total Knee Replacement',
        'Hip Replacement',
        'Shoulder Replacement',
        'Revision Surgery',
        'Minimally Invasive Techniques'
      ]
    },
    {
      title: t('services.trauma.title'),
      description: t('services.trauma.description'),
      icon: '🏥',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Ankle Fractures',
        'Hip Fractures',
        'Elbow Fractures',
        'Femur Fractures',
        'Complex Trauma Surgery',
        'Emergency Procedures'
      ]
    },
    {
      title: t('services.pediatric.title'),
      description: t('services.pediatric.description'),
      icon: '👶',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Developmental Dysplasia of Hip (DDH)',
        'Clubfoot Treatment',
        'Shoulder Dislocation',
        'Growth Plate Injuries',
        'Pediatric Fractures'
      ]
    },
    {
      title: t('services.sports.title'),
      description: t('services.sports.description'),
      icon: '⚽',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Achilles Tendon Injuries',
        'Ligament Injuries',
        'Overuse Injuries',
        'Sports Rehabilitation',
        'Return to Play Protocols'
      ]
    },
    {
      title: t('services.nerve.title'),
      description: t('services.nerve.description'),
      icon: '🧠',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      details: [
        'Carpal Tunnel Syndrome',
        'Nerve Decompression',
        'Intra-articular Injections',
        'Joint Injections',
        'Pain Management'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive orthopedic surgical services with over 25 years of experience
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                    {service.icon}
                  </div>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.title}</CardTitle>
                <CardDescription className="text-base">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  {service.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                      {detail}
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full">
                  <Link to="/contact">
                    Book Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-50 border-blue-200 max-w-4xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl font-bold mb-4">{t('services.needConsultation')}</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t('services.consultationDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">
                    {t('services.scheduleAppointment')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+994553977874">
                    {t('services.callNow')}: +994 55 397 78 74
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;