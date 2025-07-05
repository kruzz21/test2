import { useTranslation } from 'react-i18next';
import MediaGallery from '@/components/MediaGallery';
import { Toaster } from '@/components/ui/toaster';

const MediaGalleryPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Media Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of medical videos and photos showcasing our facilities and procedures
          </p>
        </div>

        {/* Media Gallery Component */}
        <div className="max-w-7xl mx-auto">
          <MediaGallery />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default MediaGalleryPage;