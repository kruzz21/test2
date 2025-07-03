import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, User, MessageCircle } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface BlogPost {
  id: string;
  title_tr: string;
  title_az: string;
  title_en: string;
  content_tr: string;
  content_az: string;
  content_en: string;
  excerpt_tr: string;
  excerpt_az: string;
  excerpt_en: string;
  image_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogComment {
  id: string;
  post_id: string;
  name: string;
  message: string;
  approved: boolean;
  created_at: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { fetchPostById, fetchComments, addComment } = useBlog();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const [commentForm, setCommentForm] = useState({
    name: '',
    message: ''
  });

  // Get current language suffix
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const postData = await fetchPostById(id);
        
        if (postData) {
          setPost(postData);
          const commentsData = await fetchComments(id);
          setComments(commentsData);
        } else {
          toast({
            title: "Error",
            description: "Blog post not found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error loading blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id, fetchPostById, fetchComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.name || !commentForm.message || !id) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingComment(true);
      
      await addComment({
        post_id: id,
        name: commentForm.name,
        message: commentForm.message
      });
      
      setCommentForm({ name: '', message: '' });
      
      // Refresh comments
      const updatedComments = await fetchComments(id);
      setComments(updatedComments);
      
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCommentForm(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = post[`title${langSuffix}`] || post.title_en;
  const content = post[`content${langSuffix}`] || post.content_en;

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('blog.backToBlog')}
          </Link>

          {/* Article Header */}
          <article className="mb-8">
            {/* Featured Image */}
            {post.image_url && (
              <div className="aspect-video mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.created_at)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getReadingTime(content)} min read
                </div>
              </div>
              <Badge variant="secondary">
                {t('blog.article')}
              </Badge>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h1>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              {t('blog.comments')} ({comments.length})
            </h2>

            {/* Comment Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('blog.leaveComment')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <Input
                    placeholder={t('blog.yourName')}
                    value={commentForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder={t('blog.yourComment')}
                    rows={4}
                    value={commentForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={submittingComment}
                    className="w-full sm:w-auto"
                  >
                    {submittingComment ? t('blog.submitting') : t('blog.submitComment')}
                  </Button>
                  <p className="text-sm text-gray-500">
                    {t('blog.commentModeration')}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">{t('blog.noComments')}</p>
                  <p className="text-gray-500 text-sm">{t('blog.beFirst')}</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 rounded-full p-2">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{comment.name}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Related Articles CTA */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">{t('blog.moreArticles')}</h3>
            <p className="text-gray-600 mb-6">{t('blog.moreArticlesDescription')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/blog" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('blog.viewAllArticles')}
              </Link>
              <Link 
                to="/contact" 
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {t('blog.bookConsultation')}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default BlogDetail;