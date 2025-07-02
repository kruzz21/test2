import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

const Gallery = () => {
  const { t } = useTranslation();

  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Operating Room - Knee Surgery'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Surgical Equipment'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Patient Consultation'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Dr. Eryanılmaz with Patient'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Pediatric Consultation'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      caption: 'Sports Medicine Clinic'
    }
  ];

  const videos = [
    {
      id: 1,
      title: 'Dr. Gürkan Eryanılmaz Introduction',
      thumbnail: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'Introduction video from Dr. Eryanılmaz'
    },
    {
      id: 2,
      title: 'Knee Replacement Surgery Overview',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'Educational video about knee replacement procedures'
    },
    {
      id: 3,
      title: 'Post-Surgery Rehabilitation',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      description: 'Guidelines for post-operative care and rehabilitation'
    }
  ];

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Doctor Introduction */}
        <Card className="mb-12 max-w-6xl mx-auto">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">{t('gallery.welcomeMessage')}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('gallery.welcomeText')}
                </p>
                <p className="text-gray-800 font-medium">
                  - Op. Dr. Gürkan Eryanılmaz
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Dr. Gürkan Eryanılmaz"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">{t('gallery.watchIntroVideo')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Photos and Videos */}
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="photos">{t('gallery.photos')}</TabsTrigger>
              <TabsTrigger value="videos">{t('gallery.videos')}</TabsTrigger>
            </TabsList>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo) => (
                  <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-4">
                        <p className="text-sm text-gray-600">{photo.caption}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-600">{video.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Gallery;