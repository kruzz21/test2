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
  CalendarDays,
  Images
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import AdminLogin from '@/components/AdminLogin';
import AppointmentHistory from '@/components/AppointmentHistory';
import AppointmentManager from '@/components/AppointmentManager';
import EnhancedAppointmentCalendar from '@/components/EnhancedAppointmentCalendar';
import ReviewManager from '@/components/ReviewManager';
import FAQManager from '@/components/FAQManager';
import BlogManager from '@/components/BlogManager';
import GalleryManager from '@/components/GalleryManager';

const Admin = () => {
  const { t } = useTranslation();
  const { session, loading: authLoading, isAuthenticated, logout } = useAdminAuth();
  const { 
    stats, 
    fetchStats
  } = useAdmin(isAuthenticated);

  // Show loading screen if authentication is loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>{t('common.loading')}</p>
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
                  {t('admin.welcomeBack', { name: session.admin.name })}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
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
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="appointments">{t('admin.pending')}</TabsTrigger>
              <TabsTrigger value="history">{t('admin.history')}</TabsTrigger>
              <TabsTrigger value="calendar">{t('admin.calendar')}</TabsTrigger>
              <TabsTrigger value="reviews">{t('admin.reviews')}</TabsTrigger>
              <TabsTrigger value="blog">{t('admin.blog')}</TabsTrigger>
              <TabsTrigger value="faq">{t('admin.faq')}</TabsTrigger>
              <TabsTrigger value="gallery">{t('admin.gallery')}</TabsTrigger>
              <TabsTrigger value="settings">{t('admin.settings')}</TabsTrigger>
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
              <ReviewManager />
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <BlogManager />
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq">
              <FAQManager />
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <GalleryManager />
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
                      <h3 className="font-semibold mb-4">{t('admin.contactInformation')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">{t('admin.updatePhone')}</Button>
                        <Button variant="outline">{t('admin.updateEmail')}</Button>
                        <Button variant="outline">{t('admin.updateAddress')}</Button>
                        <Button variant="outline">{t('admin.updateSocialMedia')}</Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">{t('admin.systemConfiguration')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">{t('admin.backupData')}</Button>
                        <Button variant="outline">{t('admin.exportAppointments')}</Button>
                        <Button variant="outline">{t('admin.siteAnalytics')}</Button>
                        <Button variant="outline">{t('admin.securitySettings')}</Button>
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