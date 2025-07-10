import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, CheckCircle, Phone } from 'lucide-react';

const ExpertiseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  // Define all expertise data
  const expertiseData: Record<string, any> = {
    'arthroscopic-surgery': {
      title: t('expertise.arthroscopic.title') || 'Arthroscopic Surgery',
      description: t('expertise.arthroscopic.detailDescription') || 'Advanced minimally invasive surgical techniques using arthroscopy to diagnose and treat joint problems with smaller incisions, reduced pain, and faster recovery times.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.arthroscopic.procedures.kneeArthroscopy') || 'Knee Arthroscopy', description: t('expertise.arthroscopic.procedures.kneeArthroscopyDesc') || 'Minimally invasive knee surgery for meniscus tears, ligament injuries, and cartilage problems' },
        { name: t('expertise.arthroscopic.procedures.shoulderArthroscopy') || 'Shoulder Arthroscopy', description: t('expertise.arthroscopic.procedures.shoulderArthroscopyDesc') || 'Advanced shoulder surgery for rotator cuff tears, impingement, and instability' },
        { name: t('expertise.arthroscopic.procedures.elbowArthroscopy') || 'Elbow Arthroscopy', description: t('expertise.arthroscopic.procedures.elbowArthroscopyDesc') || 'Precise elbow surgery for tennis elbow, loose bodies, and joint stiffness' },
        { name: t('expertise.arthroscopic.procedures.meniscusRepair') || 'Meniscus Tear Repair', description: t('expertise.arthroscopic.procedures.meniscusRepairDesc') || 'Surgical repair of torn meniscus to restore knee function and prevent arthritis' },
        { name: t('expertise.arthroscopic.procedures.aclReconstruction') || 'ACL Reconstruction', description: t('expertise.arthroscopic.procedures.aclReconstructionDesc') || 'Complete reconstruction of torn anterior cruciate ligament for sports return' },
        { name: t('expertise.arthroscopic.procedures.rotatorCuffRepair') || 'Rotator Cuff Tear Repair', description: t('expertise.arthroscopic.procedures.rotatorCuffRepairDesc') || 'Arthroscopic repair of rotator cuff tears to restore shoulder strength and mobility' },
        { name: t('expertise.arthroscopic.procedures.bankartRepair') || 'Bankart Lesion Repair', description: t('expertise.arthroscopic.procedures.bankartRepairDesc') || 'Surgical repair of shoulder instability and recurrent dislocations' },
        { name: t('expertise.arthroscopic.procedures.subacromialDecompression') || 'Subacromial Decompression', description: t('expertise.arthroscopic.procedures.subacromialDecompressionDesc') || 'Treatment for shoulder impingement syndrome and pain relief' },
        { name: t('expertise.arthroscopic.procedures.hipImpingement') || 'Hip Impingement Treatment', description: t('expertise.arthroscopic.procedures.hipImpingementDesc') || 'Arthroscopic treatment of femoroacetabular impingement (FAI)' },
        { name: t('expertise.arthroscopic.procedures.advancedShoulder') || 'Advanced Shoulder Arthroscopy', description: t('expertise.arthroscopic.procedures.advancedShoulderDesc') || 'Complex shoulder procedures including SLAP repairs and capsular releases' }
      ]
    },
    'joint-replacement': {
      title: t('expertise.jointReplacement.title') || 'Joint Replacement Surgery',
      description: t('expertise.jointReplacement.detailDescription') || 'State-of-the-art joint replacement surgery using the most advanced prosthetic technologies to restore mobility and eliminate pain in severely damaged joints.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.jointReplacement.procedures.totalKnee') || 'Total Knee Replacement', description: t('expertise.jointReplacement.procedures.totalKneeDesc') || 'Complete knee joint replacement for severe arthritis and joint damage' },
        { name: t('expertise.jointReplacement.procedures.hipReplacement') || 'Hip Replacement', description: t('expertise.jointReplacement.procedures.hipReplacementDesc') || 'Total hip replacement surgery for arthritis, fractures, and joint deterioration' },
        { name: t('expertise.jointReplacement.procedures.shoulderReplacement') || 'Shoulder Replacement', description: t('expertise.jointReplacement.procedures.shoulderReplacementDesc') || 'Complete shoulder joint replacement for severe arthritis and rotator cuff arthropathy' },
        { name: t('expertise.jointReplacement.procedures.femoralHead') || 'Femoral Head Prosthesis', description: t('expertise.jointReplacement.procedures.femoralHeadDesc') || 'Partial hip replacement focusing on the femoral head component' },
        { name: t('expertise.jointReplacement.procedures.shoulderArthroplasty') || 'Shoulder Arthroplasty', description: t('expertise.jointReplacement.procedures.shoulderArthroplastyDesc') || 'Advanced shoulder replacement techniques including reverse total shoulder arthroplasty' }
      ]
    },
    'trauma-fracture': {
      title: t('expertise.trauma.title') || 'Trauma & Fracture Surgery',
      description: t('expertise.trauma.detailDescription') || 'Comprehensive trauma care and fracture surgery using advanced fixation techniques to restore bone integrity and joint function after injuries.',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.trauma.procedures.ankleFractures') || 'Ankle Fractures', description: t('expertise.trauma.procedures.ankleFracturesDesc') || 'Surgical repair of complex ankle fractures and malleolar injuries' },
        { name: t('expertise.trauma.procedures.hipFractures') || 'Hip Fracture Surgery', description: t('expertise.trauma.procedures.hipFracturesDesc') || 'Emergency treatment of hip fractures including femoral neck and intertrochanteric fractures' },
        { name: t('expertise.trauma.procedures.elbowFractures') || 'Elbow Fractures', description: t('expertise.trauma.procedures.elbowFracturesDesc') || 'Complex elbow fracture repair including olecranon and radial head fractures' },
        { name: t('expertise.trauma.procedures.jointDislocations') || 'Joint Dislocations and Repairs', description: t('expertise.trauma.procedures.jointDislocationsDesc') || 'Treatment of joint dislocations and associated ligament injuries' },
        { name: t('expertise.trauma.procedures.footAnkleSurgeries') || 'Foot & Ankle Surgeries', description: t('expertise.trauma.procedures.footAnkleSurgeriesDesc') || 'Comprehensive foot and ankle trauma surgery and reconstruction' },
        { name: t('expertise.trauma.procedures.cartilageInjuries') || 'Cartilage and Femur Injuries', description: t('expertise.trauma.procedures.cartilageInjuriesDesc') || 'Treatment of cartilage damage and complex femur fractures' }
      ]
    },
    'pediatric-orthopedics': {
      title: t('expertise.pediatric.title') || 'Pediatric Orthopedics',
      description: t('expertise.pediatric.detailDescription') || 'Specialized orthopedic care for children, focusing on growth-related conditions, congenital deformities, and pediatric trauma with age-appropriate treatment approaches.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.pediatric.procedures.congenitalDeformity') || 'Congenital Deformity Correction', description: t('expertise.pediatric.procedures.congenitalDeformityDesc') || 'Surgical correction of birth defects affecting bones and joints' },
        { name: t('expertise.pediatric.procedures.hipDislocation') || 'Pediatric Hip Dislocation Treatment', description: t('expertise.pediatric.procedures.hipDislocationDesc') || 'Treatment of developmental dysplasia of the hip (DDH) in children' },
        { name: t('expertise.pediatric.procedures.clubfootCorrection') || 'Clubfoot Correction', description: t('expertise.pediatric.procedures.clubfootCorrectionDesc') || 'Comprehensive treatment of clubfoot deformity in infants and children' },
        { name: t('expertise.pediatric.procedures.shoulderDislocation') || 'Pediatric Shoulder Dislocation', description: t('expertise.pediatric.procedures.shoulderDislocationDesc') || 'Treatment of shoulder instability and dislocations in young patients' },
        { name: t('expertise.pediatric.procedures.jointSurgeries') || 'Pediatric Joint Surgeries', description: t('expertise.pediatric.procedures.jointSurgeriesDesc') || 'Age-appropriate joint surgeries preserving growth plates and future development' }
      ]
    },
    'sports-injuries': {
      title: t('expertise.sports.title') || 'Sports Injuries & Rehabilitation',
      description: t('expertise.sports.detailDescription') || 'Specialized treatment of sports-related injuries with emphasis on rapid recovery, performance restoration, and injury prevention for athletes of all levels.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.sports.procedures.muscleLigamentInjuries') || 'Muscle, Ligament, and Joint Injuries', description: t('expertise.sports.procedures.muscleLigamentInjuriesDesc') || 'Comprehensive treatment of acute and chronic sports injuries' },
        { name: t('expertise.sports.procedures.athleteRehabilitation') || 'Rehabilitation for Athletes', description: t('expertise.sports.procedures.athleteRehabilitationDesc') || 'Sport-specific rehabilitation programs for safe return to competition' },
        { name: t('expertise.sports.procedures.overuseInjuries') || 'Overuse Injuries and Tendonitis', description: t('expertise.sports.procedures.overuseInjuriesDesc') || 'Treatment of repetitive stress injuries and chronic tendon problems' },
        { name: t('expertise.sports.procedures.achillesTendon') || 'Achilles Tendon Conditions', description: t('expertise.sports.procedures.achillesTendonDesc') || 'Surgical and non-surgical treatment of Achilles tendon injuries and ruptures' }
      ]
    },
    'joint-nerve': {
      title: t('expertise.jointNerve.title') || 'Joint & Nerve Conditions',
      description: t('expertise.jointNerve.detailDescription') || 'Specialized treatment of joint disorders, nerve compression syndromes, and chronic pain conditions using both surgical and non-surgical approaches.',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.jointNerve.procedures.carpalTunnel') || 'Carpal Tunnel Syndrome', description: t('expertise.jointNerve.procedures.carpalTunnelDesc') || 'Surgical release of median nerve compression in the wrist' },
        { name: t('expertise.jointNerve.procedures.nerveDecompression') || 'Nerve Decompression Surgeries', description: t('expertise.jointNerve.procedures.nerveDecompressionDesc') || 'Treatment of various nerve compression syndromes throughout the body' },
        { name: t('expertise.jointNerve.procedures.jointDisorders') || 'Joint Disorders and Alignment Issues', description: t('expertise.jointNerve.procedures.jointDisordersDesc') || 'Correction of joint deformities and alignment problems' },
        { name: t('expertise.jointNerve.procedures.intraArticularInjections') || 'Intra-articular Injections', description: t('expertise.jointNerve.procedures.intraArticularInjectionsDesc') || 'Therapeutic injections for joint pain and inflammation management' }
      ]
    }
  };

  const currentExpertise = id ? expertiseData[id] : null;

  if (!currentExpertise) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t('expertise.notFound') || 'Expertise Area Not Found'}</h1>
            <p className="text-gray-600 mb-8">{t('expertise.notFoundDescription') || 'The expertise area you\'re looking for doesn\'t exist or has been moved.'}</p>
            <Button asChild>
              <Link to="/areas-of-expertise">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('expertise.backToExpertise') || 'Back to Areas of Expertise'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-20 md:py-32 w-full"
        style={{
          backgroundImage: `url(${currentExpertise.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Back Button */}
            <div className="mb-8">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/areas-of-expertise">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('expertise.backToExpertise') || 'Back to Areas of Expertise'}
                </Link>
              </Button>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentExpertise.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {currentExpertise.description}
            </p>
          </div>
        </div>
      </section>

      {/* Procedures Section */}
      <section className="py-16 bg-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('expertise.procedures') || 'Procedures'}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('expertise.proceduresDescription') || 'Comprehensive treatments and surgical procedures available in this specialty area.'}
              </p>
            </div>

            {/* Procedures Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {currentExpertise.procedures.map((procedure: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">
                          {procedure.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-11">
                    <p className="text-gray-600 leading-relaxed">
                      {procedure.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('expertise.bookAppointmentTitle') || 'Book an Appointment'}
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {t('expertise.bookAppointmentDescription') || 'Get expert advice on your condition from Dr. Eryanılmaz.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <Link to="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('expertise.contactNow') || 'Contact Now'}
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <a href="tel:+994553977874">
                  <Phone className="mr-2 h-5 w-5" />
                  {t('expertise.callDirectly') || 'Call Directly'}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertiseDetail;