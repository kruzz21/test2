import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart, CheckCircle, Play, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  const surgicalStats = [
    { 
      key: 'kneeReplacements', 
      value: '10,000+', 
      icon: Activity,
      title: 'Knee Replacements'
    },
    { 
      key: 'fracturesSurgeries', 
      value: '5,000+', 
      icon: Award,
      title: 'Fracture Surgeries'
    },
    { 
      key: 'arthroscopies', 
      value: '5,000+', 
      icon: Users,
      title: 'Arthroscopic Procedures'
    },
    { 
      key: 'pediatricHip', 
      value: '500+', 
      icon: Heart,
      title: 'Pediatric Hip Surgeries'
    },
    { 
      key: 'clubfootCorrections', 
      value: '350+', 
      icon: Star,
      title: 'Clubfoot Corrections'
    },
  ];

  const symptoms = [
    {
      id: 'knee-pain',
      title: 'Knee Pain',
      description: 'Comprehensive treatment for knee arthritis and joint problems',
      icon: '🦵'
    },
    {
      id: 'shoulder-injuries',
      title: 'Shoulder Injuries',
      description: 'Expert care for rotator cuff tears and shoulder conditions',
      icon: '💪'
    },
    {
      id: 'hip-problems',
      title: 'Hip Problems',
      description: 'Advanced hip replacement and dysplasia treatment',
      icon: '🦴'
    },
    {
      id: 'pediatric-conditions',
      title: 'Pediatric Orthopedic Issues',
      description: 'Specialized care for children\'s orthopedic conditions',
      icon: '👶'
    }
  ];

  const expertiseAreas = [
    'Arthroscopic Surgery',
    'Joint Replacement Surgery',
    'Trauma & Fracture Surgery',
    'Pediatric Orthopedics',
    'Sports Injuries & Rehabilitation',
    'Joint & Nerve Surgery'
  ];

  // Mock blog posts for preview
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Knee Replacement Surgery',
      excerpt: 'Learn about the latest techniques in knee replacement and what to expect during recovery.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Pediatric Hip Dysplasia Treatment',
      excerpt: 'Early detection and treatment options for developmental hip dysplasia in children.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Sports Injury Prevention',
      excerpt: 'Essential tips for athletes to prevent common orthopedic injuries.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      date: '2024-01-05'
    }
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Integrated Cards */}
      <section className="relative w-full">
        {/* Main Hero Content */}
        <div 
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
              <p className="text-lg md:text-xl mb-8 text-blue-200 max-w-2xl mx-auto">
                {t('hero.description')}
              </p>
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link to="/contact">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Integrated Quick Action Cards */}
        <div className="relative -mt-16 w-full px-4 lg:px-8 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Second Opinion Card */}
              <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-900 mb-3">
                        {t('home.secondOpinion.title')}
                      </h3>
                      <p className="text-blue-700 mb-6 leading-relaxed">
                        {t('home.secondOpinion.description')}
                      </p>
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
                        {t('home.secondOpinion.button')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Telemedicine Card */}
              <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-3">
                        {t('home.telemedicine.title')}
                      </h3>
                      <p className="text-green-700 mb-6 leading-relaxed">
                        {t('home.telemedicine.description')}
                      </p>
                      <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300">
                        {t('home.telemedicine.button')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  {t('home.about.title')}
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  {t('home.about.subtitle')}
                </p>
                <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                  Dr. Gürkan Eryanılmaz is a highly experienced orthopedic surgeon with over 25 years of 
                  expertise in orthopedics and traumatology. Throughout his distinguished career, he has 
                  performed thousands of successful surgeries and helped patients from Turkey and Azerbaijan 
                  regain their mobility and quality of life.
                </p>

                {/* Areas of Expertise */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Areas of Expertise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {expertiseAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild variant="outline" size="lg">
                  <Link to="/about">
                    {t('home.about.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Dr. Gürkan Eryanılmaz"
                    className="rounded-lg shadow-xl w-full h-[500px] object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surgical Experience Section */}
      <section 
        className="py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white w-full relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('home.surgicalExperience.title')}
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Over 25 years of proven excellence in orthopedic surgery with thousands of successful procedures
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {surgicalStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.key} className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardContent className="pt-8 pb-6">
                      <div className="mb-4">
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {stat.value}
                        </div>
                        <h3 className="text-lg font-semibold text-blue-100">
                          {stat.title}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Achievement Badge */}
            <div className="text-center">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link to="/about">
                  <Award className="mr-2 h-5 w-5" />
                  {t('home.surgicalExperience.button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.gallery.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                {t('home.gallery.subtitle')}
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Featured Video */}
              <div className="lg:col-span-2 lg:row-span-2">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="relative h-full min-h-[300px]">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Dr. Eryanılmaz in surgery"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="bg-white bg-opacity-90 rounded-full p-4 mb-4 mx-auto w-fit">
                          <Play className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Patient Recovery Stories</h3>
                        <p className="text-sm">Watch real patient testimonials</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Gallery Images */}
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Modern surgical facility"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Patient consultation"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Pediatric care"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>

              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="Sports medicine"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/gallery">
                  {t('home.gallery.button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms & Treatments Section */}
      <section className="py-20 bg-slate-50 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.symptoms.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn about common orthopedic conditions and their treatments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {symptoms.map((symptom) => (
                <Card key={symptom.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{symptom.icon}</div>
                    <CardTitle className="text-xl">{symptom.title}</CardTitle>
                    <CardDescription className="text-base">
                      {symptom.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/symptoms/${symptom.id}`}>
                        {t('home.symptoms.button')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-20 bg-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('home.blog.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stay informed with the latest insights and medical updates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Article
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        Dr. Gürkan Eryanılmaz
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/blog/${post.id}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/blog">
                  {t('home.blog.button')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white w-full">
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