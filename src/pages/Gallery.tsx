import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play, RefreshCw, X, Calendar, Eye } from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';
import { Toaster } from '@/components/ui/toaster';

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const { galleryItems, loading, error, fetchGalleryItems } = useGallery();
  
  // State for detail popup
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  // Filter items by type
  const photos = galleryItems.filter(item => item.type === 'photo');
  const videos = galleryItems.filter(item => item.type === 'video');

  // Helper function to extract YouTube video ID from URL
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

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const handleRetry = () => {
    fetchGalleryItems();
  };

  const openDetailDialog = (item: any) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const closeDetailDialog = () => {
    setSelectedItem(null);
    setIsDetailDialogOpen(false);
  };

  const renderGalleryItem = (item: any) => {
    const title = item[`title${langSuffix}`] || item.title_en;
    const description = item[`description${langSuffix}`] || item.description_en;
    const altText = item[`alt_text${langSuffix}`] || item.alt_text_en || title;

    return (
      <Card 
        key={item.id} 
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => openDetailDialog(item)}
      >
        <CardContent className="p-0">
          <div className="relative">
            {item.type === 'photo' ? (
              <img
                src={item.thumbnail_url || item.url}
                alt={altText}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <>
                <img
                  src={item.thumbnail_url || getYouTubeThumbnail(item.url) || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                  alt={altText}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </>
            )}
            
            {/* Type Badge */}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="text-xs bg-white bg-opacity-90">
                {item.type === 'video' ? 'Video' : 'Photo'}
              </Badge>
            </div>

            {/* Categories Badge */}
            {item.categories_en && (
              <div className="absolute top-2 left-2">
                <Badge variant="outline" className="text-xs bg-white bg-opacity-90">
                  {item.categories_en.split(',')[0]?.trim()}
                </Badge>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white rounded-full p-2">
                  <Eye className="h-5 w-5 text-gray-800" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDetailContent = () => {
    if (!selectedItem) return null;

    const title = selectedItem[`title${langSuffix}`] || selectedItem.title_en;
    const description = selectedItem[`description${langSuffix}`] || selectedItem.description_en;
    const altText = selectedItem[`alt_text${langSuffix}`] || selectedItem.alt_text_en || title;

    return (
      <div className="space-y-6">
        {/* Media Display */}
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          {selectedItem.type === 'photo' ? (
            <img
              src={selectedItem.url}
              alt={altText}
              className="w-full h-full object-cover"
            />
          ) : (
            (() => {
              const embedUrl = getYouTubeEmbedUrl(selectedItem.url);
              if (embedUrl) {
                return (
                  <iframe
                    src={embedUrl}
                    title={title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                );
              } else {
                return (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-center">
                      <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Unable to load video</p>
                      <p className="text-sm text-gray-500">Invalid YouTube URL</p>
                    </div>
                  </div>
                );
              }
            })()
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            {description && (
              <p className="text-gray-700 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">{t('gallery.type')}:</span>
              <span className="ml-2 capitalize">{selectedItem.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">{t('gallery.status')}:</span>
              <Badge className={`ml-2 ${selectedItem.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {selectedItem.published ? t('gallery.published') : t('gallery.draft')}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-gray-600">{t('gallery.displayOrder')}:</span>
              <span className="ml-2">{selectedItem.display_order || 0}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">{t('gallery.created')}:</span>
              <span className="ml-2 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(selectedItem.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Categories */}
          {selectedItem.categories_en && (
            <div>
              <span className="font-medium text-gray-600 text-sm">{t('gallery.categories')}:</span>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedItem.categories_en.split(',').map((category: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Original URL for videos */}
          {selectedItem.type === 'video' && (
            <div>
              <span className="font-medium text-gray-600 text-sm">Original URL:</span>
              <div className="mt-1">
                <a 
                  href={selectedItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {selectedItem.url}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
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
              <div className="relative cursor-pointer" onClick={() => openDetailDialog({
                id: 'intro-video',
                type: 'video',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Example URL
                title_en: 'Introduction to Our Medical Center',
                title_tr: 'Tıp Merkezimize Giriş',
                title_az: 'Tibb Mərkəzimizə Giriş',
                description_en: 'Welcome to our state-of-the-art medical facility',
                description_tr: 'Son teknoloji tıbbi tesisimize hoş geldiniz',
                description_az: 'Son texnologiya tibbi təsisimizə xoş gəlmisiniz',
                published: true,
                created_at: new Date().toISOString(),
                display_order: 0
              })}>
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Dr. Gürkan Eryanılmaz"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center hover:bg-opacity-50 transition-all duration-300">
                  <div className="text-center text-white">
                    <div className="bg-white bg-opacity-90 rounded-full p-4 mb-2 mx-auto w-fit">
                      <Play className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-sm font-medium">{t('gallery.watchIntroVideo')}</p>
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

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedItem ? (selectedItem[`title${langSuffix}`] || selectedItem.title_en) : 'Gallery Item'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeDetailDialog}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            {renderDetailContent()}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </div>
  );
};

export default Gallery;