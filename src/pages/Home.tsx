import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Award, Users, Calendar, Star, Activity, Heart, Hospital, CheckCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t, i18n } = useTranslation();

  const surgicalStats = [
    { 
      key: 'kneeReplacements', 
      value: '10,000+', 
      icon: Activity,
    },
    { 
      key: 'fracturesSurgeries', 
      value: '5,000+', 
      icon: Award,
    },
    { 
      key: 'arthroscopies', 
      value: '5,000+', 
      icon: Users,
    },
    { 
      key: 'pediatricHip', 
      value: '500+', 
      icon: Heart,
    },
    { 
      key: 'clubfootCorrections', 
      value: '350+', 
      icon: Star,
    },
  ];

  const galleryImages = [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ];

  const symptomCards = [
    {
      id: 'knee-pain',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Knee Pain',
        tr: 'Diz Ağrısı',
        az: 'Diz Ağrısı'
      },
      text: {
        en: 'Explore common causes of knee pain—from arthritis to ligament injuries—and learn how Dr. Eryanılmaz can help restore your mobility.',
        tr: 'Artritten bağ yaralanmalarına kadar diz ağrısının nedenlerini keşfedin ve Dr. Eryanılmaz\'ın hareket kabiliyetinizi nasıl geri kazandırabileceğini öğrenin.',
        az: 'Artrozdan bağ zədələrinə qədər diz ağrısının səbəblərini araşdırın və Dr. Eryanılmazın hərəkət qabiliyyətinizi necə bərpa edə biləcəyini öyrənin.'
      }
    },
    {
      id: 'shoulder-pain',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Shoulder Pain',
        tr: 'Omuz Ağrısı',
        az: 'Çiyin Ağrısı'
      },
      text: {
        en: 'Understand the triggers of shoulder pain, including rotator cuff issues, and discover advanced treatments tailored to you.',
        tr: 'Rotator manşet sorunları da dahil olmak üzere omuz ağrısının tetikleyicilerini öğrenin ve size özel gelişmiş tedavileri keşfedin.',
        az: 'Rotator kəmər problemləri daxil olmaqla çiyin ağrısının səbəblərini anlayın və sizin üçün uyğun qabaqcıl müalicələri kəşf edin.'
      }
    },
    {
      id: 'hip-pain',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Hip Pain',
        tr: 'Kalça Ağrısı',
        az: 'Bud Ağrısı'
      },
      text: {
        en: 'From impingement to arthritis, find out what\'s behind your hip discomfort and how minimally invasive surgery can offer relief.',
        tr: 'Sıkışma sendromundan artrite kadar kalça ağrınızın nedenini öğrenin ve minimal invaziv cerrahinin nasıl rahatlama sağlayabileceğini keşfedin.',
        az: 'Sıxılma sindromundan artrozadək bud ağrınızın səbəbini müəyyən edin və minimal invaziv cərrahiyyənin necə rahatlıq gətirə biləcəyini öyrənin.'
      }
    },
    {
      id: 'fracture-care',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Fracture Care',
        tr: 'Kırık Bakımı',
        az: 'Sınıq Baxımı'
      },
      text: {
        en: 'Learn about our comprehensive fracture care services, from precise fixation techniques to rehabilitation protocols.',
        tr: 'Hassas tespit tekniklerinden rehabilitasyon protokollerine kadar kapsamlı kırık bakım hizmetlerimizi keşfedin.',
        az: 'Dəqiq fiksasiya üsullarından reabilitasiya protokollarına qədər geniş sınıq baxımı xidmətlərimizi kəşf edin.'
      }
    }
  ];

  const blogPosts = [
    {
      id: 'acl-tears',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'ACL Tears: Causes, Symptoms & Treatment',
        tr: 'ACL Yırtıkları: Nedenler, Belirtiler ve Tedavi',
        az: 'ACL Yırtıqları: Səbəblər, Simptomlar və Müalicə'
      },
      excerpt: {
        en: 'Learn how ACL injuries occur, signs to watch for, and modern minimally invasive techniques to get you back in action quickly.',
        tr: 'ACL yaralanmalarının nasıl oluştuğunu, dikkat edilmesi gereken işaretleri ve sizi hızla harekete döndürecek modern minimal invaziv yöntemleri öğrenin.',
        az: 'ACL zədələrinin necə yarandığını, diqqət etməli olduğunuz əlamətləri və sizi tezliklə hərəkətə qaytaracaq müasir minimal invaziv üsulları kəşf edin.'
      }
    },
    {
      id: 'joint-replacement-recovery',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Smooth Recovery After Joint Replacement',
        tr: 'Eklem Protezinden Sonra Kolay İyileşme',
        az: 'Oynağın Protezindən Sonra Sürətli Bərpa'
      },
      excerpt: {
        en: 'Discover practical rehabilitation tips and milestones for a safe, effective recovery following knee or hip replacement surgery.',
        tr: 'Diz veya kalça protezi sonrası güvenli ve etkili bir iyileşme için pratik rehabilitasyon ipuçlarını ve dönüm noktalarını keşfedin.',
        az: 'Diz və ya bud protezi əməliyyatından sonra təhlükəsiz və effektli bərpa üçün praktik reabilitasiya məsləhətləri və əsas mərhələləri kəşf edin.'
      }
    },
    {
      id: 'pediatric-orthopedics',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      title: {
        en: 'Pediatric Orthopedics: Common Conditions',
        tr: 'Çocuk Ortopedisi: Yaygın Durumlar',
        az: 'Uşaq Ortopediyası: Ümumi Hallar'
      },
      excerpt: {
        en: 'An overview of conditions like clubfoot and hip dysplasia, with insights into diagnosis and treatment options for young patients.',
        tr: 'Klubfoot ve kalça displazisi gibi durumlara genel bir bakış ve genç hastalar için tanı ve tedavi seçenekleri hakkında bilgiler.',
        az: 'Klubfoot və bud displaziyası kimi halların icmalı və gənc xəstələr üçün diaqnostika və müalicə variantları haqqında məlumat.'
      }
    }
  ];

  const getCurrentLang = () => i18n.language || 'en';

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-20 md:py-32 w-full"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {getCurrentLang() === 'en' ? 'Dr. Gürkan Eryanılmaz' : 'Op. Dr. Gürkan Eryanılmaz'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {getCurrentLang() === 'en' && 'Orthopedic & Traumatology Specialist'}
              {getCurrentLang() === 'tr' && 'Ortopedi ve Travmatoloji Uzmanı'}
              {getCurrentLang() === 'az' && 'Ortopediya və Travmatologiya Mütəxəssisi'}
            </p>
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              <Link to="/contact">
                {getCurrentLang() === 'en' && 'Book Appointment'}
                {getCurrentLang() === 'tr' && 'Randevu Al'}
                {getCurrentLang() === 'az' && 'Randevu Al'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className="py-16 w-full bg-gray-50">
        <div className="w-full px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Card A - Get a Second Opinion */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt={getCurrentLang() === 'en' ? 'Get a Second Opinion' : getCurrentLang() === 'tr' ? 'İkinci Bir Görüş Alın' : 'İkinci Bir Rəy Alın'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {getCurrentLang() === 'en' && 'Get a Second Opinion'}
                  {getCurrentLang() === 'tr' && 'İkinci Bir Görüş Alın'}
                  {getCurrentLang() === 'az' && 'İkinci Bir Rəy Alın'}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {getCurrentLang() === 'en' && 'Dr. Gürkan Eryanılmaz offers expert evaluation across a wide range of orthopedic and trauma conditions, ensuring you receive a comprehensive second look at your diagnosis and treatment options.'}
                  {getCurrentLang() === 'tr' && 'Dr. Gürkan Eryanılmaz, ortopedi ve travma alanındaki çeşitli durumlar için uzman değerlendirmeler yaparak tanı ve tedavi seçeneklerinize kapsamlı bir ikinci bakış sunar.'}
                  {getCurrentLang() === 'az' && 'Dr. Gürkan Eryanılmaz ortopediya və travma sahəsindəki müxtəlif hallar üzrə ekspert qiymətləndirmələri apararaq diaqnoz və müalicə variantlarınıza geniş və dəqiq ikinci baxış təmin edir.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/services">
                    {getCurrentLang() === 'en' && 'View Services'}
                    {getCurrentLang() === 'tr' && 'Hizmetlerimizi Görüntüle'}
                    {getCurrentLang() === 'az' && 'Xidmətlərimizə Bax'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Card B - Start Your Treatment */}
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt={getCurrentLang() === 'en' ? 'Start Your Treatment' : getCurrentLang() === 'tr' ? 'Tedavinize Başlayın' : 'Müalicənizə Başlayın'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {getCurrentLang() === 'en' && 'Start Your Treatment'}
                  {getCurrentLang() === 'tr' && 'Tedavinize Başlayın'}
                  {getCurrentLang() === 'az' && 'Müalicənizə Başlayın'}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {getCurrentLang() === 'en' && 'Take the first step towards better health—schedule your personalized care plan with Dr. Gürkan Eryanılmaz today.'}
                  {getCurrentLang() === 'tr' && 'Daha iyi bir sağlık için ilk adımı atın—kişiye özel bakım planınızı bugün Dr. Gürkan Eryanılmaz ile planlayın.'}
                  {getCurrentLang() === 'az' && 'Daha sağlam gələcəyə doğru ilk addımı atın—fərdi müalicə planınızı bu gün Dr. Gürkan Eryanılmaz ilə müəyyən edin.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/contact">
                    {getCurrentLang() === 'en' && 'Book Appointment'}
                    {getCurrentLang() === 'tr' && 'Randevu Al'}
                    {getCurrentLang() === 'az' && 'Randevu Al'}
                    <Calendar className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              {getCurrentLang() === 'en' && 'Who is Op. Dr. Gürkan Eryanılmaz?'}
              {getCurrentLang() === 'tr' && 'Op. Dr. Gürkan Eryanılmaz Kimdir?'}
              {getCurrentLang() === 'az' && 'Op. Dr. Gürkan Eryanılmaz Kimdir?'}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getCurrentLang() === 'en' && 'Born and raised in İzmir, Turkey, Dr. Gürkan Eryanılmaz began his medical education at Ege University Faculty of Medicine in 1987 and graduated with honors in 1993. Motivated by a passion for musculoskeletal health, he pursued residency in orthopedic and traumatology surgery at İzmir Tepecik Training and Research Hospital from 1996 to 2000.'}
                  {getCurrentLang() === 'tr' && '1969 yılında İzmir\'de doğan Dr. Gürkan Eryanılmaz, tıp eğitimine 1987\'de Ege Üniversitesi Tıp Fakültesi\'nde başladı ve 1993\'te onur derecesiyle mezun oldu. Kas-iskelet sistemi sağlığına duyduğu ilgiyle 1996–2000 yılları arasında İzmir Tepecik Eğitim ve Araştırma Hastanesi\'nde ortopedi ve travmatoloji cerrahisi ihtisasını tamamladı.'}
                  {getCurrentLang() === 'az' && '1969-cu ildə İzmir şəhərində anadan olan Dr. Gürkan Eryanılmaz, 1987-ci ildə Egey Universiteti Tibb Fakültəsində təhsilinə başlayıb və 1993-cü ildə onur diplomu ilə məzun olub. Əzələ-skelet sistemi sağlamlığına olan marağı onu 1996–2000-ci illərdə İzmir Tepecik Təlim və Tədqiqat Xəstəxanasında ortopediya və travmatologiya cərrahiyyəsi üzrə rezidenturanı tamamlamasına gətirdi.'}
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getCurrentLang() === 'en' && 'Since 2000, he has practiced as an orthopedic and traumatology specialist, performing thousands of surgeries including minimally invasive arthroscopic repairs and complex joint replacements. His meticulous approach and dedication to patient outcomes have earned him a reputation for excellence.'}
                  {getCurrentLang() === 'tr' && '2000 yılından bu yana ortopedi ve travmatoloji uzmanı olarak görev yapan Dr. Eryanılmaz, minimal invaziv artroskopik onarımlardan kompleks eklem protez ameliyatlarına kadar binlerce cerrahi girişim gerçekleştirdi. Titiz yaklaşımı ve hasta sonuçlarına olan adanmışlığıyla mükemmeliyetle tanınıyor.'}
                  {getCurrentLang() === 'az' && '2000-ci ildən etibarən ortopediya və travmatologiya üzrə mütəxəssis kimi fəaliyyət göstərən Dr. Eryanılmaz minlərlə əməliyyat həyata keçirib; bunlara minimal invaziv artroskopik əməliyyatlar və mürəkkəb oynağın protez edilməsi daxildir. Dəqiq yanaşması və xəstə nəticələrinə verdiyi önəm sayəsində mükəmməllik reputasiyası qazanıb.'}
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {getCurrentLang() === 'en' && 'He served many years at Afyon Kocatepe State Hospital before joining Medera Hospital in Baku, where he expanded his expertise with international cases. Now back in Turkey, he continues his practice at Afyon Kocatepe State Hospital, offering personalized care informed by global experience.'}
                  {getCurrentLang() === 'tr' && 'Afyon Kocatepe Devlet Hastanesi\'nde uzun yıllar çalışan Dr. Eryanılmaz, ardından Bakü\'deki Medera Hastanesi\'ne katılarak uluslararası vakalarla deneyimini genişletti. Şimdi Türkiye\'ye dönerek Afyon Kocatepe Devlet Hastanesi\'nde küresel deneyimini yansıtan kişiye özel bakım sunmaya devam ediyor.'}
                  {getCurrentLang() === 'az' && 'Afyon Kocatepe Dövlət Xəstəxanasında uzun illər fəaliyyət göstərdikdən sonra Bakıda Medera Xəstəxanasına qoşulan Dr. Eryanılmaz, beynəlxalq hallar üzrə təcrübəsini artırdı. İndi yenidən Türkiyədə, Afyon Kocatepe Dövlət Xəstəxanasında dünya təcrübəsinə əsaslanan fərdi tibbi xidmət göstərməkdədir.'}
                </p>
              </div>
              
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Dr. Gürkan Eryanılmaz"
                  className="rounded-lg shadow-lg w-full h-[500px] object-cover"
                />
              </div>
            </div>

            {/* Areas of Expertise */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <div className="flex items-center mb-8">
                <Hospital className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold">
                  {getCurrentLang() === 'en' && 'Areas of Expertise'}
                  {getCurrentLang() === 'tr' && 'Uzmanlık Alanları'}
                  {getCurrentLang() === 'az' && 'İxtisas Sahələri'}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Arthroscopic Surgery</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Knee, shoulder & elbow arthroscopy; meniscus tear repair; ACL reconstruction; rotator cuff & Bankart lesion repairs; hip impingement management.'}
                        {getCurrentLang() === 'tr' && 'Diz, omuz & dirsek artroskopisi; menisküs yırtığı onarımı; ön çapraz bağ (ACL) rekonstrüksiyonu; rotator manşet & Bankart lezyonu onarımları; kalça sıkışma tedavisi.'}
                        {getCurrentLang() === 'az' && 'Diz, çiyin & dirsək artroskopiyası; menisk yırtığı təmiri; ön çarpaz bağ (ACL) rekonstruksiyası; rotator kəmər & Bankart lezyonlarının təmiri; bud impinqmentinin müalicəsi.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Joint Replacement Surgery</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Total knee, hip & shoulder replacements; femoral head prosthesis; shoulder arthroplasty.'}
                        {getCurrentLang() === 'tr' && 'Total diz, kalça & omuz protezleri; femur başı protezi; omuz artroplastisi.'}
                        {getCurrentLang() === 'az' && 'Tam diz, bud & çiyin protezləri; femur başı protezi; çiyin artroplastikası.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Trauma & Fracture Surgery</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Ankle, hip & elbow fracture fixation; hip dislocation surgeries; cartilage injury repair; dislocation & fracture-dislocation treatments.'}
                        {getCurrentLang() === 'tr' && 'Ayak bileği, kalça & dirsek kırıklarının tespiti; kalça çıkığı ameliyatları; kıkırdak hasar onarımı; çıkık & kırık-çıkık tedavileri.'}
                        {getCurrentLang() === 'az' && 'Ayaq biləyi, bud & dirsək sınıqlarının fiksasiyası; bud lüksasiyası əməliyyatları; qığırdaq zədəsinin təmiri; çıxıq & sınıq-çıxıq müalicələri.'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Pediatric Orthopedics</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Correction of congenital deformities; pediatric hip dislocation; clubfoot correction; shoulder dislocation in children; pediatric joint surgeries.'}
                        {getCurrentLang() === 'tr' && 'Doğuştan gelen deformitelerin düzeltilmesi; pediatrik kalça çıkığı; çarpık ayak düzeltme; çocuklarda omuz çıkığı; pediatrik eklem cerrahileri.'}
                        {getCurrentLang() === 'az' && 'Doğuştan deformitələrin korreksiyası; uşaqlarda kalça çıxığının müalicəsi; klubfoot düzəlişi; uşaqlarda çiyin çıxığı; pediatrik oynağın cərrahiyyəsi.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold mb-1">Sports Injuries & Rehabilitation</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Diagnosis & treatment of muscle, ligament & joint injuries; customized rehab programs; overuse injury management; Achilles tendon care.'}
                        {getCurrentLang() === 'tr' && 'Kas, bağ & eklem yaralanmalarının tanı & tedavisi; kişiye özel rehabilitasyon programları; aşırı kullanım yaralanmaları yönetimi; Aşil tendonu bakımı.'}
                        {getCurrentLang() === 'az' && 'Əzələ, bağ & oynağın zədələrinin diaqnostikası & müalicəsi; fərdi reabilitasiya proqramları; həddindən artıq istifadə zədələrinin idarə edilməsi; Aşil tendonuna qulluq.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Additional Topics</h4>
                      <p className="text-sm text-gray-700">
                        {getCurrentLang() === 'en' && 'Ankle arthroplasty; general orthopedic diagnostics & treatment; Achilles tendon surgery.'}
                        {getCurrentLang() === 'tr' && 'Ayak bileği artroplastisi; genel ortopedik tanı & tedavi; Aşil tendonu cerrahisi.'}
                        {getCurrentLang() === 'az' && 'Ayaq biləyi artroplastikası; ümumi ortopedik diaqnostika & müalicə; Aşil tendon cərrahiyyəsi.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Surgical Experience Stats */}
      <section 
        className="py-20 w-full relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-blue-900/90"></div>
        <div className="relative w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {getCurrentLang() === 'en' && 'Surgical Experiences'}
                {getCurrentLang() === 'tr' && 'Cerrahi Deneyimler'}
                {getCurrentLang() === 'az' && 'Cərrahi Təcrübələr'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {surgicalStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.key} className="text-center bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300">
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                        {stat.value}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {getCurrentLang() === 'en' && stat.key === 'kneeReplacements' && 'Knee Replacements'}
                        {getCurrentLang() === 'en' && stat.key === 'fracturesSurgeries' && 'Fracture Surgeries'}
                        {getCurrentLang() === 'en' && stat.key === 'arthroscopies' && 'Arthroscopic Procedures'}
                        {getCurrentLang() === 'en' && stat.key === 'pediatricHip' && 'Pediatric Hip Surgeries'}
                        {getCurrentLang() === 'en' && stat.key === 'clubfootCorrections' && 'Clubfoot Corrections'}
                        
                        {getCurrentLang() === 'tr' && stat.key === 'kneeReplacements' && 'Diz Protezleri'}
                        {getCurrentLang() === 'tr' && stat.key === 'fracturesSurgeries' && 'Kırık Cerrahileri'}
                        {getCurrentLang() === 'tr' && stat.key === 'arthroscopies' && 'Artroskopik Prosedürler'}
                        {getCurrentLang() === 'tr' && stat.key === 'pediatricHip' && 'Pediatrik Kalça Ameliyatları'}
                        {getCurrentLang() === 'tr' && stat.key === 'clubfootCorrections' && 'Çarpık Ayak Düzeltmeleri'}
                        
                        {getCurrentLang() === 'az' && stat.key === 'kneeReplacements' && 'Diz Protezləri'}
                        {getCurrentLang() === 'az' && stat.key === 'fracturesSurgeries' && 'Sınıqların Cərrahiyyəsi'}
                        {getCurrentLang() === 'az' && stat.key === 'arthroscopies' && 'Artroskopik Prosedurlar'}
                        {getCurrentLang() === 'az' && stat.key === 'pediatricHip' && 'Pediatrik Kalça Əməliyyatları'}
                        {getCurrentLang() === 'az' && stat.key === 'clubfootCorrections' && 'Klubfoot Korreksiyaları'}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 w-full bg-gray-50">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {getCurrentLang() === 'en' && 'Our Happy Patients'}
                {getCurrentLang() === 'tr' && 'Mutlu Hastalarımız'}
                {getCurrentLang() === 'az' && 'Xoşbəxt Xəstələrimiz'}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {galleryImages.map((image, index) => (
                <Link key={index} to="/gallery" className="group">
                  <div className="relative overflow-hidden rounded-lg aspect-square">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/gallery">
                  {getCurrentLang() === 'en' && 'View Gallery'}
                  {getCurrentLang() === 'tr' && 'Galeriyi Görüntüle'}
                  {getCurrentLang() === 'az' && 'Qalereyaya Bax'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms & Treatments */}
      <section className="py-20 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {getCurrentLang() === 'en' && 'Symptoms & Treatments'}
                {getCurrentLang() === 'tr' && 'Belirtiler ve Tedaviler'}
                {getCurrentLang() === 'az' && 'Simptomlar və Müalicə'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {symptomCards.map((card, index) => (
                <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48">
                    <img
                      src={card.image}
                      alt={card.title[getCurrentLang() as keyof typeof card.title]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {card.title[getCurrentLang() as keyof typeof card.title]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {card.text[getCurrentLang() as keyof typeof card.text]}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/symptoms/${card.id}`}>
                        {getCurrentLang() === 'en' && 'Learn More'}
                        {getCurrentLang() === 'tr' && 'Daha Fazla'}
                        {getCurrentLang() === 'az' && 'Ətraflı'}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/symptoms">
                  {getCurrentLang() === 'en' && 'View All Symptoms'}
                  {getCurrentLang() === 'tr' && 'Tüm Belirtiler'}
                  {getCurrentLang() === 'az' && 'Bütün Simptomlara Bax'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 w-full bg-gray-50">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {getCurrentLang() === 'en' && 'Latest on the Blog'}
                {getCurrentLang() === 'tr' && 'Blog\'dan Son Yazılar'}
                {getCurrentLang() === 'az' && 'Bloqdan Son Yazılar'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {blogPosts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title[getCurrentLang() as keyof typeof post.title]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">
                      {post.title[getCurrentLang() as keyof typeof post.title]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt[getCurrentLang() as keyof typeof post.excerpt]}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/blog/${post.id}`}>
                        {getCurrentLang() === 'en' && 'Read More'}
                        {getCurrentLang() === 'tr' && 'Devamını Oku'}
                        {getCurrentLang() === 'az' && 'Davamını Oxu'}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link to="/blog">
                  {getCurrentLang() === 'en' && 'View All Posts'}
                  {getCurrentLang() === 'tr' && 'Tüm Yazılar'}
                  {getCurrentLang() === 'az' && 'Bütün Yazılara Bax'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              {getCurrentLang() === 'en' && 'Ready to Get the Care You Deserve?'}
              {getCurrentLang() === 'tr' && 'Hak Ettiğiniz Bakımı Almaya Hazır mısınız?'}
              {getCurrentLang() === 'az' && 'Layiq Olduğunuz Qayğını Almağa Hazırsınız?'}
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {getCurrentLang() === 'en' && 'Schedule your consultation today and take the first step towards better health.'}
              {getCurrentLang() === 'tr' && 'Bugün konsültasyonunuzu planlayın ve daha iyi sağlığa doğru ilk adımı atın.'}
              {getCurrentLang() === 'az' && 'Bu gün konsultasiyanızı planlaşdırın və daha yaxşı sağlamlığa doğru ilk addımı atın.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Link to="/contact">
                  {getCurrentLang() === 'en' && 'Book Appointment'}
                  {getCurrentLang() === 'tr' && 'Randevu Al'}
                  {getCurrentLang() === 'az' && 'Randevu Al'}
                  <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
              >
                <a href="tel:+994553977874">
                  {getCurrentLang() === 'en' && 'Call Now'}
                  {getCurrentLang() === 'tr' && 'Hemen Ara'}
                  {getCurrentLang() === 'az' && 'İndi Zəng Et'}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;