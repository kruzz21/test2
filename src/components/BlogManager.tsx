import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Edit, Trash2, Plus, MessageCircle, Eye, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  blog_posts?: {
    title_en: string;
  };
}

const BlogManager = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [pendingComments, setPendingComments] = useState<BlogComment[]>([]);
  const [approvedComments, setApprovedComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);

  const [postFormData, setPostFormData] = useState({
    title_tr: '',
    title_az: '',
    title_en: '',
    content_tr: '',
    content_az: '',
    content_en: '',
    excerpt_tr: '',
    excerpt_az: '',
    excerpt_en: '',
    image_url: '',
    published: false
  });

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Fetch pending comments
      const { data: pending, error: pendingError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blog_posts (
            title_en
          )
        `)
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;

      // Fetch approved comments
      const { data: approved, error: approvedError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          blog_posts (
            title_en
          )
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;

      setPendingComments(pending || []);
      setApprovedComments(approved || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
    fetchComments();
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setPostFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setPostFormData({
      title_tr: '',
      title_az: '',
      title_en: '',
      content_tr: '',
      content_az: '',
      content_en: '',
      excerpt_tr: '',
      excerpt_az: '',
      excerpt_en: '',
      image_url: '',
      published: false
    });
  };

  const handleCreatePost = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .insert(postFormData);

      if (error) throw error;

      await fetchBlogPosts();
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Blog post created successfully.",
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ ...postFormData, updated_at: new Date().toISOString() })
        .eq('id', editingPost.id);

      if (error) throw error;

      await fetchBlogPosts();
      setIsEditDialogOpen(false);
      setEditingPost(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Blog post updated successfully.",
      });
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast({
        title: "Error",
        description: "Failed to update blog post.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchBlogPosts();
      
      toast({
        title: "Success",
        description: "Blog post deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAction = async (commentId: string, approved: boolean) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved })
        .eq('id', commentId);

      if (error) throw error;

      await fetchComments();
      
      toast({
        title: "Success",
        description: `Comment ${approved ? 'approved' : 'rejected'} successfully.`,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      await fetchComments();
      
      toast({
        title: "Success",
        description: "Comment deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setPostFormData({
      title_tr: post.title_tr,
      title_az: post.title_az,
      title_en: post.title_en,
      content_tr: post.content_tr,
      content_az: post.content_az,
      content_en: post.content_en,
      excerpt_tr: post.excerpt_tr,
      excerpt_az: post.excerpt_az,
      excerpt_en: post.excerpt_en,
      image_url: post.image_url || '',
      published: post.published
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const getCommentsForPost = (postId: string, approved: boolean) => {
    const comments = approved ? approvedComments : pendingComments;
    return comments.filter(comment => comment.post_id === postId);
  };

  const getStatusColor = (published: boolean) => {
    return published 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Blog Management
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">
              Blog Posts ({blogPosts.length})
            </TabsTrigger>
            <TabsTrigger value="pending-comments">
              Pending Comments ({pendingComments.length})
            </TabsTrigger>
            <TabsTrigger value="approved-comments">
              Approved Comments ({approvedComments.length})
            </TabsTrigger>
          </TabsList>

          {/* Blog Posts Tab */}
          <TabsContent value="posts" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading blog posts...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No blog posts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium mr-2">{post.title_en}</h3>
                          <Badge className={getStatusColor(post.published)}>
                            {post.published ? 'PUBLISHED' : 'DRAFT'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{post.excerpt_en}</p>
                        <div className="flex items-center text-xs text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {getCommentsForPost(post.id, true).length + getCommentsForPost(post.id, false).length} comments
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPostComments(selectedPostComments === post.id ? null : post.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Comments
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(post)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{post.title_en}"? 
                                This action cannot be undone and will also delete all associated comments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    {/* Comments for this post */}
                    {selectedPostComments === post.id && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-3">Comments for this post</h4>
                        <div className="space-y-3">
                          {/* Pending comments */}
                          {getCommentsForPost(post.id, false).map((comment) => (
                            <div key={comment.id} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <User className="h-3 w-3 mr-1" />
                                    <span className="font-medium text-sm">{comment.name}</span>
                                    <Badge variant="secondary" className="ml-2 text-xs">PENDING</Badge>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex space-x-1">
                                  <Button 
                                    size="sm"
                                    onClick={() => handleCommentAction(comment.id, true)}
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleCommentAction(comment.id, false)}
                                  >
                                    <XCircle className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Approved comments */}
                          {getCommentsForPost(post.id, true).map((comment) => (
                            <div key={comment.id} className="bg-green-50 border border-green-200 rounded p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center mb-1">
                                    <User className="h-3 w-3 mr-1" />
                                    <span className="font-medium text-sm">{comment.name}</span>
                                    <Badge variant="secondary" className="ml-2 text-xs">APPROVED</Badge>
                                  </div>
                                  <p className="text-sm text-gray-700">{comment.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="flex space-x-1">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this comment? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteComment(comment.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          ))}

                          {getCommentsForPost(post.id, false).length === 0 && getCommentsForPost(post.id, true).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No comments for this post yet.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Pending Comments Tab */}
          <TabsContent value="pending-comments" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading pending comments...</p>
              </div>
            ) : pendingComments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending comments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="font-medium">{comment.name}</span>
                          <Badge variant="secondary" className="ml-2">PENDING</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Post:</strong> {comment.blog_posts?.title_en || 'Unknown Post'}
                        </p>
                        <p className="text-gray-700 mb-2">{comment.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleCommentAction(comment.id, true)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Approved Comments Tab */}
          <TabsContent value="approved-comments" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading approved comments...</p>
              </div>
            ) : approvedComments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No approved comments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedComments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          <span className="font-medium">{comment.name}</span>
                          <Badge className="ml-2 bg-green-100 text-green-800">APPROVED</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Post:</strong> {comment.blog_posts?.title_en || 'Unknown Post'}
                        </p>
                        <p className="text-gray-700 mb-2">{comment.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this comment from {comment.name}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create Post Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="excerpts">Excerpts</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (Turkish)</Label>
                    <Input
                      value={postFormData.title_tr}
                      onChange={(e) => handleInputChange('title_tr', e.target.value)}
                      placeholder="Turkish title..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (Azerbaijani)</Label>
                    <Input
                      value={postFormData.title_az}
                      onChange={(e) => handleInputChange('title_az', e.target.value)}
                      placeholder="Azerbaijani title..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (English)</Label>
                    <Input
                      value={postFormData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      placeholder="English title..."
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (Turkish)</Label>
                    <Textarea
                      value={postFormData.content_tr}
                      onChange={(e) => handleInputChange('content_tr', e.target.value)}
                      rows={8}
                      placeholder="Turkish content..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (Azerbaijani)</Label>
                    <Textarea
                      value={postFormData.content_az}
                      onChange={(e) => handleInputChange('content_az', e.target.value)}
                      rows={8}
                      placeholder="Azerbaijani content..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (English)</Label>
                    <Textarea
                      value={postFormData.content_en}
                      onChange={(e) => handleInputChange('content_en', e.target.value)}
                      rows={8}
                      placeholder="English content..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="excerpts" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (Turkish)</Label>
                    <Textarea
                      value={postFormData.excerpt_tr}
                      onChange={(e) => handleInputChange('excerpt_tr', e.target.value)}
                      rows={3}
                      placeholder="Turkish excerpt..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (Azerbaijani)</Label>
                    <Textarea
                      value={postFormData.excerpt_az}
                      onChange={(e) => handleInputChange('excerpt_az', e.target.value)}
                      rows={3}
                      placeholder="Azerbaijani excerpt..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (English)</Label>
                    <Textarea
                      value={postFormData.excerpt_en}
                      onChange={(e) => handleInputChange('excerpt_en', e.target.value)}
                      rows={3}
                      placeholder="English excerpt..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Featured Image URL</Label>
                    <Input
                      value={postFormData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={postFormData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="excerpts">Excerpts</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (Turkish)</Label>
                    <Input
                      value={postFormData.title_tr}
                      onChange={(e) => handleInputChange('title_tr', e.target.value)}
                      placeholder="Turkish title..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (Azerbaijani)</Label>
                    <Input
                      value={postFormData.title_az}
                      onChange={(e) => handleInputChange('title_az', e.target.value)}
                      placeholder="Azerbaijani title..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Title (English)</Label>
                    <Input
                      value={postFormData.title_en}
                      onChange={(e) => handleInputChange('title_en', e.target.value)}
                      placeholder="English title..."
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (Turkish)</Label>
                    <Textarea
                      value={postFormData.content_tr}
                      onChange={(e) => handleInputChange('content_tr', e.target.value)}
                      rows={8}
                      placeholder="Turkish content..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (Azerbaijani)</Label>
                    <Textarea
                      value={postFormData.content_az}
                      onChange={(e) => handleInputChange('content_az', e.target.value)}
                      rows={8}
                      placeholder="Azerbaijani content..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Content (English)</Label>
                    <Textarea
                      value={postFormData.content_en}
                      onChange={(e) => handleInputChange('content_en', e.target.value)}
                      rows={8}
                      placeholder="English content..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="excerpts" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (Turkish)</Label>
                    <Textarea
                      value={postFormData.excerpt_tr}
                      onChange={(e) => handleInputChange('excerpt_tr', e.target.value)}
                      rows={3}
                      placeholder="Turkish excerpt..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (Azerbaijani)</Label>
                    <Textarea
                      value={postFormData.excerpt_az}
                      onChange={(e) => handleInputChange('excerpt_az', e.target.value)}
                      rows={3}
                      placeholder="Azerbaijani excerpt..."
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Excerpt (English)</Label>
                    <Textarea
                      value={postFormData.excerpt_en}
                      onChange={(e) => handleInputChange('excerpt_en', e.target.value)}
                      rows={3}
                      placeholder="English excerpt..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1">Featured Image URL</Label>
                    <Input
                      value={postFormData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published-edit"
                      checked={postFormData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                    <Label htmlFor="published-edit">Published</Label>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('ui.cancel')}
                </Button>
                <Button onClick={handleUpdatePost}>
                  {t('blogManager.updatePost')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BlogManager;