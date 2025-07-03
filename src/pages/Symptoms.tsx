import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Symptoms = () => {
  const { t } = useTranslation();

  // Placeholder symptoms data
  const symptoms = [
    {
      id: 'knee-pain',
      title: 'Knee Pain & Arthritis',
      description: 'Comprehensive treatment options for knee pain, arthritis, and joint problems',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'shoulder-injuries',
      title: 'Shoulder Injuries',
      description: 'Treatment for rotator cuff tears, shoulder impingement, and dislocations',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'hip-problems',
      title: 'Hip Problems',
      description: 'Hip replacement, hip arthritis, and developmental hip dysplasia treatment',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'sports-injuries',
      title: 'Sports Injuries',
      description: 'ACL tears, meniscus injuries, and athletic rehabilitation programs',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'fractures',
      title: 'Fractures & Trauma',
      description: 'Emergency fracture care and complex trauma surgery',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'pediatric-conditions',
      title: 'Pediatric Conditions',
      description: 'Specialized care for children with orthopedic conditions',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('symptoms.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('symptoms.subtitle')}
          </p>
        </div>

        {/* Symptoms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {symptoms.map((symptom) => (
            <Card key={symptom.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={symptom.image}
                  alt={symptom.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{symptom.title}</CardTitle>
                <CardDescription className="text-base">
                  {symptom.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/symptoms/${symptom.id}`}>
                    {t('symptoms.readMore')}
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
              <h2 className="text-2xl font-bold mb-4">{t('symptoms.dontSeeCondition')}</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {t('symptoms.conditionDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">
                    {t('symptoms.scheduleConsultation')}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/faq">
                    {t('reviews.viewFaq')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Symptoms;