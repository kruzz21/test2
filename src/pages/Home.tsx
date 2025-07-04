import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  const surgicalStats = [
    { 
      key: 'kneeReplacements', 
      value: '10,000+', 
      icon: Activity,
      subtitle: 'Total and partial knee replacements with excellent outcomes'
    },
    { 
      key: 'fracturesSurgeries', 
      value: '5,000+', 
      icon: Award,
      subtitle: 'Complex fracture repairs and trauma surgeries'
    },
    { 
      key: 'arthroscopies', 
      value: '5,000+', 
      icon: Users,
      subtitle: 'Minimally invasive arthroscopic procedures'
    },
    { 
      key: 'pediatricHip', 
      value: '500+', 
      icon: Heart,
      subtitle: 'Pediatric hip dysplasia and developmental surgeries'
    },
    { 
      key: 'clubfootCorrections', 
      value: '350+', 
      icon: Star,
      subtitle: 'Clubfoot corrections using advanced techniques'
    },
  ];

  const services = [
    {
      title: t('services.arthroscopy.title'),
      description: t('services.arthroscopy.description'),
      icon: '🔍',
    },
    {
      title: t('services.replacement.title'),
      description: t('services.replacement.description'),
      icon: '🦴',
    },
    {
      title: t('services.trauma.title'),
      description: t('services.trauma.description'),
      icon: '🏥',
    },
    {
      title: t('services.pediatric.title'),
      description: t('services.pediatric.description'),
      icon: '👶',
    },
    {
      title: t('services.sports.title'),
      description: t('services.sports.description'),
      icon: '⚽',
    },
    {
      title: t('services.nerve.title'),
      description: t('services.nerve.description'),
      icon: '🧠',
    },
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20 md:py-32 w-full"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-blue-100">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            {/* Updated Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                {t('home.hero.badge.born')}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                {t('home.hero.badge.education')}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                {t('home.hero.badge.residency')}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                {t('home.hero.badge.current')}
              </Badge>
            </div>
            
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              <Link to="/contact">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Surgical Experience Stats Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Surgical Experience at a Glance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Over 25 years of proven excellence in orthopedic surgery with thousands of successful procedures
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {surgicalStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.key} className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white shadow-md">
                    <CardContent className="pt-8 pb-6">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                          {stat.value}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {stat.key === 'kneeReplacements' && 'Knee Replacements'}
                          {stat.key === 'fracturesSurgeries' && 'Fracture Surgeries'}
                          {stat.key === 'arthroscopies' && 'Arthroscopic Procedures'}
                          {stat.key === 'pediatricHip' && 'Pediatric Hip Surgeries'}
                          {stat.key === 'clubfootCorrections' && 'Clubfoot Corrections'}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {stat.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Achievement Badge */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3">
                <Award className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  25+ Years of Surgical Excellence
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('about.title')}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.subtitle')}
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{t('about.experience')}</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">{t('about.surgeries')}</Badge>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link to="/about">
                  {t('about.learnMore')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dr. Gürkan Eryanılmaz"
                className="rounded-lg shadow-lg w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-slate-50 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('services.title')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl mb-2">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/services">
                {t('home.viewAllServices')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {t('home.ctaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link to="/contact">
                  {t('home.bookAppointment')}
                  <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                <a href="tel:+994553977874">
                  {t('home.callNow')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;