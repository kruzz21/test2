import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';
import { useFAQ } from '@/hooks/useFAQ';
import { Toaster } from '@/components/ui/toaster';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const { faqs, loading, createQuestion } = useFAQ();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.question) {
      return;
    }

    try {
      // Create submission for admin review
      const submissionData = {
        name: formData.name,
        email: formData.email || undefined,
        question_tr: formData.question,
        question_az: formData.question,
        question_en: formData.question,
        status: 'pending' as const
      };

      await createQuestion(submissionData);
      setFormData({ name: '', email: '', question: '' });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  // Get current language suffix
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* FAQ List */}
          <div className="lg:col-span-2">
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <HelpCircle className="h-6 w-6 mr-2" />
                  {t('faq.frequentlyAsked')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading FAQs...</p>
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No FAQs available yet.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq: any) => (
                      <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-border">
                        <AccordionTrigger className="text-left text-foreground hover:text-foreground">
                          {faq[`question${langSuffix}`]}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq[`answer${langSuffix}`] || 'Answer pending...'}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ask Question Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-background border-border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  {t('faq.askQuestion')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {t('faq.askQuestionDescription')}
                  </p>
                  
                  <Input 
                    placeholder={t('faq.yourName')}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-background border-border text-foreground"
                    required
                  />
                  
                  <Input 
                    placeholder={t('faq.yourEmail')}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                  
                  <Textarea 
                    placeholder={t('faq.questionText')}
                    rows={5}
                    value={formData.question}
                    onChange={(e) => handleInputChange('question', e.target.value)}
                    className="bg-background border-border text-foreground"
                    required
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : t('faq.submitQuestion')}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground">
                    {t('faq.responseTime')}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="mt-6 bg-background border-border">
              <CardHeader>
                <CardTitle className="text-foreground">{t('faq.needImmediateHelp')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t('faq.urgentContact')}
                </p>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="tel:+994553977874">
                      {t('faq.call')}: +994 55 397 78 74
                    </a>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a 
                      href="https://wa.me/994553977874" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {t('faq.whatsappMessage')}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default FAQ;