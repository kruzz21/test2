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
  XCircle,
  LogOut,
  History,
  CalendarDays
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import AdminLogin from '@/components/AdminLogin';
import AppointmentHistory from '@/components/AppointmentHistory';
import AppointmentManager from '@/components/AppointmentManager';
import EnhancedAppointmentCalendar from '@/components/EnhancedAppointmentCalendar';

const Admin = () => {
  const { t } = useTranslation();
  const { session, loading: authLoading, isAuthenticated, logout } = useAdminAuth();
  const { 
    stats, 
    fetchPendingReviews, 
    fetchPendingFAQSubmissions,
    approveReview,
    answerFAQSubmission,
    rejectFAQSubmission,
    fetchStats
  } = useAdmin(isAuthenticated);
  
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [pendingFAQSubmissions, setPendingFAQSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [questions, setQuestions] = useState({
    question_tr: '',
    question_az: '',
    question_en: ''
  });
  const [answers, setAnswers] = useState({
    answer_tr: '',
    answer_az: '',
    answer_en: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reviews, faqSubmissions] = await Promise.all([
          fetchPendingReviews(),
          fetchPendingFAQSubmissions()
        ]);
        
        setPendingReviews(reviews);
        setPendingFAQSubmissions(faqSubmissions);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, fetchPendingReviews, fetchPendingFAQSubmissions]);

  // Show loading screen if authentication is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => window.location.reload()} />;
  }

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
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

    if (!questions.question_tr || !questions.question_az || !questions.question_en) {
      toast({
        title: "Error",
        description: "Please provide questions in all languages.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the FAQ with edited questions and answers
      await answerFAQSubmission(selectedSubmission.id, {
        question_tr: questions.question_tr,
        question_az: questions.question_az,
        question_en: questions.question_en,
        answer_tr: answers.answer_tr,
        answer_az: answers.answer_az,
        answer_en: answers.answer_en
      });
      
      // Refresh pending FAQ submissions
      const submissions = await fetchPendingFAQSubmissions();
      setPendingFAQSubmissions(submissions);
      setSelectedSubmission(null);
      setQuestions({ question_tr: '', question_az: '', question_en: '' });
      setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
      setIsDialogOpen(false);
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

  const openAnswerDialog = (submission: any) => {
    setSelectedSubmission(submission);
    // Pre-populate questions with the original submission
    setQuestions({
      question_tr: submission.question_tr || '',
      question_az: submission.question_az || '',
      question_en: submission.question_en || ''
    });
    setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Logout */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t('admin.title')}</h1>
              <p className="text-gray-600">{t('admin.subtitle')}</p>
              {session && (
                <p className="text-sm text-gray-500 mt-1">
                  Welcome back, {session.admin.name}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
              <TabsTrigger value="appointments">Pending</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Pending Appointments Tab */}
            <TabsContent value="appointments">
              <AppointmentManager />
            </TabsContent>

            {/* Appointment History Tab */}
            <TabsContent value="history">
              <AppointmentHistory />
            </TabsContent>

            {/* Appointment Calendar Tab */}
            <TabsContent value="calendar">
              <EnhancedAppointmentCalendar />
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
                            <Button 
                              size="sm"
                              onClick={() => openAnswerDialog(submission)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Answer
                            </Button>
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

      {/* Enhanced Answer FAQ Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Answer FAQ Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Original Question Display */}
            <div>
              <p className="font-medium mb-2">Original Question:</p>
              <div className="p-3 bg-gray-50 rounded border">
                <p className="text-sm text-gray-700">
                  <strong>From:</strong> {selectedSubmission?.name} {selectedSubmission?.email && `(${selectedSubmission.email})`}
                </p>
                <p className="text-sm text-gray-700 mt-2">
                  {selectedSubmission?.question_en}
                </p>
              </div>
            </div>
            
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="questions">Edit Questions</TabsTrigger>
                <TabsTrigger value="answers">Add Answers</TabsTrigger>
              </TabsList>

              {/* Questions Tab */}
              <TabsContent value="questions" className="space-y-4">
                <p className="text-sm text-gray-600">
                  Edit and translate the question for all languages before publishing:
                </p>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Question (Turkish)</label>
                  <Textarea
                    value={questions.question_tr}
                    onChange={(e) => setQuestions(prev => ({ ...prev, question_tr: e.target.value }))}
                    rows={3}
                    placeholder="Turkish question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Question (Azerbaijani)</label>
                  <Textarea
                    value={questions.question_az}
                    onChange={(e) => setQuestions(prev => ({ ...prev, question_az: e.target.value }))}
                    rows={3}
                    placeholder="Azerbaijani question..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Question (English)</label>
                  <Textarea
                    value={questions.question_en}
                    onChange={(e) => setQuestions(prev => ({ ...prev, question_en: e.target.value }))}
                    rows={3}
                    placeholder="English question..."
                  />
                </div>
              </TabsContent>

              {/* Answers Tab */}
              <TabsContent value="answers" className="space-y-4">
                <p className="text-sm text-gray-600">
                  Provide answers in all languages:
                </p>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Answer (Turkish)</label>
                  <Textarea
                    value={answers.answer_tr}
                    onChange={(e) => setAnswers(prev => ({ ...prev, answer_tr: e.target.value }))}
                    rows={4}
                    placeholder="Turkish answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Answer (Azerbaijani)</label>
                  <Textarea
                    value={answers.answer_az}
                    onChange={(e) => setAnswers(prev => ({ ...prev, answer_az: e.target.value }))}
                    rows={4}
                    placeholder="Azerbaijani answer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Answer (English)</label>
                  <Textarea
                    value={answers.answer_en}
                    onChange={(e) => setAnswers(prev => ({ ...prev, answer_en: e.target.value }))}
                    rows={4}
                    placeholder="English answer..."
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAnswerFAQ}>
                Approve & Publish FAQ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
};

export default Admin;