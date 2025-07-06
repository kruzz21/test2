import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart, CheckCircle, Play, FileText, User, Phone, MessageCircle, RefreshCw, Video, Image as ImageIcon, Eye, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';
import { useGallery } from '@/hooks/useGallery';

const Home = () => {
  const { t, i18n } = useTranslation();
  const { blogPosts, loading: blogLoading, error: blogError, fetchBlogPosts } = useBlog();
  const { galleryItems, loading: galleryLoading } = useGallery();

  // Media modal state
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Scroll refs
  const videoScrollRef = useRef<HTMLDivElement>(null);
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

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}` : null;
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320; // Adjust based on card width
      const currentScroll = ref.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      ref.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const openMediaModal = (item: any, autoplay: boolean = false) => {
    setSelectedMedia(item);
    setIsVideoPlaying(autoplay);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setIsVideoPlaying(false);
    setIsMediaModalOpen(false);
  };

  const startVideo = (item: any) => {
    openMediaModal(item, true);
  };

  const handleBlogRetry = () => {
    fetchBlogPosts();
  };

  // Get the first 3 blog posts for preview
  const previewBlogPosts = blogPosts.slice(0, 3);

  // Filter gallery items by type and get featured items
  const featuredVideos = galleryItems.filter(item => item.type === 'video').slice(0, 6);
  const featuredPhotos = galleryItems.filter(item => item.type === 'photo').slice(0, 8);

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
            backgroundPosition: 'right left',
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

      {/* Gallery and Media Section - Enhanced with Premium Design */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 w-full overflow-hidden">
        <div className="w-full px-5 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                Gallery and Media
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8 leading-relaxed">
                {t('home.gallery.subtitle')}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto rounded-full"></div>
            </div>

            {galleryLoading ? (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-300 mx-auto animate-ping"></div>
                </div>
                <p className="text-gray-600 text-lg">Loading media gallery...</p>
              </div>
            ) : (
              <div className="space-y-24">
                {/* Featured Videos Section with Premium Design */}
                {featuredVideos.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Videos</h3>
                          <p className="text-gray-600">Educational content and patient stories</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                        <Link to="/gallery" state={{ activeTab: 'videos' }}>
                          View All Videos
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Video Slider Container with Premium Navigation */}
                    <div className="relative px-4 py-8">
                      {/* Navigation Buttons - Positioned in the middle */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 hover:shadow-2xl transition-all duration-300 w-14 h-14 rounded-full"
                        onClick={() => scrollContainer(videoScrollRef, 'left')}
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 hover:shadow-2xl transition-all duration-300 w-14 h-14 rounded-full"
                        onClick={() => scrollContainer(videoScrollRef, 'right')}
                      >
                        <ChevronRight className="h-6 w-6 text-gray-700" />
                      </Button>
                      
                      {/* Scrollable Video Container */}
                      <div 
                        ref={videoScrollRef}
                        className="flex overflow-x-auto gap-6 pb-8 pt-4 scrollbar-hide px-20"
                        style={{ 
                          scrollSnapType: 'x mandatory',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}
                      >
                        {featuredVideos.map((video) => {
                          const title = video[`title${langSuffix}`] || video.title_en;
                          const description = video[`description${langSuffix}`] || video.description_en;
                          const thumbnailUrl = video.thumbnail_url || getYouTubeThumbnail(video.url);

                          return (
                            <Card 
                              key={video.id} 
                              className="flex-shrink-0 w-80 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 transform hover:-translate-y-3 hover:scale-105"
                              style={{ scrollSnapAlign: 'start' }}
                              onClick={() => openMediaModal(video, false)}
                            >
                              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                {thumbnailUrl ? (
                                  <img
                                    src={thumbnailUrl}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                                    <Video className="h-16 w-16 text-gray-400" />
                                  </div>
                                )}
                                
                                {/* Premium Play Button Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center group-hover:from-black/70 transition-all duration-500">
                                  <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 group-hover:scale-125 transition-all duration-500 shadow-2xl border border-white/20">
                                    <Play className="h-8 w-8 text-red-600 ml-1" />
                                  </div>
                                </div>
                                
                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-red-600/90 text-white border-0 backdrop-blur-sm">
                                    <Video className="h-3 w-3 mr-1" />
                                    Video
                                  </Badge>
                                </div>

                                {/* Duration Badge (if available) */}
                                <div className="absolute bottom-4 right-4">
                                  <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm">
                                    HD
                                  </Badge>
                                </div>
                              </div>
                              
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg line-clamp-2 text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                                  {title}
                                </CardTitle>
                                {description && (
                                  <CardDescription className="line-clamp-2 text-gray-600 leading-relaxed">
                                    {description}
                                  </CardDescription>
                                )}
                              </CardHeader>
                              
                              <CardContent className="pt-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(video.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                                    <Play className="h-4 w-4 mr-1" />
                                    Watch
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Featured Photos Section with Premium Design */}
                {featuredPhotos.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center justify-between mb-12">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <ImageIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">Medical Center Photos</h3>
                          <p className="text-gray-600">State-of-the-art facilities and equipment</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                        <Link to="/gallery" state={{ activeTab: 'photos' }}>
                          View All Photos
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {/* Photo Slider Container with Premium Navigation */}
                    <div className="relative px-4 py-8">
                      {/* Navigation Buttons - Positioned in the middle */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 hover:shadow-2xl transition-all duration-300 w-14 h-14 rounded-full"
                        onClick={() => scrollContainer(photoScrollRef, 'left')}
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-700" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white/95 backdrop-blur-sm hover:bg-white shadow-xl border-gray-200 hover:shadow-2xl transition-all duration-300 w-14 h-14 rounded-full"
                        onClick={() => scrollContainer(photoScrollRef, 'right')}
                      >
                        <ChevronRight className="h-6 w-6 text-gray-700" />
                      </Button>
                      
                      {/* Scrollable Photo Container */}
                      <div 
                        ref={photoScrollRef}
                        className="flex overflow-x-auto gap-5 pb-8 pt-4 scrollbar-hide px-20"
                        style={{ 
                          scrollSnapType: 'x mandatory',
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none'
                        }}
                      >
                        {featuredPhotos.map((photo) => {
                          const title = photo[`title${langSuffix}`] || photo.title_en;
                          const altText = photo[`alt_text${langSuffix}`] || photo.alt_text_en || title;

                          return (
                            <Card 
                              key={photo.id} 
                              className="flex-shrink-0 w-72 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300 transform hover:-translate-y-3 hover:scale-105"
                              style={{ scrollSnapAlign: 'start' }}
                              onClick={() => openMediaModal(photo, false)}
                            >
                              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                                <img
                                  src={photo.thumbnail_url || photo.url}
                                  alt={altText}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Premium Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                  <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-2xl border border-white/20 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <Expand className="h-5 w-5 text-gray-800" />
                                  </div>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-4 left-4">
                                  <Badge className="bg-blue-600/90 text-white border-0 backdrop-blur-sm">
                                    <ImageIcon className="h-3 w-3 mr-1" />
                                    Photo
                                  </Badge>
                                </div>
                              </div>
                              
                              <CardContent className="p-5">
                                <h4 className="font-semibold text-base line-clamp-2 text-gray-900 group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                                  {title}
                                </h4>
                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(photo.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center text-sm text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
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

      {/* Enhanced Media Modal */}
      <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white/95 backdrop-blur-md border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedMedia ? (selectedMedia[`title${langSuffix}`] || selectedMedia.title_en) : 'Media Item'}
            </DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-6">
              {/* Media Display */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-2xl">
                {selectedMedia.type === 'photo' ? (
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia[`alt_text${langSuffix}`] || selectedMedia.alt_text_en || selectedMedia[`title${langSuffix}`] || selectedMedia.title_en}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (() => {
                    if (isVideoPlaying) {
                      const embedUrl = getYouTubeEmbedUrl(selectedMedia.url, true);
                      if (embedUrl) {
                        return (
                          <iframe
                            src={embedUrl}
                            title={selectedMedia[`title${langSuffix}`] || selectedMedia.title_en}
                            className="w-full h-full rounded-xl"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      }
                    }
                    
                    // Show thumbnail with play button
                    const thumbnailUrl = selectedMedia.thumbnail_url || getYouTubeThumbnail(selectedMedia.url);
                    return (
                      <div className="relative w-full h-full">
                        {thumbnailUrl ? (
                          <img
                            src={thumbnailUrl}
                            alt={selectedMedia[`alt_text${langSuffix}`] || selectedMedia.alt_text_en || selectedMedia[`title${langSuffix}`] || selectedMedia.title_en}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                            <Video className="h-20 w-20 text-gray-400" />
                          </div>
                        )}
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center cursor-pointer hover:from-black/70 transition-all duration-500"
                          onClick={() => setIsVideoPlaying(true)}
                        >
                          <div className="bg-white/95 backdrop-blur-sm rounded-full p-6 hover:scale-110 transition-all duration-500 shadow-2xl border border-white/20">
                            <Play className="h-16 w-16 text-red-600 ml-2" />
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Item Details */}
              <div className="space-y-6 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <div>
                  <h2 className="text-3xl font-bold mb-3 text-gray-900">{selectedMedia[`title${langSuffix}`] || selectedMedia.title_en}</h2>
                  {(selectedMedia[`description${langSuffix}`] || selectedMedia.description_en) && (
                    <p className="text-gray-700 leading-relaxed text-lg">{selectedMedia[`description${langSuffix}`] || selectedMedia.description_en}</p>
                  )}
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-6 text-base">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {selectedMedia.type === 'video' ? <Video className="h-5 w-5 text-blue-600" /> : <ImageIcon className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Type:</span>
                      <span className="ml-2 capitalize font-semibold text-gray-900">{selectedMedia.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Created:</span>
                      <span className="ml-2 font-semibold text-gray-900">{new Date(selectedMedia.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {selectedMedia.categories_en && (
                  <div>
                    <span className="font-medium text-gray-600 text-base">Categories:</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedMedia.categories_en.split(',').map((category: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                          {category.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;