import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Hospital, MapPin, Award } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();

  const timeline = [
    {
      year: '1969',
      title: t('about.timeline.born'),
      icon: MapPin,
    },
    {
      year: '1987-1993',
      title: t('about.timeline.egeUniversity'),
      icon: GraduationCap,
    },
    {
      year: '1996-2000',
      title: t('about.timeline.residency'),
      description: t('about.timeline.izmirHospital'),
      icon: Hospital,
    },
    {
      year: '2000-2022',
      title: t('about.timeline.seniorSpecialist'),
      description: t('about.timeline.afyonHospital'),
      icon: Hospital,
    },
    {
      year: '2022-2025',
      title: t('about.timeline.seniorSpecialist'),
      description: t('about.timeline.mederaHospital'),
      icon: Hospital,
    },
    {
      year: '2025-Present',
      title: t('about.timeline.seniorSpecialist'),
      description: t('about.timeline.afyonHospital'),
      icon: Hospital,
    },
  ];

  const specialties = [
    'Arthroscopic Surgery',
    'Joint Replacement Surgery',
    'Trauma & Fractures',
    'Pediatric Orthopedics',
    'Sports Injuries',
    'Joint & Nerve Surgery'
  ];

  const regions = [t('about.locations.turkey'), t('about.locations.azerbaijan')];

  // Get content based on current language
  const getBiographyContent = () => {
    switch (i18n.language) {
      case 'tr':
        return `Op. Dr. Gürkan Eryanılmaz, ortopedi ve travmatoloji alanında 25 yılı aşkın tecrübeye sahip deneyimli bir cerrahtır. 1969 yılında İzmir'de doğmuş, 1987 yılında Ege Üniversitesi Tıp Fakültesi'ne girmiş ve 1993 yılında mezun olmuştur. 1996 yılında İzmir Tepecik Eğitim ve Araştırma Hastanesi'nde ortopedi ve travmatoloji ihtisasına başlamış, 2000 yılından bu yana uzman hekim olarak görev yapmaktadır.

Meslek hayatı boyunca 10.000'in üzerinde diz protezi, 5.000'den fazla artroskopik işlem ve 500'ü aşkın çocuk kalça çıkığı ameliyatı da dahil olmak üzere toplamda 20.000'in üzerinde başarılı cerrahi operasyon gerçekleştirmiştir. Türkiye'nin yanı sıra Azerbaycan'da da görev yaparak binlerce hastanın sağlığına kavuşmasına katkı sağlamıştır.

Şu anda Afyon Kocatepe Devlet Hastanesi'nde görevine devam eden Dr. Eryanılmaz, özellikle kompleks eklem cerrahileri ve travma vakaları üzerine çalışmaktadır.`;
      case 'az':
        return `Op. Dr. Gürkan Eryanılmaz, ortopediya və travmatologiya sahəsində 25 ildən çox təcrübəyə malik bir mütəxəssisdir. 1969-cu ildə İzmir şəhərində anadan olmuş, 1987-ci ildə Ege Universitetinin Tibb Fakültəsinə daxil olmuş və 1993-cü ildə məzun olmuşdur. 1996-cı ildə İzmir Tepecik Tədris və Araşdırma Xəstəxanasında ixtisaslaşmağa başlamış və 2000-ci ildən bu yana ortopediya mütəxəssisi kimi fəaliyyət göstərir.

Karyerası ərzində 10.000-dən çox diz protezi, 5.000-dən çox artroskopik əməliyyat və 500-dən artıq uşaqlarda omba çıxığı əməliyyatı daxil olmaqla ümumilikdə 20.000-dən çox uğurlu cərrahi əməliyyat icra etmişdir. Türkiyədən əlavə, Azərbaycanda da – Bakı, Balakən və Lənkəran daxil olmaqla – minlərlə pasiyentə xidmət göstərmişdir.

Hazırda Türkiyənin Afyon Kocatepe Dövlət Xəstəxanasında fəaliyyət göstərir və daha çox mürəkkəb oynaq əməliyyatları və travmatik hallarla məşğuldur.`;
      default:
        return `Op. Dr. Gürkan Eryanılmaz is a highly experienced orthopedic and traumatology specialist with over 25 years of practice. Born in İzmir in 1969, he began studying at Ege University Faculty of Medicine in 1987 and graduated in 1993. He started his residency in orthopedics and traumatology at İzmir Tepecik Training and Research Hospital in 1996 and has been working as a specialist since 2000.

Throughout his career, he has performed over 10,000 knee replacement surgeries, more than 5,000 arthroscopic procedures, and over 500 pediatric hip dislocation surgeries — exceeding a total of 20,000 successful operations. In addition to his service in Turkey, he has also treated thousands of patients in Azerbaijan.

Dr. Eryanılmaz is currently seeing patients at Afyon Kocatepe State Hospital, specializing in complex joint surgeries and trauma-related cases.`;
    }
  };

  const getMissionContent = () => {
    switch (i18n.language) {
      case 'tr':
        return 'En güncel cerrahi teknikleri ve tıbbi teknolojileri kullanarak, hastalarımın daha kaliteli ve ağrısız bir yaşama kavuşmasına katkı sağlamak için çalışıyorum. Hedefim; etik değerlerden ödün vermeden, ulaşılabilir ve güvenilir ortopedik bakım sunarak hastalarımın hayatında fark yaratmak.';
      case 'az':
        return 'Ən müasir cərrahi texnikalardan və tibbi texnologiyalardan istifadə edərək pasiyentlərimin həyat keyfiyyətini və hərəkət qabiliyyətini artırmağa çalışıram. Məqsədim – vicdanlı, etibarlı və əlçatan ortopedik xidmət göstərməklə insanların sağlamlığına həqiqi töhfə verməkdir.';
      default:
        return 'I am committed to helping my patients achieve better mobility and quality of life by using the latest surgical techniques and medical technologies. My goal is to provide ethical, accessible, and reliable orthopedic care that truly makes a difference in people\'s lives.';
    }
  };

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Main Content - Fixed alignment for large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {/* Doctor Photo - Full height container */}
          <div className="lg:col-span-1 flex">
            <Card className="h-full flex flex-col w-full">
              <CardContent className="p-6 flex-1 flex flex-col h-full">
                <div className="flex-1 flex flex-col">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=533&q=80"
                    alt="Dr. Gürkan Eryanılmaz"
                    className="w-full aspect-[3/4] object-cover rounded-lg mb-4 flex-shrink-0"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  <div className="text-center flex-1 flex flex-col justify-end">
                    <h3 className="text-xl font-bold mb-2">Op. Dr. Gürkan Eryanılmaz</h3>
                    <p className="text-gray-600 mb-4">{t('about.specialistTitle')}</p>
                    <div className="space-y-2">
                      <Badge variant="secondary">{t('about.experienceYears')}</Badge>
                      <br />
                      <Badge variant="secondary">{t('about.successfulSurgeries')}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Biography & Mission - Full height container */}
          <div className="lg:col-span-2 flex flex-col space-y-6 h-full">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-2" />
                  {t('about.biography')}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none flex-1">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line h-full">
                  {getBiographyContent()}
                </div>
              </CardContent>
            </Card>

            <Card className="flex-shrink-0">
              <CardHeader>
                <CardTitle>{t('about.mission')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {getMissionContent()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timeline */}
        <Card className="mb-16 max-w-7xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="h-6 w-6 mr-2" />
              {t('about.careerTimeline')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {timeline.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{item.year}</Badge>
                      <h4 className="font-semibold text-lg">{item.title}</h4>
                      {item.description && (
                        <p className="text-gray-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Specialties & Regions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{t('about.areasOfExpertise')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('about.regionsServed')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {regions.map((region, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>{region}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;