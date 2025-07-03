import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSymptoms } from '@/hooks/useSymptoms';
import { Toaster } from '@/components/ui/toaster';

const SymptomsAndTreatments = () => {
  const { t, i18n } = useTranslation();
  const { symptoms, loading, error, fetchSymptoms } = useSymptoms();

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  const handleRetry = () => {
    fetchSymptoms();
  };

  // Fallback data if no symptoms are loaded from database
  const fallbackSymptoms = [
    {
      id: 'shoulder-conditions',
      title_tr: 'Omuz Ağrısı ve Durumları',
      title_az: 'Çiyin Ağrısı və Vəziyyətləri',
      title_en: 'Shoulder Pain & Conditions',
      description_tr: 'Omuz, vücuttaki en hareketli eklemlerden biridir ve çeşitli yaralanma ve durumlara karşı hassastır.',
      description_az: 'Çiyin bədəndəki ən hərəkətli oynaqlardan biridir və müxtəlif zədələr və vəziyyətlərə qarşı həssasdır.',
      description_en: 'The shoulder is one of the most mobile joints in the body, making it susceptible to various injuries and conditions.',
      icon_color: 'bg-blue-500'
    },
    {
      id: 'elbow-conditions',
      title_tr: 'Dirsek Durumları ve Tedavisi',
      title_az: 'Dirsək Vəziyyətləri və Müalicəsi',
      title_en: 'Elbow Conditions & Treatment',
      description_tr: 'Dirsek problemleri günlük aktiviteleri ve spor performansını önemli ölçüde etkileyebilir.',
      description_az: 'Dirsək problemləri gündəlik fəaliyyətləri və idman performansını əhəmiyyətli dərəcədə təsir edə bilər.',
      description_en: 'Elbow problems can significantly impact daily activities and sports performance.',
      icon_color: 'bg-green-500'
    },
    {
      id: 'wrist-hand-conditions',
      title_tr: 'Bilek ve El Durumları',
      title_az: 'Biləyin və Əl Vəziyyətləri',
      title_en: 'Wrist & Hand Conditions',
      description_tr: 'El ve bilek yaralanmaları günlük işlevselliği ciddi şekilde etkileyebilir.',
      description_az: 'Əl və biləyin zədələri gündəlik funksionallığı ciddi şəkildə təsir edə bilər.',
      description_en: 'Hand and wrist injuries can severely impact daily function.',
      icon_color: 'bg-purple-500'
    },
    {
      id: 'hip-problems',
      title_tr: 'Kalça Problemleri ve Tedavisi',
      title_az: 'Kalça Problemləri və Müalicəsi',
      title_en: 'Hip Problems & Treatment',
      description_tr: 'Kalça durumları her yaştan hastayı etkileyebilir, pediatrik gelişimsel sorunlardan yetişkin artritine kadar.',
      description_az: 'Kalça vəziyyətləri hər yaşdan xəstəni təsir edə bilər, pediatrik inkişaf problemlərindən yetişkin artritinə qədər.',
      description_en: 'Hip conditions can affect patients of all ages, from pediatric developmental issues to adult arthritis.',
      icon_color: 'bg-red-500'
    },
    {
      id: 'knee-conditions',
      title_tr: 'Diz Ağrısı ve Durumları',
      title_az: 'Diz Ağrısı və Vəziyyətləri',
      title_en: 'Knee Pain & Conditions',
      description_tr: 'Diz, vücuttaki en büyük eklemdir ve günlük aktiviteler sırasında önemli stres taşır.',
      description_az: 'Diz bədəndəki ən böyük oynaq və gündəlik fəaliyyətlər zamanı əhəmiyyətli stress daşıyır.',
      description_en: 'The knee is the largest joint in the body and bears significant stress during daily activities.',
      icon_color: 'bg-yellow-500'
    },
    {
      id: 'foot-ankle-conditions',
      title_tr: 'Ayak ve Ayak Bileği Durumları',
      title_az: 'Ayaq və Ayaq Biləyi Vəziyyətləri',
      title_en: 'Foot & Ankle Conditions',
      description_tr: 'Ayak ve ayak bileği problemleri mobiliteyi ve yaşam kalitesini önemli ölçüde etkileyebilir.',
      description_az: 'Ayaq və ayaq biləyi problemləri mobilliyi və həyat keyfiyyətini əhəmiyyətli dərəcədə təsir edə bilər.',
      description_en: 'Foot and ankle problems can significantly impact mobility and quality of life.',
      icon_color: 'bg-indigo-500'
    },
    {
      id: 'pediatric-orthopedics',
      title_tr: 'Pediatrik Ortopedi',
      title_az: 'Pediatrik Ortopediya',
      title_en: 'Pediatric Orthopedics',
      description_tr: 'Çocukların ortopedik durumları özel bilgi ve yaşa uygun tedavi yaklaşımları gerektirir.',
      description_az: 'Uşaqların ortopedik vəziyyətləri xüsusi bilik və yaşa uyğun müalicə yanaşmaları tələb edir.',
      description_en: "Children's orthopedic conditions require specialized knowledge and age-appropriate treatment approaches.",
      icon_color: 'bg-pink-500'
    }
  ];

  const displaySymptoms = symptoms.length > 0 ? symptoms : fallbackSymptoms;

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('symptoms.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('symptoms.subtitle')}
          </p>
        </div>

        {/* Treatment Areas Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t('symptoms.treatmentAreas')}</h2>
          </div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Failed to Load Symptoms
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('gallery.tryAgain')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displaySymptoms.map((symptom: any) => {
                const title = symptom[`title${langSuffix}`] || symptom.title_en;
                const description = symptom[`description${langSuffix}`] || symptom.description_en;

                return (
                  <Card key={symptom.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardHeader className="pb-4">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-lg ${symptom.icon_color || 'bg-blue-500'} flex items-center justify-center mb-4`}>
                          <div className="w-6 h-6 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-base mb-6 text-gray-600 leading-relaxed">
                        {description}
                      </CardDescription>
                      <Link to={`/symptoms-and-treatments/${symptom.id}`}>
                        <Button 
                          variant="ghost" 
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-medium group-hover:translate-x-1 transition-transform"
                        >
                          {t('symptoms.learnMore')}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <Card className="bg-blue-50 border-blue-200 max-w-4xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-2xl font-bold mb-4">{t('symptoms.dontSeeCondition')}</h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  {t('symptoms.conditionDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/contact">
                      {t('symptoms.scheduleConsultation')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/faq">
                      {t('reviews.viewFaq')}
                    </Link>
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

export default SymptomsAndTreatments;