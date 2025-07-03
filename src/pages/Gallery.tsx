import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGallery } from '@/hooks/useGallery';
import { Toaster } from '@/components/ui/toaster';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const { galleryItems, loading, error, fetchGalleryItems } = useGallery();

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  // Filter items by type
  const photos = galleryItems.filter(item => item.type === 'photo');
  const videos = galleryItems.filter(item => item.type === 'video');

  const handleRetry = () => {
    fetchGalleryItems();
  };

  const renderGalleryItem = (item: any) => {
    const title = item[`title${langSuffix}`] || item.title_en;
    const description = item[`description${langSuffix}`] || item.description_en;
    const altText = item[`alt_text${langSuffix}`] || item.alt_text_en || title;

    return (
      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-0">
          <div className="relative">
            {item.type === 'photo' ? (
              <img
                src={item.thumbnail_url || item.url}
                alt={altText}
                className="w-full h-64 object-cover"
              />
            ) : (
              <>
                <img
                  src={item.thumbnail_url || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                  alt={altText}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white" />
                </div>
              </>
            )}
            {item.categories_en && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {item.categories_en.split(',')[0]?.trim()}
                </Badge>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

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

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('gallery.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  {t('gallery.loadError')}
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('gallery.tryAgain')}
                </Button>
              </div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t('gallery.noItems')}
                </h3>
                <p className="text-gray-600">
                  {t('gallery.noItemsDescription')}
                </p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="photos">
                  {t('gallery.photos')} ({photos.length})
                </TabsTrigger>
                <TabsTrigger value="videos">
                  {t('gallery.videos')} ({videos.length})
                </TabsTrigger>
              </TabsList>

              {/* Photos Tab */}
              <TabsContent value="photos">
                {photos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">{t('gallery.noPhotos')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photos.map(renderGalleryItem)}
                  </div>
                )}
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos">
                {videos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">{t('gallery.noVideos')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map(renderGalleryItem)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Gallery;