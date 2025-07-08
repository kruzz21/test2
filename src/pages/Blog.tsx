import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, User, ArrowRight, RefreshCw, Search, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import { useBlog } from '@/hooks/useBlog';
import { Toaster } from '@/components/ui/toaster';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const { blogPosts, loading, error, fetchBlogPosts } = useBlog();

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  const handleRetry = () => {
    fetchBlogPosts();
  };

  // Get featured post (first post) and remaining posts
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen py-12 w-full bg-gray-50">
      <div className="w-full px-4 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            {t('blog.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Insights, updates, and recovery stories from Dr. Eryanılmaz
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">Loading latest articles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-red-800 mb-3">
                  Failed to Load Blog Posts
                </h3>
                <p className="text-red-600 mb-6">{error}</p>
                <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md mx-auto shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  No Blog Posts Available
                </h3>
                <p className="text-gray-600">
                  Check back later for new articles and insights from Dr. Eryanılmaz.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Featured Post Section */}
              {featuredPost && (
                <section className="mb-16">
                  <div className="flex items-center mb-8">
                    <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900">Featured Article</h2>
                  </div>
                  
                  <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Featured Image */}
                      <div className="relative h-64 lg:h-full">
                        <img 
                          src={featuredPost.image_url || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                          alt={featuredPost[`title${langSuffix}`] || featuredPost.title_en}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                      </div>
                      
                      {/* Featured Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Featured Article
                          </Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(featuredPost.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                          {featuredPost[`title${langSuffix}`] || featuredPost.title_en}
                        </h3>
                        
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed line-clamp-3">
                          {featuredPost[`excerpt${langSuffix}`] || featuredPost.excerpt_en}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-2" />
                            Dr. Gürkan Eryanılmaz
                          </div>
                          
                          <Link to={`/blog/${featuredPost.id}`}>
                            <Button size="lg" className="group">
                              Read Full Article
                              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>
              )}

              {/* Category Tabs and Search */}
              <section className="mb-12">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default" size="sm" className="rounded-full px-6">
                      All
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-6 hover:bg-blue-50">
                      Surgery
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-6 hover:bg-blue-50">
                      Recovery
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-6 hover:bg-blue-50">
                      Tips
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-6 hover:bg-blue-50">
                      Rehabilitation
                    </Button>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative lg:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search articles..." 
                      className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Articles Grid */}
              <section className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="w-2 h-8 bg-blue-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                </div>
                
                {remainingPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {remainingPosts.map((post: any) => {
                      const title = post[`title${langSuffix}`] || post.title_en;
                      const excerpt = post[`excerpt${langSuffix}`] || post.excerpt_en;

                      return (
                        <Card key={post.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-lg">
                          {/* Article Image */}
                          {post.image_url && (
                            <div className="aspect-video overflow-hidden">
                              <img 
                                src={post.image_url} 
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <CardHeader className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="secondary" className="text-xs">
                                {t('blog.article')}
                              </Badge>
                              <div className="flex items-center text-xs text-gray-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(post.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                              {title}
                            </CardTitle>
                          </CardHeader>
                          
                          <CardContent className="px-6 pb-6">
                            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                              {excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="h-4 w-4 mr-1" />
                                Dr. Gürkan Eryanılmaz
                              </div>
                              
                              <Link to={`/blog/${post.id}`}>
                                <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                  {t('blog.readMore')}
                                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No additional articles available.</p>
                  </div>
                )}
              </section>

              {/* Pagination */}
              <section className="mb-16">
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" size="sm" disabled className="w-10 h-10 p-0">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="w-10 h-10 p-0">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </section>

              {/* Newsletter CTA Strip */}
              <section className="mb-16">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 border border-blue-100">
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      Get updates from Dr. Eryanılmaz
                    </h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      Stay informed with the latest medical insights, treatment updates, and health tips delivered directly to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <Input 
                        placeholder="Enter your email address" 
                        className="flex-1 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button size="lg" className="px-8">
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Final CTA Section */}
          <section className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg border border-gray-100">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Have a question? Schedule a consultation.
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Get personalized medical advice and treatment recommendations from Dr. Eryanılmaz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8 py-3">
                  <Link to="/contact">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                  <Link to="/areas-of-expertise">
                    Explore Services
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Blog;