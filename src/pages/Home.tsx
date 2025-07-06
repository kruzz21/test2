import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart, CheckCircle, Play, FileText, User, Phone, MessageCircle, RefreshCw, Video, Image as ImageIcon, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import { useGallery } from '@/hooks/useGallery';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { blogPosts, loading: blogLoading, error: blogError, fetchBlogPosts } = useBlog();
  const { galleryItems, loading: galleryLoading } = useGallery();

  // Media modal state
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);

  // Scroll refs for carousels
  const photoScrollRef = useRef<HTMLDivElement>(null);

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

  const expertiseAreas = [
    'Arthroscopic Surgery',
    'Joint Replacement Surgery',
    'Trauma & Fracture Surgery',
    'Pediatric Orthopedics',
    'Sports Injuries & Rehabilitation',
    'Joint & Nerve Surgery'
  ];

  // Helper functions
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const openPhotoModal = (photo: any, index: number) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setSelectedPhoto(null);
    setIsPhotoModalOpen(false);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (selectedPhotoIndex - 1 + photos.length) % photos.length
      : (selectedPhotoIndex + 1) % photos.length;
    
    setSelectedPhotoIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const scrollPhotos = (direction: 'left' | 'right') => {
    if (photoScrollRef.current) {
      const scrollAmount = 200;
      const currentScroll = photoScrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      photoScrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const handleVideoSelect = (video: any, index: number) => {
    setSelectedVideoId(video.id);
    setSelectedVideoIndex(index);
  };

  const handleBlogRetry = () => {
    fetchBlogPosts();
  };

  // Get the first 3 blog posts for preview
  const previewBlogPosts = blogPosts.slice(0, 3);

  // Filter gallery items by type
  const videos = galleryItems.filter(item => item.type === 'video');
  const photos = galleryItems.filter(item => item.type === 'photo');

  // Set first video as default if none selected
  const currentVideo = selectedVideoId 
    ? videos.find(v => v.id === selectedVideoId) 
    : videos[0];

  const currentVideoIndex = selectedVideoId 
    ? videos.findIndex(v => v.id === selectedVideoId)
    : 0;

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Integrated Cards */}
      <section className="relative w-full">
        {/* Main Hero Content */}
        <div 
          className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-32 w-full"
          style={{
            backgroundImage: 'url(https://media.discordapp.net/attachments/1114334300532383895/1391438925628968960/herobg.png?ex=686be5fb&is=686a947b&hm=747fc333bd251b96ac57ebf969e7a32d4969d91e0eb4aa10a7a8396a97a1ce3e&=&format=webp&quality=lossless&width=1232&height=528)',
            backgroundSize: 'cover',
            backgroundPosition: 'right bottom',
            backgroundBlendMode: 'overlay'
          }}
        >
          {/* Transparent black overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          
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
            </div>
          </div>
        </div>

        {/* Integrated Quick Action Cards - Mobile Responsive */}
        <div className="relative -mt-6 md:-mt-16 w-full px-5 md:px-8 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {/* Contact Us Card */}
              <Card 
                className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                style={{
                  backgroundImage: 'url(https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=800)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  backgroundColor: 'rgba(59, 130, 246, 0.9)'
                }}
              >
                <CardContent className="p-4 md:p-8 relative z-10">
                  <div className="flex items-start space-x-3 md:space-x-6">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white border-opacity-30">
                      <Phone className="h-4 w-4 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">
                        {t('home.contactUs.title')}
                      </h3>
                      <p className="text-xs md:text-base text-blue-100 mb-3 md:mb-6 leading-relaxed">
                        {t('home.contactUs.description')}
                      </p>
                      {/* Fixed button layout - always side by side */}
                      <div className="flex gap-2 md:gap-3">
                        <Button 
                          asChild 
                          size="sm" 
                          className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm hover:bg-white hover:bg-opacity-30 text-white border border-white border-opacity-30 text-xs md:text-sm px-2 py-2 min-w-0"
                        >
                          <a href="tel:+994553977874" className="flex items-center justify-center">
                            <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="truncate">{t('home.contactUs.call')}</span>
                          </a>
                        </Button>
                        <Button 
                          asChild 
                          variant="outline" 
                          size="sm"
                          className="flex-1 bg-white bg-opacity-20 backdrop-blur-sm border-white border-opacity-30 text-white hover:bg-white hover:text-blue-600 text-xs md:text-sm px-2 py-2 min-w-0"
                        >
                          <a 
                            href="https://wa.me/994553977874" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                          >
                            <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="truncate">WhatsApp</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Appointment Card */}
              <Card 
                className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                style={{
                  backgroundImage: 'url(https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg?auto=compress&cs=tinysrgb&w=800)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  backgroundColor: 'rgba(34, 197, 94, 0.9)'
                }}
              >
                <CardContent className="p-4 md:p-8 relative z-10">
                  <div className="flex items-start space-x-3 md:space-x-6">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white border-opacity-30">
                      <Calendar className="h-4 w-4 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base md:text-xl font-bold text-white mb-2 md:mb-3">
                        {t('home.appointment.title')}
                      </h3>
                      <p className="text-xs md:text-base text-green-100 mb-3 md:mb-6 leading-relaxed">
                        {t('home.appointment.description')}
                      </p>
                      <Button 
                        asChild 
                        size="sm" 
                        className="w-full bg-white bg-opacity-20 backdrop-blur-sm hover:bg-white hover:bg-opacity-30 text-white border border-white border-opacity-30 text-xs md:text-sm"
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
                    src="/doctor-portrait.jpg"
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
          backgroundImage: 'url(https://lh3.googleusercontent.com/fife/ALs6j_FhnBQpNoT-AnIC6QeJyS8qi8OkJPvUL3GCIqNi0FqEJkcVWM0h9lFBzZl-J-2jA3JtviXva404qeV4QE5e5jFvme-sFilWWK235iaICkhVQEv04m15Wp_OQ_nub5OwlipjxoNtltg5xwtZmPSZUwWvYMRAdZ2wCV3MufFKlnTEZdADACniX_B7GvMqnNT16_b1IAeZPQtJX2lDvYY2LNV5ublFsV8KLLn-open1OqbZrgbEEmW5woxHuc1-0LDel3wFNbXc9O__zE4ctw-2qosu4VhMaj0wAgx94qSulWdh8PUbokjgfkC8LUv-_bL88fVovGet-pmJrFmjAU8nyvT88087iH2WCl6ar4-YIDC6VafUVt2X2RKura3LZsKgQd2YTTbaIgWFRmi72cV-awH9IZF4ZCBSjOrayTnnAiATUp1AxyDXjWjaY0mDauFFQUOcfvKWHBFDbrHqEovKoNBvBT7Ea6sAa4nDB7NaSBweBeIv9ewqkJpVLTMg_Mne-K5JrlslzHIlL_shHhG47Rub1WxlDLrwdGs6ltiaA-wkrM4uSlDw63GrqRwKVRi5KfZmgORopMI8Q9q0KdaPe6iaIWKgvXSMQLLb0aMyUPj2IhROexN1i9AVqOB0IqQqC5zZHr3JVkrdAnbXJnqP9zl4cgGM0DU-IyAIJOs0WetTOmm1FuNvSvDS0nQWSFz9DMBf4WXkoMTSNaX302mIA-31zExK8BZVRFYs4fi3ZcdG9LCM4jxcJOXfLqAunTktXabKycCfeHk8THR1tdCJVd5ftL7o-E-LqCqjCLA9wwHlx7V88G3Few0yRhGJFDfJvkXm2Z9ST9ptWAu1zTo-CWF1WzdZT_shvTWDf9N83ysp9Sn1Y9-j5bl3rUiXxTekwX1ZnFLKrp54MhVGZAcgIjA2aQzAaoS9_HkcfWN4cVlPKiuTzt-PSbJvaYI5BSmPDTQ50rUZ066MoNVKy7Grlx3g8dO1oATGMdBjRbbJhEzakrAsRSG8Jzgdxl7toicb9R7VnmnAR7FoHwi6WVN1i6pTU5LRK1PDTToN_lnSYS7mYO6-_MJVvmqryEfLpiHOeJBX5tYGAdro6Zkgq-bGkbZkjTX_9-G8lzr0fh5VDjOCmAHRam281NB37x77qDEvIe93jxUH7m5F4HWp0_dBRo6BaLvVSP1v1MXBl8Yk7n92CfvBZQ8Clalx-F0ElhJDMCkL8oiFsyXkb622-q5B6Cgh9dgtenWHT_jpmpKd5Nx08l7WBQgDdfZy3SPPvyDSU_SuO_MCk1s-uCGyjkwCOrn7aYSB72K17iFHnbalqpSj8Zh-2lw2aGDP1kStzKxFF-beB8EKuiTMhd0KFP3R1x1YAU3Ha8LsxfKlK8r6E8eJl8_PYCwlla7u8C1vY8na4b-bE693b3SyDPkIsGYkBXTxETVCK5Sd6n0dKvIfxkfsz4Fjl8hjdWaqiS2n8a8_vo-3NxGxQvEdxKJW-lB2Tu95G_Q1BY8AW_9Oq8WYvabtIpQdeRKv16r_QWWopZ_WZNpeFGowyOEyfNPyF2_4RBhiuF0Im--ildOG-VtcxE7Lw83HguTXmmJbQtaTfM0btNn4ZEbOy3pUln7AlETzWv_oK5EcXdhYdjmYg=w2560-h1305?auditContext=forDisplay)',
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

      {/* Gallery and Media Section - Enhanced */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Gallery and Media
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('home.gallery.subtitle')}
              </p>
            </div>

            {galleryLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media gallery...</p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* Videos Section - Enhanced 2 Column Layout */}
                {videos.length > 0 && (
                  <div>
                    {/* Video Counter */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                          <Video className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Featured Videos</h3>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {currentVideoIndex + 1}/{videos.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Large Video Player */}
                      <div className="lg:col-span-2">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {currentVideo && getYouTubeEmbedUrl(currentVideo.url) ? (
                            <iframe
                              src={getYouTubeEmbedUrl(currentVideo.url) || ''}
                              title={currentVideo[`title${langSuffix}`] || currentVideo.title_en}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Video className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Thin Video List with Thumbnails */}
                      <div className="lg:col-span-1">
                        <div 
                          className="space-y-2 max-h-96 overflow-y-auto pr-2"
                          style={{ 
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'transparent transparent'
                          }}
                        >
                          {videos.map((video, index) => {
                            const title = video[`title${langSuffix}`] || video.title_en;
                            const description = video[`description${langSuffix}`] || video.description_en;
                            const isActive = selectedVideoId === video.id || (!selectedVideoId && video === videos[0]);
                            const thumbnailUrl = video.thumbnail_url || getYouTubeThumbnail(video.url);

                            return (
                              <div
                                key={video.id}
                                className={`flex space-x-3 p-2 cursor-pointer transition-colors rounded-lg ${
                                  isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleVideoSelect(video, index)}
                              >
                                {/* Video Thumbnail */}
                                <div className="flex-shrink-0 w-20 h-12 bg-gray-200 rounded overflow-hidden relative">
                                  {thumbnailUrl ? (
                                    <img
                                      src={thumbnailUrl}
                                      alt={title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Video className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <Play className="h-3 w-3 text-white" />
                                  </div>
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className={`text-xs font-medium leading-tight line-clamp-2 ${
                                    isActive ? 'text-blue-900' : 'text-gray-900'
                                  }`}>
                                    {title}
                                  </h4>
                                  {description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                      {description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                {videos.length > 0 && photos.length > 0 && (
                  <div className="border-t border-gray-200 pt-8">
                    {/* Photos Header with Navigation */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Medical Center Photos</h3>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500 font-medium">
                          {photos.length} photos
                        </span>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => scrollPhotos('left')}
                            className="w-8 h-8 p-0"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => scrollPhotos('right')}
                            className="w-8 h-8 p-0"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photos Section - Horizontal Scroll */}
                {photos.length > 0 && (
                  <div className="relative">
                    <div 
                      ref={photoScrollRef}
                      className="flex space-x-4 overflow-x-auto pb-4"
                      style={{ 
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'transparent transparent'
                      }}
                    >
                      {photos.map((photo, index) => {
                        const title = photo[`title${langSuffix}`] || photo.title_en;
                        const altText = photo[`alt_text${langSuffix}`] || photo.alt_text_en || title;

                        return (
                          <div
                            key={photo.id}
                            className="flex-shrink-0 w-48 h-32 cursor-pointer group"
                            onClick={() => openPhotoModal(photo, index)}
                          >
                            <img
                              src={photo.thumbnail_url || photo.url}
                              alt={altText}
                              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 shadow-sm"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section className="py-16 md:py-20 bg-slate-50 w-full">
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

      {/* Enhanced Photo Modal with Navigation */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent 
          className="max-w-5xl border-0 bg-transparent shadow-none p-0"
          onClick={closePhotoModal}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>
              {selectedPhoto ? (selectedPhoto[`title${langSuffix}`] || selectedPhoto.title_en) : 'Photo Gallery'}
            </DialogTitle>
          </DialogHeader>
          <div className="relative bg-white rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Navigation arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => navigatePhoto('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigatePhoto('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Photo counter */}
            <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedPhotoIndex + 1}/{photos.length}
            </div>
            
            {selectedPhoto && (
              <>
                {/* Image */}
                <div className="aspect-video bg-gray-100">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto[`alt_text${langSuffix}`] || selectedPhoto.alt_text_en || selectedPhoto[`title${langSuffix}`] || selectedPhoto.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    {selectedPhoto[`title${langSuffix}`] || selectedPhoto.title_en}
                  </h3>
                  {(selectedPhoto[`description${langSuffix}`] || selectedPhoto.description_en) && (
                    <p className="text-gray-700 leading-relaxed">
                      {selectedPhoto[`description${langSuffix}`] || selectedPhoto.description_en}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;