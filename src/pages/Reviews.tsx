import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reviews = () => {
  const { t } = useTranslation();

  // Placeholder reviews
  const reviews = [
    {
      id: 1,
      name: 'Ayşe Yılmaz',
      rating: 5,
      message: 'Dr. Eryanılmaz performed my knee replacement surgery and the results have been amazing. I can walk without pain for the first time in years!',
      date: '2025-01-10',
      doctorReply: 'Thank you for your kind words, Ayşe. I\'m delighted to hear about your excellent progress!'
    },
    {
      id: 2,
      name: 'Mehmet Aslan',
      rating: 5,
      message: 'Excellent surgeon and very caring doctor. My shoulder surgery was successful and recovery was smooth.',
      date: '2025-01-05',
      doctorReply: null
    },
    {
      id: 3,
      name: 'Fatma Özkan',
      rating: 5,
      message: 'Dr. Eryanılmaz treated my daughter\'s hip dysplasia. Professional, experienced, and great with children.',
      date: '2024-12-28',
      doctorReply: 'It was my pleasure to help your daughter. Children\'s health is always our top priority.'
    },
    {
      id: 4,
      name: 'Ali Demir',
      rating: 5,
      message: 'Had arthroscopic knee surgery. Minimal pain, quick recovery. Highly recommend Dr. Eryanılmaz.',
      date: '2024-12-20',
      doctorReply: null
    },
    {
      id: 5,
      name: 'Zeynep Kaya',
      rating: 5,
      message: 'Professional care from consultation to post-op follow-up. Excellent bedside manner.',
      date: '2024-12-15',
      doctorReply: 'Thank you Zeynep. Your positive attitude made the treatment process much smoother.'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

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
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{review.rating}/5</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{review.message}</p>
                  
                  {review.doctorReply && (
                    <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded">
                      <div className="flex items-center mb-2">
                        <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">
                          {t('reviews.doctorReply')}
                        </span>
                      </div>
                      <p className="text-blue-800">{review.doctorReply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Load More */}
            <div className="text-center">
              <Button variant="outline">
                {t('reviews.loadMoreReviews')}
              </Button>
            </div>
          </div>

          {/* Review Form Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t('reviews.writeReview')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('reviews.rating')}
                  </label>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className="h-6 w-6 text-gray-300 hover:text-yellow-400 cursor-pointer transition-colors"
                      />
                    ))}
                  </div>
                </div>
                
                <Input 
                  placeholder={t('reviews.reviewName')}
                />
                
                <Textarea 
                  placeholder={t('reviews.reviewMessage')}
                  rows={6}
                />
                
                <Button className="w-full">
                  {t('reviews.submitReview')}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;