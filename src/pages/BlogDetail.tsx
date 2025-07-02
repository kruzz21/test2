import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, MessageCircle } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Placeholder blog post data
  const post = {
    id: 1,
    title: 'Understanding Knee Replacement Surgery',
    content: `
      <p>Knee replacement surgery is a common procedure that can significantly improve quality of life for patients suffering from severe knee pain and limited mobility. This comprehensive guide will walk you through everything you need to know about the procedure.</p>
      
      <h2>When is Knee Replacement Necessary?</h2>
      <p>Knee replacement surgery is typically recommended when:</p>
      <ul>
        <li>Severe arthritis causes persistent pain</li>
        <li>Conservative treatments have failed</li>
        <li>Daily activities are significantly impacted</li>
        <li>Quality of life is severely reduced</li>
      </ul>
      
      <h2>Types of Knee Replacement</h2>
      <p>There are two main types of knee replacement surgery:</p>
      
      <h3>Total Knee Replacement</h3>
      <p>In total knee replacement, the entire knee joint is replaced with artificial components. This is the most common type of knee replacement surgery.</p>
      
      <h3>Partial Knee Replacement</h3>
      <p>Partial knee replacement involves replacing only the damaged part of the knee joint. This option is suitable for patients with localized damage.</p>
      
      <h2>The Surgical Procedure</h2>
      <p>The surgery typically takes 1-2 hours and involves removing damaged cartilage and bone, then placing the artificial joint components.</p>
      
      <h2>Recovery and Rehabilitation</h2>
      <p>Recovery from knee replacement surgery requires dedication to physical therapy and following post-operative guidelines. Most patients can return to normal activities within 3-6 months.</p>
      
      <h2>Success Rates</h2>
      <p>Knee replacement surgery has a very high success rate, with over 95% of patients experiencing significant pain relief and improved function.</p>
    `,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    date: '2025-01-15',
    author: 'Dr. Gürkan Eryanılmaz',
    category: 'Surgery',
    readTime: '5 min read'
  };

  // Placeholder comments
  const comments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      message: 'Very informative article! I had knee replacement surgery last year and this information is very accurate.',
      date: '2025-01-16'
    },
    {
      id: 2,
      name: 'Michael Chen',
      message: 'Thank you Dr. Eryanılmaz for this detailed explanation. It really helped me understand the procedure better.',
      date: '2025-01-16'
    }
  ];

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
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
          />
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <Badge variant="outline">{post.category}</Badge>
            <span>{post.readTime}</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        </div>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div 
              className="prose max-w-none prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-ul:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
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
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.message}</p>
                </div>
              ))}
            </div>

            {/* Comment Form */}
            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">{t('blog.leaveComment')}</h4>
              <div className="space-y-4">
                <Input 
                  placeholder={t('blog.commentName')}
                />
                <Textarea 
                  placeholder={t('blog.commentMessage')}
                  rows={4}
                />
                <Button>
                  {t('blog.submitComment')}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {t('blog.commentsReviewed')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogDetail;