import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBlog } from '@/hooks/useBlog';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const { posts, loading } = useBlog();

  // Get current language suffix
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  const categories = ['All', 'Surgery', 'Sports Medicine', 'Pediatric', 'General', 'Recovery'];

  if (loading) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('blog.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer hover:bg-blue-100 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No blog posts available yet.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {posts.length > 0 && (
                <Card className="mb-12 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={posts[0].image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                        alt={posts[0][`title${langSuffix}`]}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4">{t('blog.featured')}</Badge>
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(posts[0].created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          Dr. Gürkan Eryanılmaz
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">{posts[0][`title${langSuffix}`]}</h2>
                      <p className="text-gray-600 mb-6">{posts[0][`excerpt${langSuffix}`]}</p>
                      <Button asChild>
                        <Link to={`/blog/${posts[0].id}`}>
                          {t('blog.readMore')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Blog Posts Grid */}
              {posts.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.slice(1).map((post: any) => (
                    <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <img
                          src={post.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                          alt={post[`title${langSuffix}`]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{post[`title${langSuffix}`]}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post[`excerpt${langSuffix}`]}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/blog/${post.id}`}>
                            {t('blog.readMore')}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;