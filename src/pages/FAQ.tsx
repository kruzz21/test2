import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const { t } = useTranslation();

  // Placeholder FAQ data
  const faqs = [
    {
      id: 1,
      question: t('faq.questions.kneeReplacementTime'),
      answer: t('faq.answers.kneeReplacementTime')
    },
    {
      id: 2,
      question: t('faq.questions.arthroscopicRecovery'),
      answer: t('faq.answers.arthroscopicRecovery')
    },
    {
      id: 3,
      question: t('faq.questions.pediatricTreatment'),
      answer: t('faq.answers.pediatricTreatment')
    },
    {
      id: 4,
      question: t('faq.questions.firstConsultation'),
      answer: t('faq.answers.firstConsultation')
    },
    {
      id: 5,
      question: t('faq.questions.surgeryPreparation'),
      answer: t('faq.answers.surgeryPreparation')
    },
    {
      id: 6,
      question: t('faq.questions.surgeryRisks'),
      answer: t('faq.answers.surgeryRisks')
    },
    {
      id: 7,
      question: t('faq.questions.implantDuration'),
      answer: t('faq.answers.implantDuration')
    },
    {
      id: 8,
      question: t('faq.questions.internationalPatients'),
      answer: t('faq.answers.internationalPatients')
    }
  ];

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
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`} className="border-border">
                      <AccordionTrigger className="text-left text-foreground hover:text-foreground">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
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
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('faq.askQuestionDescription')}
                </p>
                
                <Input 
                  placeholder={t('faq.yourName')}
                  className="bg-background border-border text-foreground"
                />
                
                <Input 
                  placeholder={t('faq.yourEmail')}
                  type="email"
                  className="bg-background border-border text-foreground"
                />
                
                <Textarea 
                  placeholder={t('faq.questionText')}
                  rows={5}
                  className="bg-background border-border text-foreground"
                />
                
                <Button className="w-full">
                  {t('faq.submitQuestion')}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  {t('faq.responseTime')}
                </p>
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
    </div>
  );
};

export default FAQ;