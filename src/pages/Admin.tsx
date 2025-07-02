import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Star, 
  HelpCircle, 
  FileText,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const { t } = useTranslation();
  const { 
    stats, 
    fetchPendingAppointments, 
    fetchPendingReviews, 
    fetchPendingFAQSubmissions,
    updateAppointmentStatus,
    approveReview,
    answerFAQSubmission,
    rejectFAQSubmission,
    fetchStats
  } = useAdmin();
  
  const [pendingAppointments, setPendingAppointments] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [pendingFAQSubmissions, setPendingFAQSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState({
    answer_tr: '',
    answer_az: '',
    answer_en: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointments, reviews, faqSubmissions] = await Promise.all([
          fetchPendingAppointments(),
          fetchPendingReviews(),
          fetchPendingFAQSubmissions()
        ]);
        
        setPendingAppointments(appointments);
        setPendingReviews(reviews);
        setPendingFAQSubmissions(faqSubmissions);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    loadData();
  }, [fetchPendingAppointments, fetchPendingReviews, fetchPendingFAQSubmissions]);

  const handleAppointmentAction = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      // Refresh pending appointments
      const appointments = await fetchPendingAppointments();
      setPendingAppointments(appointments);
      toast({
        title: "Success",
        description: `Appointment ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status.",
        variant: "destructive",
      });
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await approveReview(id);
      // Refresh pending reviews
      const reviews = await fetchPendingReviews();
      setPendingReviews(reviews);
      toast({
        title: "Success",
        description: "Review approved successfully.",
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerFAQ = async () => {
    if (!selectedSubmission || !answers.answer_tr || !answers.answer_az || !answers.answer_en) {
      toast({
        title: "Error",
        description: "Please provide answers in all languages.",
        variant: "destructive",
      });
      return;
    }

    try {
      await answerFAQSubmission(selectedSubmission.id, answers);
      // Refresh pending FAQ submissions
      const submissions = await fetchPendingFAQSubmissions();
      setPendingFAQSubmissions(submissions);
      setSelectedSubmission(null);
      setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
      toast({
        title: "Success",
        description: "FAQ answered and published successfully.",
      });
    } catch (error) {
      console.error('Error answering FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to answer FAQ submission.",
        variant: "destructive",
      });
    }
  };

  const handleRejectFAQ = async (id: string) => {
    try {
      await rejectFAQSubmission(id);
      // Refresh pending FAQ submissions
      const submissions = await fetchPendingFAQSubmissions();
      setPendingFAQSubmissions(submissions);
      toast({
        title: "Success",
        description: "FAQ submission rejected.",
      });
    } catch (error) {
      console.error('Error rejecting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to reject FAQ submission.",
        variant: "destructive",
      });
    }
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
              <TabsTrigger value="faq">FAQ Submissions</TabsTrigger>
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

            {/* FAQ Submissions Tab */}
            <TabsContent value="faq">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    FAQ Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingFAQSubmissions.length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No pending FAQ submissions</p>
                    ) : (
                      pendingFAQSubmissions.map((submission) => (
                        <div key={submission.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <p className="font-medium mr-2">{submission.name}</p>
                              {submission.email && (
                                <p className="text-sm text-gray-500">({submission.email})</p>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{submission.question_en}</p>
                            <p className="text-xs text-gray-500">
                              Submitted on: {new Date(submission.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{submission.status}</Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  onClick={() => setSelectedSubmission(submission)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Answer
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Answer FAQ Question</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium mb-2">Question:</p>
                                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded">
                                      {selectedSubmission?.question_en}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Answer (Turkish)</label>
                                      <Textarea
                                        value={answers.answer_tr}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, answer_tr: e.target.value }))}
                                        rows={3}
                                        placeholder="Turkish answer..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Answer (Azerbaijani)</label>
                                      <Textarea
                                        value={answers.answer_az}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, answer_az: e.target.value }))}
                                        rows={3}
                                        placeholder="Azerbaijani answer..."
                                      />
                                    </div>
                                    
                                    <div>
                                      <label className="block text-sm font-medium mb-1">Answer (English)</label>
                                      <Textarea
                                        value={answers.answer_en}
                                        onChange={(e) => setAnswers(prev => ({ ...prev, answer_en: e.target.value }))}
                                        rows={3}
                                        placeholder="English answer..."
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleAnswerFAQ}>
                                      Approve & Publish
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectFAQ(submission.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
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