import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, CheckCircle, RefreshCw } from 'lucide-react';
import { useSymptoms } from '@/hooks/useSymptoms';
import { Toaster } from '@/components/ui/toaster';

const SymptomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { loading, error, fetchSymptom } = useSymptoms();
  const [symptom, setSymptom] = useState<any>(null);

  // Get current language suffix for multilingual content
  const langSuffix = i18n.language === 'tr' ? '_tr' : i18n.language === 'az' ? '_az' : '_en';

  // Fallback data for demonstration
  const fallbackSymptomData: { [key: string]: any } = {
    'shoulder-conditions': {
      id: 'shoulder-conditions',
      title_tr: 'Omuz Ağrısı ve Durumları',
      title_az: 'Çiyin Ağrısı və Vəziyyətləri',
      title_en: 'Shoulder Pain & Conditions',
      description_tr: 'Omuz, vücuttaki en hareketli eklemlerden biridir ve çeşitli yaralanma ve durumlara karşı hassastır. Kapsamlı yaklaşımımız hem akut yaralanmaları hem de kronik durumları ele alır.',
      description_az: 'Çiyin bədəndəki ən hərəkətli oynaqlardan biridir və müxtəlif zədələr və vəziyyətlərə qarşı həssasdır. Hərtərəfli yanaşmamız həm kəskin zədələri, həm də xroniki vəziyyətləri əhatə edir.',
      description_en: 'The shoulder is one of the most mobile joints in the body, making it susceptible to various injuries and conditions. Our comprehensive approach addresses both acute injuries and chronic conditions.',
      image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      common_causes_tr: [
        'Rotator manşet yırtıkları ve sıkışma',
        'Donuk omuz (adeziv kapsülit)',
        'Sporla ilgili yaralanmalar',
        'Omuz instabilitesi ve çıkıkları',
        'Artrit ve dejeneratif değişiklikler',
        'Omuz bıçağı, köprücük kemiği veya üst kol kırıkları'
      ],
      common_causes_az: [
        'Rotator manşet cırıqları və sıxılması',
        'Donmuş çiyin (adeziv kapsulit)',
        'İdmanla əlaqəli zədələr',
        'Çiyin qeyri-sabitliyi və çıxıqları',
        'Artrit və degenerativ dəyişikliklər',
        'Çiyin bıçağı, körpücük sümüyü və ya yuxarı qol sınıqları'
      ],
      common_causes_en: [
        'Rotator cuff tears and impingement',
        'Frozen shoulder (adhesive capsulitis)',
        'Sports-related injuries',
        'Shoulder instability and dislocations',
        'Arthritis and degenerative changes',
        'Fractures of the shoulder blade, collarbone, or upper arm'
      ],
      symptoms_list_tr: [
        'Baş üstü aktivitelerle artan ağrı',
        'Kolda güçsüzlük',
        'Uykuyu bozan gece ağrısı',
        'Sınırlı hareket aralığı',
        'Çıtırdama veya patlama sesleri',
        'Sertlik ve azalmış esneklik'
      ],
      symptoms_list_az: [
        'Baş üstü fəaliyyətlərlə artan ağrı',
        'Qolda zəiflik',
        'Yuxunu pozan gecə ağrısı',
        'Məhdud hərəkət diapazonu',
        'Çıtırdama və ya partlama səsləri',
        'Sərtlik və azalmış çeviklik'
      ],
      symptoms_list_en: [
        'Pain that worsens with overhead activities',
        'Weakness in the arm',
        'Night pain that disrupts sleep',
        'Limited range of motion',
        'Clicking or popping sounds',
        'Stiffness and reduced flexibility'
      ],
      conservative_treatments_tr: [
        'Fizik tedavi ve rehabilitasyon',
        'Anti-inflamatuar ilaçlar',
        'Kortikosteroid enjeksiyonları',
        'Aktivite modifikasyonu',
        'Buz ve sıcak tedavisi'
      ],
      conservative_treatments_az: [
        'Fizik terapiya və reabilitasiya',
        'Anti-inflamatuar dərmanlar',
        'Kortikosteroid inyeksiyaları',
        'Fəaliyyət modifikasiyası',
        'Buz və istilik terapiyası'
      ],
      conservative_treatments_en: [
        'Physical therapy and rehabilitation',
        'Anti-inflammatory medications',
        'Corticosteroid injections',
        'Activity modification',
        'Ice and heat therapy'
      ],
      surgical_treatments_tr: [
        'Artroskopik rotator manşet onarımı',
        'Omuz stabilizasyon prosedürleri',
        'Omuz protezi cerrahisi',
        'İnstabilite için Bankart onarımı',
        'Subakromial dekompresyon'
      ],
      surgical_treatments_az: [
        'Artroskopik rotator manşet təmiri',
        'Çiyin sabitləşdirmə prosedurları',
        'Çiyin protezi cərrahiyyəsi',
        'Qeyri-sabitlik üçün Bankart təmiri',
        'Subakromial dekompresiya'
      ],
      surgical_treatments_en: [
        'Arthroscopic rotator cuff repair',
        'Shoulder stabilization procedures',
        'Shoulder replacement surgery',
        'Bankart repair for instability',
        'Subacromial decompression'
      ],
      doctor_approach_tr: 'Dr. Gürkan Eryanılmaz hem artroskopik hem de açık omuz cerrahilerinde uzmanlaşmış olup, daha hızlı iyileşme ve optimal sonuçlar sağlamak için en son minimal invaziv teknikleri kullanır.',
      doctor_approach_az: 'Dr. Gürkan Eryanılmaz həm artroskopik, həm də açıq çiyin cərrahiyyələrində ixtisaslaşmış və daha sürətli sağalma və optimal nəticələr təmin etmək üçün ən son minimal invaziv texnikaları istifadə edir.',
      doctor_approach_en: 'Dr. Gürkan Eryanılmaz specializes in both arthroscopic and open shoulder surgeries, utilizing the latest minimally invasive techniques to ensure faster recovery and optimal outcomes.'
    },
    'elbow-conditions': {
      id: 'elbow-conditions',
      title_tr: 'Dirsek Durumları ve Tedavisi',
      title_az: 'Dirsək Vəziyyətləri və Müalicəsi',
      title_en: 'Elbow Conditions & Treatment',
      description_tr: 'Dirsek problemleri günlük aktiviteleri ve spor performansını önemli ölçüde etkileyebilir. Hem akut hem de kronik durumlar için kapsamlı bakım sağlıyoruz.',
      description_az: 'Dirsək problemləri gündəlik fəaliyyətləri və idman performansını əhəmiyyətli dərəcədə təsir edə bilər. Həm kəskin, həm də xroniki vəziyyətlər üçün hərtərəfli qayğı təmin edirik.',
      description_en: 'Elbow problems can significantly impact daily activities and sports performance. We provide comprehensive care for both acute and chronic conditions.',
      image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      common_causes_tr: [
        'Tenis dirseği (lateral epikondilit)',
        'Golfçü dirseği (medial epikondilit)',
        'Dirsek çıkığı',
        'Olekranon bursiti',
        'Ulnar sinir sıkışması',
        'Dirsek kırıkları'
      ],
      common_causes_az: [
        'Tennis dirsəyi (lateral epikondlit)',
        'Qolfçu dirsəyi (medial epikondlit)',
        'Dirsək çıxığı',
        'Olekranon bursiti',
        'Ulnar sinir sıxılması',
        'Dirsək sınıqları'
      ],
      common_causes_en: [
        'Tennis elbow (lateral epicondylitis)',
        'Golfer\'s elbow (medial epicondylitis)',
        'Elbow dislocation',
        'Olecranon bursitis',
        'Ulnar nerve compression',
        'Elbow fractures'
      ],
      symptoms_list_tr: [
        'Dirsek dışında veya içinde ağrı',
        'Kavrama gücünde zayıflık',
        'Dirsek hareketinde sertlik',
        'Elde uyuşma veya karıncalanma',
        'Şişlik ve hassasiyet',
        'Hareketle artan ağrı'
      ],
      symptoms_list_az: [
        'Dirsəyin xaricində və ya içində ağrı',
        'Tutma gücündə zəiflik',
        'Dirsək hərəkətində sərtlik',
        'Əldə uyuşma və ya qarışqa gəzməsi',
        'Şişkinlik və həssaslıq',
        'Hərəkətlə artan ağrı'
      ],
      symptoms_list_en: [
        'Pain on the outside or inside of the elbow',
        'Weakness in grip strength',
        'Stiffness in elbow movement',
        'Numbness or tingling in the hand',
        'Swelling and tenderness',
        'Pain that increases with movement'
      ],
      conservative_treatments_tr: [
        'İstirahat ve aktivite modifikasyonu',
        'Fizik tedavi egzersizleri',
        'Anti-inflamatuar ilaçlar',
        'Dirsek bandı veya destekleri',
        'Kortikosteroid enjeksiyonları'
      ],
      conservative_treatments_az: [
        'İstirahət və fəaliyyət modifikasiyası',
        'Fizik terapiya məşqləri',
        'Anti-inflamatuar dərmanlar',
        'Dirsək bandı və ya dəstəkləri',
        'Kortikosteroid inyeksiyaları'
      ],
      conservative_treatments_en: [
        'Rest and activity modification',
        'Physical therapy exercises',
        'Anti-inflammatory medications',
        'Elbow braces or supports',
        'Corticosteroid injections'
      ],
      surgical_treatments_tr: [
        'Tenis dirseği için tendon onarımı',
        'Ulnar sinir dekompresyonu',
        'Dirsek artroskopisi',
        'Kırık fiksasyonu',
        'Dirsek protezi'
      ],
      surgical_treatments_az: [
        'Tennis dirsəyi üçün tendon təmiri',
        'Ulnar sinir dekompresiyası',
        'Dirsək artroskopiyası',
        'Sınıq fiksasiyası',
        'Dirsək protezi'
      ],
      surgical_treatments_en: [
        'Tendon repair for tennis elbow',
        'Ulnar nerve decompression',
        'Elbow arthroscopy',
        'Fracture fixation',
        'Elbow replacement'
      ],
      doctor_approach_tr: 'Dr. Eryanılmaz dirsek durumları için hem konservatif hem de cerrahi tedavi seçenekleri sunar, her hastanın spesifik ihtiyaçlarına göre kişiselleştirilmiş tedavi planları geliştirir.',
      doctor_approach_az: 'Dr. Eryanılmaz dirsək vəziyyətləri üçün həm konservativ, həm də cərrahi müalicə seçimləri təklif edir, hər xəstənin spesifik ehtiyaclarına görə fərdiləşdirilmiş müalicə planları hazırlayır.',
      doctor_approach_en: 'Dr. Eryanılmaz offers both conservative and surgical treatment options for elbow conditions, developing personalized treatment plans based on each patient\'s specific needs.'
    }
    // Add more fallback data for other conditions as needed
  };

  useEffect(() => {
    const loadSymptom = async () => {
      if (!id) return;

      try {
        const symptomData = await fetchSymptom(id);
        setSymptom(symptomData);
      } catch (error) {
        // If database fetch fails, use fallback data
        const fallbackData = fallbackSymptomData[id];
        if (fallbackData) {
          setSymptom(fallbackData);
        }
      }
    };

    loadSymptom();
  }, [id, fetchSymptom]);

  const handleRetry = () => {
    if (id) {
      const loadSymptom = async () => {
        try {
          const symptomData = await fetchSymptom(id);
          setSymptom(symptomData);
        } catch (error) {
          const fallbackData = fallbackSymptomData[id!];
          if (fallbackData) {
            setSymptom(fallbackData);
          }
        }
      };
      loadSymptom();
    }
  };

  if (loading && !symptom) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !symptom) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Failed to Load Symptom Details
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <div className="space-y-2">
                  <Button onClick={handleRetry} variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('gallery.tryAgain')}
                  </Button>
                  <div>
                    <Link to="/symptoms-and-treatments">
                      <Button variant="ghost" className="text-gray-600">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('symptoms.backToSymptoms')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!symptom) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-16">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Condition Not Found
                </h3>
                <p className="text-gray-600 mb-4">
                  The condition you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/symptoms-and-treatments">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('symptoms.backToSymptoms')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Use multilingual content based on current language
  const title = symptom[`title${langSuffix}`] || symptom.title_en;
  const description = symptom[`description${langSuffix}`] || symptom.description_en;
  const commonCauses = symptom[`common_causes${langSuffix}`] || symptom.common_causes_en || [];
  const symptomsList = symptom[`symptoms_list${langSuffix}`] || symptom.symptoms_list_en || [];
  const conservativeTreatments = symptom[`conservative_treatments${langSuffix}`] || symptom.conservative_treatments_en || [];
  const surgicalTreatments = symptom[`surgical_treatments${langSuffix}`] || symptom.surgical_treatments_en || [];
  const doctorApproach = symptom[`doctor_approach${langSuffix}`] || symptom.doctor_approach_en;

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/symptoms-and-treatments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('symptoms.backToSymptoms')}
            </Link>
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Common Causes */}
            {commonCauses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('symptoms.commonCauses')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {commonCauses.map((cause: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{cause}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Symptoms */}
            {symptomsList.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{t('symptoms.symptomsList')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {symptomsList.map((symptomItem: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{symptomItem}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('symptoms.treatmentOptions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Conservative Treatment */}
                  {conservativeTreatments.length > 0 && (
                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-green-900">
                        {t('symptoms.conservativeTreatment')}
                      </h3>
                      <div className="space-y-3">
                        {conservativeTreatments.map((treatment: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-green-800">{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Surgical Treatment */}
                  {surgicalTreatments.length > 0 && (
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 text-blue-900">
                        {t('symptoms.surgicalTreatment')}
                      </h3>
                      <div className="space-y-3">
                        {surgicalTreatments.map((treatment: string, index: number) => (
                          <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-800">{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Doctor's Approach */}
            {doctorApproach && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('symptoms.doctorApproach')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{doctorApproach}</p>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-8 pb-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Treatment?</h2>
                <p className="text-gray-600 mb-6">
                  Contact Dr. Eryanılmaz to discuss your symptoms and treatment options.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/contact">
                      <Calendar className="mr-2 h-5 w-5" />
                      {t('symptoms.scheduleConsultation')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="tel:+994553977874">{t('home.callNow')}</a>
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

export default SymptomDetail;