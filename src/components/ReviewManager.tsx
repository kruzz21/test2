import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Star, User, Edit, Check, X, MessageCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface Review {
  id: string;
  name: string;
  name_tr?: string;
  name_az?: string;
  name_en?: string;
  message: string;
  message_tr?: string;
  message_az?: string;
  message_en?: string;
  rating: number;
  approved: boolean;
  doctor_reply?: string;
  doctor_reply_tr?: string;
  doctor_reply_az?: string;
  doctor_reply_en?: string;
  created_at: string;
  updated_at: string;
}

const ReviewManager = () => {
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedMessages, setEditedMessages] = useState({
    message_tr: '',
    message_az: '',
    message_en: ''
  });
  const [doctorReplies, setDoctorReplies] = useState({
    doctor_reply_tr: '',
    doctor_reply_az: '',
    doctor_reply_en: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch pending reviews
      const { data: pending, error: pendingError } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;

      // Fetch approved reviews
      const { data: approved, error: approvedError } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;

      setPendingReviews(pending || []);
      setApprovedReviews(approved || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApproveReview = async (id: string, withReply: boolean = false) => {
    try {
      setLoading(true);
      
      const updateData: any = {
        approved: true,
        updated_at: new Date().toISOString()
      };

      // If we're editing the review, include the edited content
      if (editingReview && editingReview.id === id) {
        // Names are universal, so use the same value for all languages
        updateData.name_tr = editingReview.name;
        updateData.name_az = editingReview.name;
        updateData.name_en = editingReview.name;
        
        updateData.message_tr = editedMessages.message_tr;
        updateData.message_az = editedMessages.message_az;
        updateData.message_en = editedMessages.message_en;

        // If approving with reply, include doctor replies
        if (withReply) {
          updateData.doctor_reply_tr = doctorReplies.doctor_reply_tr;
          updateData.doctor_reply_az = doctorReplies.doctor_reply_az;
          updateData.doctor_reply_en = doctorReplies.doctor_reply_en;
          // Also update the legacy doctor_reply field for backward compatibility
          updateData.doctor_reply = doctorReplies.doctor_reply_en;
        }

        // Update legacy fields for backward compatibility
        updateData.name = editingReview.name;
        updateData.message = editedMessages.message_en;
      }

      const { error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
      
      toast({
        title: "Success",
        description: withReply ? "Review approved with reply successfully." : "Review approved successfully.",
      });

      // Close edit dialog if open
      setEditingReview(null);
      setIsDialogOpen(false);
      resetEditState();
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (id: string, withReply: boolean = false) => {
    try {
      setLoading(true);
      
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (editingReview) {
        // Names are universal, so use the same value for all languages
        updateData.name_tr = editingReview.name;
        updateData.name_az = editingReview.name;
        updateData.name_en = editingReview.name;
        
        updateData.message_tr = editedMessages.message_tr;
        updateData.message_az = editedMessages.message_az;
        updateData.message_en = editedMessages.message_en;

        // Include doctor replies
        updateData.doctor_reply_tr = doctorReplies.doctor_reply_tr;
        updateData.doctor_reply_az = doctorReplies.doctor_reply_az;
        updateData.doctor_reply_en = doctorReplies.doctor_reply_en;
        // Also update the legacy doctor_reply field for backward compatibility
        updateData.doctor_reply = doctorReplies.doctor_reply_en;

        // Update legacy fields for backward compatibility
        updateData.name = editingReview.name;
        updateData.message = editedMessages.message_en;
      }

      const { error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
      
      toast({
        title: "Success",
        description: "Review updated successfully.",
      });

      // Close edit dialog
      setEditingReview(null);
      setIsDialogOpen(false);
      resetEditState();
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh reviews
      await fetchReviews();
      
      toast({
        title: "Success",
        description: "Review deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (review: Review, isApproved: boolean = false) => {
    setEditingReview(review);
    
    // Pre-populate with existing data or fallback to legacy fields
    setEditedMessages({
      message_tr: review.message_tr || review.message,
      message_az: review.message_az || review.message,
      message_en: review.message_en || review.message
    });
    
    setDoctorReplies({
      doctor_reply_tr: review.doctor_reply_tr || '',
      doctor_reply_az: review.doctor_reply_az || '',
      doctor_reply_en: review.doctor_reply_en || ''
    });
    
    setIsDialogOpen(true);
  };

  const resetEditState = () => {
    setEditedMessages({ message_tr: '', message_az: '', message_en: '' });
    setDoctorReplies({ doctor_reply_tr: '', doctor_reply_az: '', doctor_reply_en: '' });
  };

  const getStatusColor = (approved: boolean) => {
    return approved 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderReviewCard = (review: Review, isApproved: boolean = false) => (
    <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Review Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <span className="font-medium">{review.name}</span>
              <div className="flex">{renderStars(review.rating)}</div>
              <Badge className={getStatusColor(review.approved)}>
                {review.approved ? 'APPROVED' : 'PENDING'}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Review Content */}
          <div className="mb-4">
            <p className="text-gray-700">{review.message}</p>
          </div>

          {/* Existing Doctor Reply */}
          {review.doctor_reply && (
            <div className="bg-blue-50 border-l-4 border-blue-200 p-3 rounded mb-4">
              <div className="flex items-center mb-2">
                <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">Doctor's Reply</span>
              </div>
              <p className="text-blue-800">{review.doctor_reply}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDialogOpen && editingReview?.id === review.id} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditDialog(review, isApproved)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  {isApproved ? 'Edit' : 'Edit & Approve'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{isApproved ? 'Edit Review' : 'Edit & Approve Review'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Original Review Display */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Original Review</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="ml-2 font-medium">{review.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="ml-2 inline-flex">{renderStars(review.rating)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Message:</span>
                        <p className="ml-2 text-gray-800">{review.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="messages" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="messages">Edit Messages</TabsTrigger>
                      <TabsTrigger value="replies">Add Replies</TabsTrigger>
                    </TabsList>

                    {/* Messages Tab */}
                    <TabsContent value="messages" className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Edit and translate the review message for all languages:
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Message (Turkish)</label>
                        <Textarea
                          value={editedMessages.message_tr}
                          onChange={(e) => setEditedMessages(prev => ({ ...prev, message_tr: e.target.value }))}
                          rows={4}
                          placeholder="Turkish message..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Message (Azerbaijani)</label>
                        <Textarea
                          value={editedMessages.message_az}
                          onChange={(e) => setEditedMessages(prev => ({ ...prev, message_az: e.target.value }))}
                          rows={4}
                          placeholder="Azerbaijani message..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Message (English)</label>
                        <Textarea
                          value={editedMessages.message_en}
                          onChange={(e) => setEditedMessages(prev => ({ ...prev, message_en: e.target.value }))}
                          rows={4}
                          placeholder="English message..."
                        />
                      </div>
                    </TabsContent>

                    {/* Replies Tab */}
                    <TabsContent value="replies" className="space-y-4">
                      <p className="text-sm text-gray-600">
                        Add doctor's reply in all languages (optional):
                      </p>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Reply (Turkish)</label>
                        <Textarea
                          value={doctorReplies.doctor_reply_tr}
                          onChange={(e) => setDoctorReplies(prev => ({ ...prev, doctor_reply_tr: e.target.value }))}
                          rows={3}
                          placeholder="Turkish reply..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Reply (Azerbaijani)</label>
                        <Textarea
                          value={doctorReplies.doctor_reply_az}
                          onChange={(e) => setDoctorReplies(prev => ({ ...prev, doctor_reply_az: e.target.value }))}
                          rows={3}
                          placeholder="Azerbaijani reply..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Reply (English)</label>
                        <Textarea
                          value={doctorReplies.doctor_reply_en}
                          onChange={(e) => setDoctorReplies(prev => ({ ...prev, doctor_reply_en: e.target.value }))}
                          rows={3}
                          placeholder="English reply..."
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => isApproved ? handleUpdateReview(review.id) : handleApproveReview(review.id, true)}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {isApproved ? 'Update Review' : 'Approve & Reply'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {!isApproved && (
              <Button 
                size="sm" 
                onClick={() => handleApproveReview(review.id, false)}
                disabled={loading}
              >
                <Check className="h-3 w-3 mr-1" />
                Quick Approve
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                >
                  {isApproved ? <Trash2 className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                  {isApproved ? 'Delete' : 'Reject'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{isApproved ? 'Delete Review' : 'Reject Review'}</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to {isApproved ? 'delete' : 'reject'} this review from {review.name}? 
                    This action will permanently delete the review.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteReview(review.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isApproved ? 'Delete' : 'Reject & Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialog>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Patient Reviews Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending ({pendingReviews.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading pending reviews...</p>
              </div>
            ) : pendingReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending reviews</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => renderReviewCard(review, false))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading approved reviews...</p>
              </div>
            ) : approvedReviews.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No approved reviews</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedReviews.map((review) => renderReviewCard(review, true))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReviewManager;