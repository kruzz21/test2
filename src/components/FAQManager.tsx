import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { HelpCircle, CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

interface FAQ {
  id: string;
  question_tr: string;
  question_az: string;
  question_en: string;
  answer_tr?: string;
  answer_az?: string;
  answer_en?: string;
  approved: boolean;
  is_preset: boolean;
  created_at: string;
  updated_at: string;
}

interface FAQSubmission {
  id: string;
  name: string;
  email?: string;
  question_tr: string;
  question_az: string;
  question_en: string;
  status: string;
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

const FAQManager = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState<FAQSubmission[]>([]);
  const [approvedFAQs, setApprovedFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<FAQSubmission | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
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
  const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch pending FAQ submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('faq_submissions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (submissionsError) throw submissionsError;

      // Fetch approved FAQs
      const { data: faqs, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (faqsError) throw faqsError;

      setPendingSubmissions(submissions || []);
      setApprovedFAQs(faqs || []);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      toast({
        title: "Error",
        description: "Failed to load FAQ data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setLoading(true);

      // Create the FAQ
      const { error: faqError } = await supabase
        .from('faqs')
        .insert({
          question_tr: questions.question_tr,
          question_az: questions.question_az,
          question_en: questions.question_en,
          answer_tr: answers.answer_tr,
          answer_az: answers.answer_az,
          answer_en: answers.answer_en,
          approved: true,
          is_preset: false
        });

      if (faqError) throw faqError;

      // Delete the submission
      const { error: deleteError } = await supabase
        .from('faq_submissions')
        .delete()
        .eq('id', selectedSubmission.id);

      if (deleteError) throw deleteError;

      // Refresh data
      await fetchData();
      
      setSelectedSubmission(null);
      setQuestions({ question_tr: '', question_az: '', question_en: '' });
      setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
      setIsSubmissionDialogOpen(false);
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleRejectFAQ = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('faq_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      
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
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('faqs')
        .update({
          question_tr: questions.question_tr,
          question_az: questions.question_az,
          question_en: questions.question_en,
          answer_tr: answers.answer_tr,
          answer_az: answers.answer_az,
          answer_en: answers.answer_en,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingFAQ.id);

      if (error) throw error;

      await fetchData();
      
      setEditingFAQ(null);
      setQuestions({ question_tr: '', question_az: '', question_en: '' });
      setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
      setIsEditDialogOpen(false);
      
      toast({
        title: "Success",
        description: "FAQ updated successfully.",
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to update FAQ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFAQ = async () => {
    if (!questions.question_tr || !questions.question_az || !questions.question_en ||
        !answers.answer_tr || !answers.answer_az || !answers.answer_en) {
      toast({
        title: "Error",
        description: "Please provide questions and answers in all languages.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('faqs')
        .insert({
          question_tr: questions.question_tr,
          question_az: questions.question_az,
          question_en: questions.question_en,
          answer_tr: answers.answer_tr,
          answer_az: answers.answer_az,
          answer_en: answers.answer_en,
          approved: true,
          is_preset: true
        });

      if (error) throw error;

      await fetchData();
      
      setQuestions({ question_tr: '', question_az: '', question_en: '' });
      setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Success",
        description: "FAQ created successfully.",
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to create FAQ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      
      toast({
        title: "Success",
        description: "FAQ deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast({
        title: "Error",
        description: "Failed to delete FAQ.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openAnswerDialog = (submission: FAQSubmission) => {
    setSelectedSubmission(submission);
    setQuestions({
      question_tr: submission.question_tr || '',
      question_az: submission.question_az || '',
      question_en: submission.question_en || ''
    });
    setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
    setIsSubmissionDialogOpen(true);
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFAQ(faq);
    setQuestions({
      question_tr: faq.question_tr,
      question_az: faq.question_az,
      question_en: faq.question_en
    });
    setAnswers({
      answer_tr: faq.answer_tr || '',
      answer_az: faq.answer_az || '',
      answer_en: faq.answer_en || ''
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setQuestions({ question_tr: '', question_az: '', question_en: '' });
    setAnswers({ answer_tr: '', answer_az: '', answer_en: '' });
    setIsCreateDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            FAQ Management
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create FAQ
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">
              Pending Submissions ({pendingSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Published FAQs ({approvedFAQs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading pending submissions...</p>
              </div>
            ) : pendingSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No pending FAQ submissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <p className="font-medium mr-2">{submission.name}</p>
                          {submission.email && (
                            <p className="text-sm text-gray-500">({submission.email})</p>
                          )}
                          <Badge variant="secondary" className="ml-2">{submission.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{submission.question_en}</p>
                        <p className="text-xs text-gray-500">
                          Submitted on: {new Date(submission.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => openAnswerDialog(submission)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Answer
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject FAQ Submission</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this FAQ submission from {submission.name}? 
                                This action will permanently delete the submission.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRejectFAQ(submission.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Reject & Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialog>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-8">
                <p>Loading published FAQs...</p>
              </div>
            ) : approvedFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No published FAQs</p>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedFAQs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <p className="font-medium">{faq.question_en}</p>
                          <Badge variant="secondary" className="ml-2">
                            {faq.is_preset ? 'Preset' : 'User Submitted'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{faq.answer_en}</p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(faq.created_at).toLocaleDateString()}
                          {faq.updated_at !== faq.created_at && (
                            <span> | Updated: {new Date(faq.updated_at).toLocaleDateString()}</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(faq)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this FAQ? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFAQ(faq.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialog>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Answer FAQ Submission Dialog */}
        <Dialog open={isSubmissionDialogOpen} onOpenChange={setIsSubmissionDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Answer FAQ Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedSubmission && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="font-medium mb-2">Original Question:</p>
                  <p className="text-sm text-gray-700">
                    <strong>From:</strong> {selectedSubmission.name} {selectedSubmission.email && `(${selectedSubmission.email})`}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{selectedSubmission.question_en}</p>
                </div>
              )}
              
              <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questions">Edit Questions</TabsTrigger>
                  <TabsTrigger value="answers">Add Answers</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
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

                <TabsContent value="answers" className="space-y-4">
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
                <Button variant="outline" onClick={() => setIsSubmissionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAnswerFAQ}>
                  Approve & Publish FAQ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit FAQ Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questions">Edit Questions</TabsTrigger>
                  <TabsTrigger value="answers">Edit Answers</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
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

                <TabsContent value="answers" className="space-y-4">
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
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateFAQ}>
                  Update FAQ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create FAQ Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <Tabs defaultValue="questions" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questions">Add Questions</TabsTrigger>
                  <TabsTrigger value="answers">Add Answers</TabsTrigger>
                </TabsList>

                <TabsContent value="questions" className="space-y-4">
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

                <TabsContent value="answers" className="space-y-4">
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
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFAQ}>
                  Create FAQ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FAQManager;