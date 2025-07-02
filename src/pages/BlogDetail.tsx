import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { Toaster } from '@/components/ui/toaster';

const BlogDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { fetchPost, fetchComments, addComment } = useBlog();
  
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  // Get current language suffix
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          fetchPost(id),
          fetchComments(id)
        ]);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error loading blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchPost, fetchComments]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.message || !id) {
      return;
    }

    try {
      await addComment({
        post_id: id,
        name: formData.name,
        message: formData.message
      });
      setFormData({ name: '', message: '' });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <p>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('blog.backToBlog')}
          </Link>
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <img
            src={post.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt={post[`title${langSuffix}`]}
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
          />
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              Dr. Gürkan Eryanılmaz
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post[`title${langSuffix}`]}</h1>
        </div>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="prose max-w-none prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-ul:text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: post[`content${langSuffix}`] }} />
            </div>
          </CardContent>
        </Card>

        {/* Author Bio */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Dr. Gürkan Eryanılmaz"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-bold text-lg">Dr. Gürkan Eryanılmaz</h3>
                <p className="text-gray-600 mb-2">Orthopedics & Traumatology Specialist</p>
                <p className="text-sm text-gray-700">
                  Dr. Eryanılmaz has over 25 years of experience in orthopedic surgery, 
                  specializing in joint replacement and trauma surgery.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('blog.comments')} ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Existing Comments */}
            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{comment.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.message}</p>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-gray-600 text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            {/* Comment Form */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">{t('blog.leaveComment')}</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  placeholder={t('blog.commentName')}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <Textarea 
                  placeholder={t('blog.commentMessage')}
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  required
                />
                <Button type="submit">
                  {t('blog.submitComment')}
                </Button>
              </form>
              <p className="text-sm text-gray-500 mt-2">
                {t('blog.commentsReviewed')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  );
};

export default BlogDetail;