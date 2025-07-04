import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, GraduationCap, Hospital, MapPin, Languages, Activity, Award, Users, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGallery } from '@/hooks/useGallery';
import { useEffect, useState } from 'react';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { galleryItems, fetchGalleryItems } = useGallery();
  const [galleryPreview, setGalleryPreview] = useState<any[]>([]);

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  useEffect(() => {
    // Get first 3 published photos for gallery preview
    const photos = galleryItems
      .filter(item => item.type === 'photo' && item.published)
      .slice(0, 3);
    setGalleryPreview(photos);
  }, [galleryItems]);

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section className="bg-[#F0F4FF] py-20 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {t('home.hero.heading')}
                </h1>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('home.hero.subheading')}
                </p>

                {/* Badges */}
                <div className="space-y-3">
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-blue-200 text-blue-800">
                    {t('home.hero.badge.born')}
                  </Badge>
                  <br />
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-blue-200 text-blue-800">
                    {t('home.hero.badge.education')}
                  </Badge>
                  <br />
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-blue-200 text-blue-800">
                    {t('home.hero.badge.residency')}
                  </Badge>
                  <br />
                  <Badge variant="outline" className="text-sm px-4 py-2 bg-white border-blue-200 text-blue-800">
                    {t('home.hero.badge.current')}
                  </Badge>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/contact">
                      <Calendar className="mr-2 h-5 w-5" />
                      {t('home.hero.button.book')}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    <Link to="/services">
                      {t('home.hero.button.treatments')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Right Column - Doctor Photo */}
              <div className="flex justify-center lg:justify-end">
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <img
                      src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt="Dr. Gürkan Eryanılmaz"
                      className="w-full h-[400px] object-cover"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('home.about.heading')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('home.about.subtitle')}
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Info Rows */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <GraduationCap className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Education</h4>
                    <p className="text-gray-600">{t('home.about.info.education')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Hospital className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Specialization</h4>
                    <p className="text-gray-600">{t('home.about.info.specialization')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Current Position</h4>
                    <p className="text-gray-600">{t('home.about.info.position')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Languages className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Languages</h4>
                    <p className="text-gray-600">{t('home.about.info.languages')}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Gallery Preview */}
              <div>
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('home.about.gallery.title')}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {t('home.about.gallery.subtitle')}
                      </p>
                    </div>

                    {/* Gallery Preview Images */}
                    {galleryPreview.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        {galleryPreview.map((item, index) => (
                          <div key={item.id} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={item.thumbnail_url || item.url}
                              alt={item[`alt_text${langSuffix}`] || item[`title${langSuffix}`] || 'Gallery image'}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        {[1, 2, 3].map((index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                        ))}
                      </div>
                    )}

                    <Button asChild variant="outline" className="w-full">
                      <Link to="/gallery">
                        {t('home.about.gallery.button')}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Footer Banner */}
            <div className="mt-16 bg-[#F0F4FF] rounded-lg p-6 text-center">
              <p className="text-lg text-blue-800 font-medium">
                {t('home.about.locations')}
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
                {t('home.experience.heading')}
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {t('home.experience.subheading')}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Knee Replacements */}
              <Card className="bg-white text-gray-900 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {t('home.experience.stat.knee.number')}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('home.experience.stat.knee.title')}
                  </h3>
                </CardContent>
              </Card>

              {/* Fracture Surgeries */}
              <Card className="bg-white text-gray-900 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {t('home.experience.stat.fracture.number')}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('home.experience.stat.fracture.title')}
                  </h3>
                </CardContent>
              </Card>

              {/* Arthroscopic Procedures */}
              <Card className="bg-white text-gray-900 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {t('home.experience.stat.arthroscopy.number')}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('home.experience.stat.arthroscopy.title')}
                  </h3>
                </CardContent>
              </Card>

              {/* Pediatric Hip Surgeries */}
              <Card className="bg-white text-gray-900 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {t('home.experience.stat.pediatric_hip.number')}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('home.experience.stat.pediatric_hip.title')}
                  </h3>
                </CardContent>
              </Card>

              {/* Clubfoot Corrections */}
              <Card className="bg-white text-gray-900 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {t('home.experience.stat.clubfoot.number')}
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {t('home.experience.stat.clubfoot.title')}
                  </h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;