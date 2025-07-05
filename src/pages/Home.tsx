import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart, CheckCircle, Play, FileText, User, Phone, MessageCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import MediaGallery from '@/components/MediaGallery';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { blogPosts, loading: blogLoading, error: blogError, fetchBlogPosts } = useBlog();

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

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

  const handleBlogRetry = () => {
    fetchBlogPosts();
  };

  // Get the first 3 blog posts for preview
  const previewBlogPosts = blogPosts.slice(0, 3);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Integrated Cards */}
      <section className="relative w-full">
        {/* Main Hero Content */}
        <div 
          className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-32 w-full"
          style={{
            backgroundImage: 'url(https://cdn.discordapp.com/attachments/1114334300532383895/1391141966820933692/xbb.png?ex=686ad16b&is=68697feb&hm=30da3f194bfe41eebedcfbee8eee29958ac5619038a01e5c0562c2adcc5d5247&)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Transparent black overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          
          <div className="relative z-10 w-full px-5 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-2xl mb-3 md:mb-4 text-blue-100">
                {t('hero.subtitle')}
              </p>
              <p className="text-base md:text-xl mb-6 md:mb-8 text-blue-200 max-w-2xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                <Link to="/contact">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Integrated Quick Action Cards - Mobile Responsive */}
        <div className="relative -mt-6 md:-mt-16 w-full px-5 md:px-8 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {/* Contact Us Card */}
              <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-5 md:p-8">
                  <div className="flex items-start space-x-4 md:space-x-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Phone className="h-5 w-5 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-blue-900 mb-2 md:mb-3">
                        {t('home.contactUs.title')}
                      </h3>
                      <p className="text-sm md:text-base text-blue-700 mb-4 md:mb-6 leading-relaxed">
                        {t('home.contactUs.description')}
                      </p>
                      {/* Fixed button layout - always side by side */}
                      <div className="flex gap-2 md:gap-3">
                        <Button 
                          asChild 
                          size="sm" 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-2 min-w-0"
                        >
                          <a href="tel:+994553977874" className="flex items-center justify-center">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="truncate">{t('home.contactUs.call')}</span>
                          </a>
                        </Button>
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="flex-1 border-green-600 text-green-600 hover:bg-green-600 hover:text-white text-xs sm:text-sm md:text-base px-2 sm:px-3 py-2 min-w-0"
                        >
                          <a 
                            href="https://wa.me/994553977874" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="truncate">WhatsApp</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Appointment Card */}
              <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-5 md:p-8">
                  <div className="flex items-start space-x-4 md:space-x-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Calendar className="h-5 w-5 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-green-900 mb-2 md:mb-3">
                        {t('home.appointment.title')}
                      </h3>
                      <p className="text-sm md:text-base text-green-700 mb-4 md:mb-6 leading-relaxed">
                        {t('home.appointment.description')}
                      </p>
                      <Button 
                        asChild 
                        size="sm" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
                      >
                        <Link to="/contact">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          {t('home.appointment.button')}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Responsive Image */}
      <section className="py-16 md:py-20 bg-white w-full">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Mobile-first layout: Image first, then content */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              {/* Doctor Image - Mobile First */}
              <div className="relative mb-8 lg:mb-0 lg:order-2">
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=1600&q=80"
                    alt="Dr. Gürkan Eryanılmaz"
                    className="w-full aspect-[3/4] object-cover rounded-lg shadow-xl transition-transform duration-300 hover:scale-[1.02]"
                    style={{
                      objectPosition: 'center 20%'
                    }}
                    onError={(e) => {
                      // Fallback to placeholder if doctor-portrait.jpg is not found
                      e.currentTarget.src = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=1600&q=80";
                    }}
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-blue-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 w-20 h-20 md:w-32 md:h-32 bg-blue-300 rounded-full opacity-20"></div>
              </div>

              {/* Content - Mobile Second */}
              <div className="lg:order-1">
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                  {t('home.about.whoIsTitle')}
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-4 md:mb-6 leading-relaxed">
                  {t('home.about.subtitle')}
                </p>
                
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {t('home.about.paragraph1')}
                  </p>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {t('home.about.paragraph2')}
                  </p>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {t('home.about.paragraph3')}
                  </p>
                </div>

                {/* Areas of Expertise */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Areas of Expertise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {expertiseAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-700">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/about">
                    {t('home.about.button')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surgical Experience Section */}
      <section 
        className="py-16 md:py-20 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white w-full relative"
        style={{
          backgroundImage: 'url(https://cdn.discordapp.com/attachments/1114334300532383895/1391141966820933692/xbb.png?ex=686ad16b&is=68697feb&hm=30da3f194bfe41eebedcfbee8eee29958ac5619038a01e5c0562c2adcc5d5247&)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                {t('home.surgicalExperience.title')}
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Over 25 years of proven excellence in orthopedic surgery with thousands of successful procedures
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
              {surgicalStats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.key} className="text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                    <CardContent className="pt-6 pb-5 md:pt-8 md:pb-6">
                      <div className="mb-3 md:mb-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4">
                          <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
                          {stat.value}
                        </div>
                        <h3 className="text-sm md:text-lg font-semibold text-blue-100 leading-tight">
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
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-base">
                <Link to="/about">
                  <Award className="mr-2 h-5 w-5" />
                  {t('home.surgicalExperience.button')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery Section - Replaced Gallery Preview */}
      <section className="py-16 md:py-20 bg-white w-full">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                {t('home.gallery.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
                {t('home.gallery.subtitle')}
              </p>
            </div>

            {/* MediaGallery Component */}
            <MediaGallery />
          </div>
        </div>
      </section>

      {/* Symptoms & Treatments Section */}
      <section className="py-16 md:py-20 bg-slate-50 w-full">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                {t('home.symptoms.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Learn about common orthopedic conditions and their treatments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {symptoms.map((symptom) => (
                <Card key={symptom.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="text-3xl md:text-4xl mb-3 md:mb-4">{symptom.icon}</div>
                    <CardTitle className="text-lg md:text-xl leading-tight">{symptom.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base leading-relaxed">
                      {symptom.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full text-sm md:text-base">
                      <Link to={`/symptoms/${symptom.id}`}>
                        {t('home.symptoms.button')}
                        <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
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
      <section className="py-16 md:py-20 bg-white w-full">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                {t('home.blog.title')}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Stay informed with the latest insights and medical updates
              </p>
            </div>

            {/* Blog Posts Content */}
            {blogLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading latest articles...</p>
              </div>
            ) : blogError ? (
              <div className="text-center py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Failed to Load Blog Posts
                  </h3>
                  <p className="text-red-600 mb-4 text-sm">{blogError}</p>
                  <Button onClick={handleBlogRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            ) : previewBlogPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    No Blog Posts Available
                  </h3>
                  <p className="text-gray-600">
                    Check back later for new articles and insights from Dr. Eryanılmaz.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                {previewBlogPosts.map((post: any) => {
                  // Use multilingual content based on current language
                  const title = post[`title${langSuffix}`] || post.title_en;
                  const excerpt = post[`excerpt${langSuffix}`] || post.excerpt_en;

                  return (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-40 md:h-48">
                        <img
                          src={post.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Article
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <CardTitle className="text-base md:text-lg line-clamp-2 leading-tight">{title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                          {excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs md:text-sm text-gray-500">
                            <User className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Dr. Gürkan Eryanılmaz
                          </div>
                          <Button variant="ghost" size="sm" asChild className="text-xs md:text-sm">
                            <Link to={`/blog/${post.id}`}>
                              Read More
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="text-center">
              <Button asChild variant="outline" size="lg" className="text-base">
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
      <section className="py-16 md:py-20 bg-blue-900 text-white w-full">
        <div className="w-full px-5 md:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-white leading-tight">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {t('home.ctaDescription')}
            </p>
            {/* Fixed CTA buttons - always side by side */}
            <div className="flex gap-3 md:gap-4 justify-center max-w-md mx-auto">
              <Button asChild size="lg" className="flex-1 bg-white text-blue-900 hover:bg-blue-50 text-sm sm:text-base px-3 sm:px-6 py-3">
                <Link to="/contact" className="flex items-center justify-center">
                  <Calendar className="mr-1 sm:mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="truncate">{t('home.bookAppointment')}</span>
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="flex-1 border-white text-white hover:bg-white hover:text-blue-900 bg-transparent text-sm sm:text-base px-3 sm:px-6 py-3"
              >
                <a href="tel:+994553977874" className="flex items-center justify-center">
                  <Phone className="mr-1 sm:mr-2 h-4 w-4 md:h-5 md:w-5" />
                  <span className="truncate">{t('home.callNow')}</span>
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