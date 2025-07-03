import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReviews } from '@/hooks/useReviews';
import { Toaster } from '@/components/ui/toaster';

const Reviews = () => {
  const { t, i18n } = useTranslation();
  const { reviews, loading, createReview } = useReviews();
  
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    rating: 0
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message || formData.rating === 0) {
      return;
    }

    try {
      // Create review with multilingual support
      const reviewData = {
        name: formData.name,
        name_tr: formData.name,
        name_az: formData.name,
        name_en: formData.name,
        message: formData.message,
        message_tr: formData.message,
        message_az: formData.message,
        message_en: formData.message,
        rating: formData.rating
      };

      await createReview(reviewData);
      setFormData({ name: '', message: '', rating: 0 });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive && onRatingChange ? () => onRatingChange(index + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('reviews.title')}
          </h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Reviews and Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
              </div>
            ) : (
              reviews.map((review: any) => {
                // Use multilingual content if available, fallback to legacy fields
                const displayName = review[`name${langSuffix}`] || review.name;
                const displayMessage = review[`message${langSuffix}`] || review.message;
                const displayReply = review[`doctor_reply${langSuffix}`] || review.doctor_reply;

                return (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{displayName}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{review.rating}/5</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{displayMessage}</p>
                      
                      {displayReply && (
                        <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded">
                          <div className="flex items-center mb-2">
                            <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="font-medium text-blue-900">
                              {t('reviews.doctorReply')}
                            </span>
                          </div>
                          <p className="text-blue-800">{displayReply}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Review Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('reviews.writeReview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('reviews.rating')}
                    </label>
                    <div className="flex space-x-1">
                      {renderStars(formData.rating, true, (rating) => handleInputChange('rating', rating))}
                    </div>
                  </div>
                  
                  <Input 
                    placeholder={t('reviews.reviewName')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  
                  <Textarea 
                    placeholder={t('reviews.reviewMessage')}
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading || formData.rating === 0}
                  >
                    {loading ? 'Submitting...' : t('reviews.submitReview')}
                  </Button>
                  
                  <p className="text-sm text-gray-500">
                    {t('reviews.reviewsReviewed')}
                  </p>

                  {/* FAQ Link */}
                  <div className="border-t pt-4 mt-6">
                    <h4 className="font-medium mb-2">{t('reviews.haveQuestions')}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {t('reviews.checkFaq')}
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/faq">
                        {t('reviews.viewFaq')}
                      </Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Reviews;