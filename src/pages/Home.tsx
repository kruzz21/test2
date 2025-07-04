import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, GraduationCap, Badge as BadgeIcon, Briefcase, Globe, Camera, Activity, Bone, Stethoscope, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

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
      <section className="bg-[#F0F4FF] py-20 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                  Dr. Gürkan Eryanılmaz
                </h1>
                <h2 className="text-xl md:text-2xl text-blue-600 font-semibold">
                  Orthopedic & Traumatology Specialist
                </h2>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>Afyon Kocatepe State Hospital</span>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                  Expert orthopedic care with over 25 years of experience. Specializing in joint replacements, arthroscopic surgery, and comprehensive trauma care.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/contact">
                      📅 Book Appointment
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Link to="/services">
                      👁️ View Treatments
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Right Column - Image */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Dr. Gürkan Eryanılmaz"
                  className="w-full max-w-md h-[400px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                About Dr. Eryanılmaz
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl">
                A distinguished orthopedic surgeon with over two decades of experience in complex joint replacements, arthroscopic procedures, and trauma surgery.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Info Items */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Education</h3>
                    <p className="text-gray-600">Ege University Faculty of Medicine (1987–1993)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <BadgeIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Specialization</h3>
                    <p className="text-gray-600">Residency, İzmir Tepecik Training & Research Hospital (1996)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Current Position</h3>
                    <p className="text-gray-600">Senior Orthopedic Surgeon, Afyon Kocatepe State Hospital</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Languages</h3>
                    <p className="text-gray-600">Turkish, English</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Professional Gallery Card */}
              <div className="flex justify-center lg:justify-start">
                <Card className="w-full max-w-sm bg-blue-50 border-blue-200">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Professional Gallery
                    </h3>
                    <p className="text-gray-600">
                      Clinic & Surgery Photos
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Practice Locations Banner */}
            <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 text-center font-medium">
                Currently serving patients at Afyon Kocatepe State Hospital.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-[#0A3D91] text-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Proven Track Record of Excellence
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Numbers that reflect our commitment to patient care and surgical excellence.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Knee Replacements */}
              <Card className="bg-white text-gray-900 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                  <h3 className="font-semibold">Knee Replacements</h3>
                </CardContent>
              </Card>

              {/* Fracture Surgeries */}
              <Card className="bg-white text-gray-900 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bone className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">5,000+</div>
                  <h3 className="font-semibold">Fracture Surgeries</h3>
                </CardContent>
              </Card>

              {/* Arthroscopic Procedures */}
              <Card className="bg-white text-gray-900 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">3,500+</div>
                  <h3 className="font-semibold">Arthroscopic Procedures</h3>
                </CardContent>
              </Card>

              {/* Years Experience */}
              <Card className="bg-white text-gray-900 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                  <h3 className="font-semibold">Years Experience</h3>
                </CardContent>
              </Card>
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
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/services">
                {t('home.viewAllServices')}
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