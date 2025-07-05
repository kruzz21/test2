import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Expand, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon,
  Video,
  Calendar,
  Eye
} from 'lucide-react';
import { useGallery } from '@/hooks/useGallery';

interface MediaGalleryProps {
  className?: string;
}

const MediaGallery = ({ className = '' }: MediaGalleryProps) => {
  const { t, i18n } = useTranslation();
  const { galleryItems, loading, fetchGalleryItems } = useGallery();
  
  const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingMainVideo, setIsPlayingMainVideo] = useState(false);

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  // Filter items by type
  const videos = galleryItems.filter(item => item.type === 'video');
  const photos = galleryItems.filter(item => item.type === 'photo');
  const currentItems = activeTab === 'videos' ? videos : photos;

  // Initialize with first item when data loads
  useEffect(() => {
    if (currentItems.length > 0 && !selectedItem) {
      setSelectedItem(currentItems[0]);
      setCurrentIndex(0);
    }
  }, [currentItems, selectedItem]);

  // Update selected item when tab changes
  useEffect(() => {
    if (currentItems.length > 0) {
      setSelectedItem(currentItems[0]);
      setCurrentIndex(0);
      setIsPlayingMainVideo(false); // Reset video play state when switching tabs
    }
  }, [activeTab]);

  // Load gallery items on mount
  useEffect(() => {
    fetchGalleryItems();
  }, []);

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
  const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}` : null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  // Handle item selection
  const handleItemSelect = (item: any, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
    setIsPlayingMainVideo(false); // Reset video play state when selecting new item
  };

  // Handle modal navigation
  const navigateModal = useCallback((direction: 'prev' | 'next') => {
    if (currentItems.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentItems.length - 1;
    } else {
      newIndex = currentIndex < currentItems.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentIndex(newIndex);
    setSelectedItem(currentItems[newIndex]);
  }, [currentIndex, currentItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'Escape':
          setIsModalOpen(false);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateModal('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateModal('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, navigateModal]);

  // Render media preview
  const renderMediaPreview = (item: any, isModal: boolean = false, shouldAutoplay: boolean = false) => {
    if (!item) return null;

    const title = item[`title${langSuffix}`] || item.title_en;
    const altText = item[`alt_text${langSuffix}`] || item.alt_text_en || title;

    if (item.type === 'photo') {
      return (
        <img
          src={item.url}
          alt={altText}
          className={`w-full h-full object-cover ${isModal ? '' : 'rounded-lg'}`}
        />
      );
    } else if (item.type === 'video') {
      const embedUrl = getYouTubeEmbedUrl(item.url, shouldAutoplay);
      const thumbnailUrl = item.thumbnail_url || getYouTubeThumbnail(item.url);
      
      if (shouldAutoplay && embedUrl) {
        return (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else {
        return (
          <div className="relative w-full h-full">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={altText}
                className={`w-full h-full object-cover ${isModal ? '' : 'rounded-lg'}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                <Video className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <div 
              className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-300"
              onClick={() => {
                if (isModal) {
                  // In modal, clicking play should start the video
                  const newEmbedUrl = getYouTubeEmbedUrl(item.url, true);
                  if (newEmbedUrl) {
                    // Force re-render with autoplay
                    setSelectedItem({...item, _forceAutoplay: true});
                  }
                } else {
                  // In main preview, set playing state
                  setIsPlayingMainVideo(true);
                }
              }}
            >
              <div className="bg-white bg-opacity-90 rounded-full p-3 hover:scale-110 transition-transform duration-300">
                <Play className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        );
      }
    }
    
    return null;
  };

  // Render queue item
  const renderQueueItem = (item: any, index: number, isSelected: boolean) => {
    const title = item[`title${langSuffix}`] || item.title_en;
    const description = item[`description${langSuffix}`] || item.description_en;
    const thumbnailUrl = item.type === 'video' 
      ? (item.thumbnail_url || getYouTubeThumbnail(item.url))
      : (item.thumbnail_url || item.url);

    return (
      <Card 
        key={item.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => handleItemSelect(item, index)}
      >
        <CardContent className="p-3">
          <div className="flex space-x-3">
            {/* Thumbnail */}
            <div className="relative w-20 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {item.type === 'video' ? (
                    <Video className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              )}
              
              {/* Type indicator */}
              <div className="absolute top-1 right-1">
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {item.type === 'video' ? <Video className="h-2 w-2" /> : <ImageIcon className="h-2 w-2" />}
                </Badge>
              </div>
              
              {/* Play icon for videos */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-60 rounded-full p-1">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 mb-1">{title}</h4>
              {description && (
                <p className="text-xs text-gray-600 line-clamp-1 mb-1">{description}</p>
              )}
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(item.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading media gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'videos' | 'photos')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>Videos ({videos.length})</span>
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center space-x-2">
            <ImageIcon className="h-4 w-4" />
            <span>Photos ({photos.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-0">
          <MediaContent 
            items={videos}
            selectedItem={selectedItem}
            currentIndex={currentIndex}
            onItemSelect={handleItemSelect}
            onExpandClick={() => setIsModalOpen(true)}
            renderMediaPreview={renderMediaPreview}
            renderQueueItem={renderQueueItem}
            isPlayingMainVideo={isPlayingMainVideo}
          />
        </TabsContent>

        <TabsContent value="photos" className="mt-0">
          <MediaContent 
            items={photos}
            selectedItem={selectedItem}
            currentIndex={currentIndex}
            onItemSelect={handleItemSelect}
            onExpandClick={() => setIsModalOpen(true)}
            renderMediaPreview={renderMediaPreview}
            renderQueueItem={renderQueueItem}
            isPlayingMainVideo={isPlayingMainVideo}
          />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0 bg-black">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? (selectedItem[`title${langSuffix}`] || selectedItem.title_en) : 'Media Gallery Item'}
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation buttons */}
            {currentItems.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={() => navigateModal('prev')}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                  onClick={() => navigateModal('next')}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {/* Media content */}
            <div className="w-full h-full flex items-center justify-center p-4">
              {selectedItem && renderMediaPreview(selectedItem, true, true)}
            </div>

            {/* Media info */}
            {selectedItem && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white p-4">
                <h3 className="text-lg font-semibold mb-1">
                  {selectedItem[`title${langSuffix}`] || selectedItem.title_en}
                </h3>
                {selectedItem[`description${langSuffix}`] && (
                  <p className="text-sm text-gray-300 mb-2">
                    {selectedItem[`description${langSuffix}`] || selectedItem.description_en}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{currentIndex + 1} of {currentItems.length}</span>
                  <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Separate component for media content to avoid duplication
interface MediaContentProps {
  items: any[];
  selectedItem: any;
  currentIndex: number;
  onItemSelect: (item: any, index: number) => void;
  onExpandClick: () => void;
  renderMediaPreview: (item: any, isModal?: boolean, shouldAutoplay?: boolean) => React.ReactNode;
  renderQueueItem: (item: any, index: number, isSelected: boolean) => React.ReactNode;
  isPlayingMainVideo: boolean;
}

const MediaContent = ({
  items,
  selectedItem,
  currentIndex,
  onItemSelect,
  onExpandClick,
  renderMediaPreview,
  renderQueueItem,
  isPlayingMainVideo
}: MediaContentProps) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="mb-4">
            {items === undefined ? <Video className="h-12 w-12 text-gray-400 mx-auto" /> : <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No {items === undefined ? 'videos' : 'photos'} available
          </h3>
          <p className="text-gray-600">
            Check back later for new content from our medical center.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Preview Panel */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gray-100">
              {selectedItem ? (
                <>
                  {renderMediaPreview(selectedItem, false, isPlayingMainVideo)}
                  {/* Expand button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={onExpandClick}
                  >
                    <Expand className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select an item to preview</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Media info */}
            {selectedItem && (
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedItem.title_en}
                </h3>
                {selectedItem.description_en && (
                  <p className="text-gray-600 mb-3">{selectedItem.description_en}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{currentIndex + 1} of {items.length}</span>
                  <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Queue Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">
              Queue ({items.length} items)
            </h4>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {items.map((item, index) => 
                  renderQueueItem(item, index, selectedItem?.id === item.id)
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaGallery;