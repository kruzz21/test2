import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Stethoscope, Bone, Heart, Baby, Activity, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const AreasOfExpertise = () => {
  const { t } = useTranslation();

  const expertiseAreas = [
    {
      id: 'arthroscopic-surgery',
      title: t('expertise.arthroscopic.title'),
      description: t('expertise.arthroscopic.description'),
      icon: Stethoscope,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'joint-replacement',
      title: t('expertise.jointReplacement.title'),
      description: t('expertise.jointReplacement.description'),
      icon: Bone,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'trauma-fracture',
      title: t('expertise.trauma.title'),
      description: t('expertise.trauma.description'),
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-red-50 text-red-600'
    },
    {
      id: 'pediatric-orthopedics',
      title: t('expertise.pediatric.title'),
      description: t('expertise.pediatric.description'),
      icon: Baby,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'sports-injuries',
      title: t('expertise.sports.title'),
      description: t('expertise.sports.description'),
      icon: Activity,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'joint-nerve',
      title: t('expertise.jointNerve.title'),
      description: t('expertise.jointNerve.description'),
      icon: Brain,
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('expertise.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('expertise.subtitle')}
          </p>
        </div>

        {/* Expertise Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {expertiseAreas.map((area) => {
            const IconComponent = area.icon;
            
            return (
              <Card key={area.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className={`absolute top-4 left-4 w-12 h-12 ${area.color} rounded-xl flex items-center justify-center backdrop-blur-sm bg-white/90 shadow-lg`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {area.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  <Button asChild className="w-full group-hover:bg-blue-700 transition-colors">
                    <Link to={`/expertise/${area.id}`}>
                      {t('expertise.viewDetails')}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Final CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 max-w-4xl mx-auto">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {t('expertise.notSureTitle')}
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                {t('expertise.notSureDescription')}
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-3">
                <Link to="/contact">
                  {t('expertise.bookConsultation')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AreasOfExpertise;