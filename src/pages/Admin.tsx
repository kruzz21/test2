import { useState, useEffect } from 'react';
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
import { useAdmin } from '@/hooks/useAdmin';
import { useAppointments } from '@/hooks/useAppointments';
import { Toaster } from '@/components/ui/toaster';

const Admin = () => {
  const { t } = useTranslation();
  const { stats, fetchPendingAppointments, fetchPendingReviews, approveReview, fetchPendingFAQs } = useAdmin();
  const { updateAppointmentStatus } = useAppointments();
  
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [pendingFAQs, setPendingFAQs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [appointments, reviews, faqs] = await Promise.all([
        fetchPendingAppointments(),
        fetchPendingReviews(),
        fetchPendingFAQs()
      ]);
      
      setPendingAppointments(appointments);
      setPendingReviews(reviews);
      setPendingFAQs(faqs);
    };

    loadData();
  }, [fetchPendingAppointments, fetchPendingReviews, fetchPendingFAQs]);

  const handleAppointmentAction = async (id: string, status: string) => {
    await updateAppointmentStatus(id, status);
    // Refresh pending appointments
    const appointments = await fetchPendingAppointments();
    setPendingAppointments(appointments);
  };

  const handleApproveReview = async (id: string) => {
    await approveReview(id);
    // Refresh pending reviews
    const reviews = await fetchPendingReviews();
    setPendingReviews(reviews);
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {t('admin.appointmentManagement')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingAppointments.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No pending appointments</p>
                    ) : (
                      pendingAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{appointment.name} - {appointment.service}</p>
                            <p className="text-sm text-gray-600">{appointment.preferred_date} at {appointment.preferred_time}</p>
                            <p className="text-sm text-gray-600">{appointment.phone}</p>
                            <p className="text-sm text-gray-600">{appointment.email}</p>
                            {appointment.message && (
                              <p className="text-sm text-gray-600 mt-1">Message: {appointment.message}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{appointment.status}</Badge>
                            <Button 
                              size="sm" 
                              onClick={() => handleAppointmentAction(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                    {pendingReviews.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No pending reviews</p>
                    ) : (
                      pendingReviews.map((review) => (
                        <div key={review.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <p className="font-medium mr-2">{review.name}</p>
                              <div className="flex">
                                {[1,2,3,4,5].map(i => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{review.message}</p>
                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Pending</Badge>
                            <Button 
                              size="sm"
                              onClick={() => handleApproveReview(review.id)}
                            >
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
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
                    {pendingFAQs.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No pending questions</p>
                    ) : (
                      pendingFAQs.map((faq) => (
                        <div key={faq.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{faq.question_en}</p>
                            <p className="text-sm text-gray-600">
                              Asked on: {new Date(faq.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Unanswered</Badge>
                            <Button size="sm">Answer</Button>
                          </div>
                        </div>
                      ))
                    )}
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
      <Toaster />
    </div>
  );
};

export default Admin;