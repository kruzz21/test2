import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  HelpCircle, 
  FileText,
  Settings,
  BarChart3
} from 'lucide-react';

const Admin = () => {
  const { t } = useTranslation();

  // Placeholder data
  const stats = {
    pendingAppointments: 12,
    totalPatients: 1543,
    pendingReviews: 8,
    unansweredQuestions: 4,
    publishedBlogs: 24,
    totalViews: 8932
  };

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t('admin.title')}</h1>
            <p className="text-gray-600">{t('admin.subtitle')}</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.pendingAppointments')}</p>
                    <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.totalPatients')}</p>
                    <p className="text-3xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.pendingReviews')}</p>
                    <p className="text-3xl font-bold">{stats.pendingReviews}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.unansweredQuestions')}</p>
                    <p className="text-3xl font-bold">{stats.unansweredQuestions}</p>
                  </div>
                  <HelpCircle className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.publishedBlogs')}</p>
                    <p className="text-3xl font-bold">{stats.publishedBlogs}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t('admin.websiteViews')}</p>
                    <p className="text-3xl font-bold">{stats.totalViews}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {t('admin.appointmentManagement')}
                    </span>
                    <Button>Add Appointment</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">John Smith - Knee Consultation</p>
                        <p className="text-sm text-gray-600">January 20, 2025 at 10:00 AM</p>
                        <p className="text-sm text-gray-600">+994 55 123 45 67</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Pending</Badge>
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Confirm</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Sarah Johnson - Hip Surgery Follow-up</p>
                        <p className="text-sm text-gray-600">January 22, 2025 at 2:30 PM</p>
                        <p className="text-sm text-gray-600">+994 55 987 65 43</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>Confirmed</Badge>
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      {t('admin.blogManagement')}
                    </span>
                    <Button>Create New Post</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Understanding Knee Replacement Surgery</p>
                        <p className="text-sm text-gray-600">Published on January 15, 2025</p>
                        <p className="text-sm text-gray-600">234 views, 5 comments</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge>Published</Badge>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">View Comments</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    {t('admin.patientReviews')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <p className="font-medium mr-2">Maria Garcia</p>
                          <div className="flex">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          "Excellent care and surgery. Dr. Eryanılmaz was very professional..."
                        </p>
                        <p className="text-xs text-gray-500">January 18, 2025</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Pending</Badge>
                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="outline">Reply</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    {t('admin.faqManagement')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          "How long does recovery take after knee replacement?"
                        </p>
                        <p className="text-sm text-gray-600">
                          Asked by: Anonymous Patient on January 19, 2025
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Unanswered</Badge>
                        <Button size="sm">Answer</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    {t('admin.contentManagement')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Website Content</h3>
                      <Button variant="outline" className="w-full justify-start">
                        Edit Homepage Content
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Edit About Page
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Edit Services
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Manage Symptoms & Treatments
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold">Multilingual Content</h3>
                      <Button variant="outline" className="w-full justify-start">
                        Turkish Content
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Azerbaijani Content
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        English Content
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    {t('admin.systemSettings')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">Update Phone Number</Button>
                        <Button variant="outline">Update Email</Button>
                        <Button variant="outline">Update Address</Button>
                        <Button variant="outline">Update Social Media</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">System Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">Backup Data</Button>
                        <Button variant="outline">Export Appointments</Button>
                        <Button variant="outline">Site Analytics</Button>
                        <Button variant="outline">Security Settings</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;