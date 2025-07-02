import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Hospital, MapPin, Award } from 'lucide-react';

const About = () => {
  const { t } = useTranslation();

  const timeline = [
    {
      year: '1969',
      title: 'Born in İzmir, Turkey',
      icon: MapPin,
    },
    {
      year: '1987-1993',
      title: 'Ege University Faculty of Medicine',
      icon: GraduationCap,
    },
    {
      year: '1993-1996',
      title: 'Orthopedics & Traumatology Residency',
      description: 'İzmir Tepecik Training & Research Hospital',
      icon: Hospital,
    },
    {
      year: '2000-2022',
      title: 'Afyon Kocatepe State Hospital',
      icon: Hospital,
    },
    {
      year: '2022-2025',
      title: 'Medera Hospital, Baku',
      icon: Hospital,
    },
    {
      year: '2025-Present',
      title: 'Afyon Kocatepe State Hospital',
      icon: Hospital,
    },
  ];

  const specialties = [
    'Arthroscopic Surgery',
    'Joint Replacement Surgery',
    'Trauma & Fractures',
    'Pediatric Orthopedics',
    'Sports Injuries',
    'Joint & Nerve Surgery'
  ];

  const regions = ['Turkey (Afyon)', 'Azerbaijan (Baku, Balaken, Lankaran)'];

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {/* Doctor Photo */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Dr. Gürkan Eryanılmaz"
                  className="w-full rounded-lg mb-4"
                />
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Op. Dr. Gürkan Eryanılmaz</h3>
                  <p className="text-gray-600 mb-4">Orthopedics & Traumatology Specialist</p>
                  <div className="space-y-2">
                    <Badge variant="secondary">{t('about.experience')}</Badge>
                    <br />
                    <Badge variant="secondary">{t('about.surgeries')}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography & Mission */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  {t('about.biography')}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dr. Gürkan Eryanılmaz is a highly experienced orthopedic surgeon with over 25 years of 
                  expertise in orthopedics and traumatology. Born in İzmir in 1969, he completed his 
                  medical education at Ege University Faculty of Medicine.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Throughout his distinguished career, Dr. Eryanılmaz has performed over 10,000 knee 
                  replacement surgeries, 5,000 arthroscopic procedures, and 500 pediatric hip dislocation 
                  surgeries. His expertise spans across multiple countries, having served patients in 
                  both Turkey and Azerbaijan.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Currently practicing at Afyon Kocatepe State Hospital, Dr. Eryanılmaz continues to 
                  provide world-class orthopedic care to patients from Turkey and Azerbaijan, 
                  specializing in complex joint surgeries and trauma cases.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('about.mission')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {t('about.missionText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-16 max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              {t('about.careerTimeline')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{item.year}</Badge>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      {item.description && (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Specialties & Regions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('about.areasOfExpertise')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('about.regionsServed')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{region}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;