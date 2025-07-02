import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const { t } = useTranslation();

  // Placeholder blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding Knee Replacement Surgery',
      excerpt: 'A comprehensive guide to knee replacement surgery, recovery, and what to expect during the process.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2025-01-15',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'Surgery',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Sports Injuries: Prevention and Treatment',
      excerpt: 'Learn about common sports injuries and how to prevent them with proper techniques and preparation.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2025-01-10',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'Sports Medicine',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'Pediatric Hip Dysplasia: Early Detection',
      excerpt: 'Important information for parents about recognizing and treating hip dysplasia in children.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2025-01-05',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'Pediatric',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Arthroscopic Surgery: Minimally Invasive Solutions',
      excerpt: 'Discover the benefits of arthroscopic surgery for joint problems and faster recovery times.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2024-12-28',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'Surgery',
      readTime: '4 min read'
    },
    {
      id: 5,
      title: 'Shoulder Pain: Causes and Treatment Options',
      excerpt: 'Understanding different types of shoulder pain and available treatment approaches.',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2024-12-20',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'General',
      readTime: '5 min read'
    },
    {
      id: 6,
      title: 'Post-Surgery Rehabilitation Guidelines',
      excerpt: 'Essential tips for successful recovery and rehabilitation after orthopedic surgery.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      date: '2024-12-15',
      author: 'Dr. Gürkan Eryanılmaz',
      category: 'Recovery',
      readTime: '7 min read'
    }
  ];

  const categories = ['All', 'Surgery', 'Sports Medicine', 'Pediatric', 'General', 'Recovery'];

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
          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4">{t('blog.featured')}</Badge>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(blogPosts[0].date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blogPosts[0].author}
                  </div>
                  <Badge variant="outline">{blogPosts[0].category}</Badge>
                </div>
                <h2 className="text-2xl font-bold mb-4">{blogPosts[0].title}</h2>
                <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>
                <Button asChild>
                  <Link to={`/blog/${blogPosts[0].id}`}>
                    {t('blog.readMore')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
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

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t('blog.loadMoreArticles')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;