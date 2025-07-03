import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, MessageCircle, RefreshCw } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { Toaster } from '@/components/ui/toaster';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { loading, error, fetchBlogPost, fetchBlogComments, addBlogComment } = useBlog();
  
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentForm, setCommentForm] = useState({
    name: '',
    message: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!id) {
        console.error('No blog post ID provided');
        return;
      }

      try {
        console.log('Loading blog post with ID:', id);
        
        // Fetch the blog post
        const postData = await fetchBlogPost(id);
        console.log('Blog post loaded:', postData);
        setPost(postData);

        // Fetch comments for this post
        const commentsData = await fetchBlogComments(id);
        console.log('Comments loaded:', commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error loading blog post:', error);
        // Error is already handled in the hook
      }
    };

    loadBlogPost();
  }, [id, fetchBlogPost, fetchBlogComments]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentForm.name || !commentForm.message || !id) {
      return;
    }

    try {
      setSubmittingComment(true);
      
      await addBlogComment({
        post_id: id,
        name: commentForm.name,
        message: commentForm.message
      });

      // Reset form
      setCommentForm({ name: '', message: '' });
      
      // Refresh comments
      const updatedComments = await fetchBlogComments(id);
      setComments(updatedComments);
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleRetry = () => {
    if (id) {
      const loadBlogPost = async () => {
        try {
          const postData = await fetchBlogPost(id);
          setPost(postData);
          const commentsData = await fetchBlogComments(id);
          setComments(commentsData);
        } catch (error) {
          console.error('Error retrying blog post load:', error);
        }
      };
      loadBlogPost();
    }
  };

  if (loading && !post) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Failed to Load Blog Post
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <div>
                    <Link to="/blog">
                      <Button variant="ghost" className="text-gray-600">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Blog
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Blog Post Not Found
                </h3>
                <p className="text-gray-600 mb-4">
                  The blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/blog">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Blog
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use multilingual content based on current language
  const title = post[`title${langSuffix}`] || post.title_en;
  const content = post[`content${langSuffix}`] || post.content_en;

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('blog.backToBlog')}
              </Button>
            </Link>
          </div>

          {/* Blog Post */}
          <article className="mb-12">
            {/* Featured Image */}
            {post.image_url && (
              <div className="aspect-video mb-8 overflow-hidden rounded-lg">
                <img 
                  src={post.image_url} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Post Header */}
            <header className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="secondary">{t('blog.article')}</Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-1" />
                  Dr. Gürkan Eryanılmaz
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
            </header>

            {/* Post Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>

          {/* Comments Section */}
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold mb-8 flex items-center">
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
                    onChange={(e) => setCommentForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Textarea
                    placeholder={t('blog.yourComment')}
                    rows={4}
                    value={commentForm.message}
                    onChange={(e) => setCommentForm(prev => ({ ...prev, message: e.target.value }))}
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={submittingComment || !commentForm.name || !commentForm.message}
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
                  <p className="text-gray-600">{t('blog.noComments')}</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{comment.name}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{comment.message}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default BlogDetail;