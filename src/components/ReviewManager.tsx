import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Star, User, Edit, Check, X, MessageCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editedNames, setEditedNames] = useState({
    name_tr: '',
    name_az: '',
    name_en: ''
  });
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

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingReviews(data || []);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load pending reviews.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
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
        updateData.name_tr = editedNames.name_tr;
        updateData.name_az = editedNames.name_az;
        updateData.name_en = editedNames.name_en;
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
        updateData.name = editedNames.name_en;
        updateData.message = editedMessages.message_en;
      }

      const { error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Refresh pending reviews
      await fetchPendingReviews();
      
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

  const handleRejectReview = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh pending reviews
      await fetchPendingReviews();
      
      toast({
        title: "Success",
        description: "Review rejected and deleted successfully.",
      });
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        title: "Error",
        description: "Failed to reject review.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    
    // Pre-populate with existing data or fallback to legacy fields
    setEditedNames({
      name_tr: review.name_tr || review.name,
      name_az: review.name_az || review.name,
      name_en: review.name_en || review.name
    });
    
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
    setEditedNames({ name_tr: '', name_az: '', name_en: '' });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2" />
          Pending Reviews ({pendingReviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p>Loading reviews...</p>
            </div>
          ) : pendingReviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No pending reviews</p>
            </div>
          ) : (
            pendingReviews.map((review) => (
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
                            onClick={() => openEditDialog(review)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit & Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Review</DialogTitle>
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
                            
                            <Tabs defaultValue="names" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="names">Edit Names</TabsTrigger>
                                <TabsTrigger value="messages">Edit Messages</TabsTrigger>
                                <TabsTrigger value="replies">Add Replies</TabsTrigger>
                              </TabsList>

                              {/* Names Tab */}
                              <TabsContent value="names" className="space-y-4">
                                <p className="text-sm text-gray-600">
                                  Edit and translate the reviewer name for all languages:
                                </p>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Name (Turkish)</label>
                                  <Input
                                    value={editedNames.name_tr}
                                    onChange={(e) => setEditedNames(prev => ({ ...prev, name_tr: e.target.value }))}
                                    placeholder="Turkish name..."
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Name (Azerbaijani)</label>
                                  <Input
                                    value={editedNames.name_az}
                                    onChange={(e) => setEditedNames(prev => ({ ...prev, name_az: e.target.value }))}
                                    placeholder="Azerbaijani name..."
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium mb-1">Name (English)</label>
                                  <Input
                                    value={editedNames.name_en}
                                    onChange={(e) => setEditedNames(prev => ({ ...prev, name_en: e.target.value }))}
                                    placeholder="English name..."
                                  />
                                </div>
                              </TabsContent>

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
                              <Button 
                                variant="outline"
                                onClick={() => handleApproveReview(review.id, false)}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve Only
                              </Button>
                              <Button onClick={() => handleApproveReview(review.id, true)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Approve & Reply
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        size="sm" 
                        onClick={() => handleApproveReview(review.id, false)}
                        disabled={loading}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Quick Approve
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this review from {review.name}? 
                              This action will permanently delete the review.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRejectReview(review.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Reject & Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewManager;