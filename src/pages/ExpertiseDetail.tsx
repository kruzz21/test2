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
      title: t('expertise.arthroscopic.title'),
      description: t('expertise.arthroscopic.detailDescription'),
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.arthroscopic.procedures.kneeArthroscopy'), description: t('expertise.arthroscopic.procedures.kneeArthroscopyDesc') },
        { name: t('expertise.arthroscopic.procedures.shoulderArthroscopy'), description: t('expertise.arthroscopic.procedures.shoulderArthroscopyDesc') },
        { name: t('expertise.arthroscopic.procedures.elbowArthroscopy'), description: t('expertise.arthroscopic.procedures.elbowArthroscopyDesc') },
        { name: t('expertise.arthroscopic.procedures.meniscusRepair'), description: t('expertise.arthroscopic.procedures.meniscusRepairDesc') },
        { name: t('expertise.arthroscopic.procedures.aclReconstruction'), description: t('expertise.arthroscopic.procedures.aclReconstructionDesc') },
        { name: t('expertise.arthroscopic.procedures.rotatorCuffRepair'), description: t('expertise.arthroscopic.procedures.rotatorCuffRepairDesc') },
        { name: t('expertise.arthroscopic.procedures.bankartRepair'), description: t('expertise.arthroscopic.procedures.bankartRepairDesc') },
        { name: t('expertise.arthroscopic.procedures.subacromialDecompression'), description: t('expertise.arthroscopic.procedures.subacromialDecompressionDesc') },
        { name: t('expertise.arthroscopic.procedures.hipImpingement'), description: t('expertise.arthroscopic.procedures.hipImpingementDesc') },
        { name: t('expertise.arthroscopic.procedures.advancedShoulder'), description: t('expertise.arthroscopic.procedures.advancedShoulderDesc') }
      ]
    },
    'joint-replacement': {
      title: t('expertise.jointReplacement.title'),
      description: t('expertise.jointReplacement.detailDescription'),
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.jointReplacement.procedures.totalKnee'), description: t('expertise.jointReplacement.procedures.totalKneeDesc') },
        { name: t('expertise.jointReplacement.procedures.hipReplacement'), description: t('expertise.jointReplacement.procedures.hipReplacementDesc') },
        { name: t('expertise.jointReplacement.procedures.shoulderReplacement'), description: t('expertise.jointReplacement.procedures.shoulderReplacementDesc') },
        { name: t('expertise.jointReplacement.procedures.femoralHead'), description: t('expertise.jointReplacement.procedures.femoralHeadDesc') },
        { name: t('expertise.jointReplacement.procedures.shoulderArthroplasty'), description: t('expertise.jointReplacement.procedures.shoulderArthroplastyDesc') }
      ]
    },
    'trauma-fracture': {
      title: t('expertise.trauma.title'),
      description: t('expertise.trauma.detailDescription'),
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.trauma.procedures.ankleFractures'), description: t('expertise.trauma.procedures.ankleFracturesDesc') },
        { name: t('expertise.trauma.procedures.hipFractures'), description: t('expertise.trauma.procedures.hipFracturesDesc') },
        { name: t('expertise.trauma.procedures.elbowFractures'), description: t('expertise.trauma.procedures.elbowFracturesDesc') },
        { name: t('expertise.trauma.procedures.jointDislocations'), description: t('expertise.trauma.procedures.jointDislocationsDesc') },
        { name: t('expertise.trauma.procedures.footAnkleSurgeries'), description: t('expertise.trauma.procedures.footAnkleSurgeriesDesc') },
        { name: t('expertise.trauma.procedures.cartilageInjuries'), description: t('expertise.trauma.procedures.cartilageInjuriesDesc') }
      ]
    },
    'pediatric-orthopedics': {
      title: t('expertise.pediatric.title'),
      description: t('expertise.pediatric.detailDescription'),
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.pediatric.procedures.congenitalDeformity'), description: t('expertise.pediatric.procedures.congenitalDeformityDesc') },
        { name: t('expertise.pediatric.procedures.hipDislocation'), description: t('expertise.pediatric.procedures.hipDislocationDesc') },
        { name: t('expertise.pediatric.procedures.clubfootCorrection'), description: t('expertise.pediatric.procedures.clubfootCorrectionDesc') },
        { name: t('expertise.pediatric.procedures.shoulderDislocation'), description: t('expertise.pediatric.procedures.shoulderDislocationDesc') },
        { name: t('expertise.pediatric.procedures.jointSurgeries'), description: t('expertise.pediatric.procedures.jointSurgeriesDesc') }
      ]
    },
    'sports-injuries': {
      title: t('expertise.sports.title'),
      description: t('expertise.sports.detailDescription'),
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.sports.procedures.muscleLigamentInjuries'), description: t('expertise.sports.procedures.muscleLigamentInjuriesDesc') },
        { name: t('expertise.sports.procedures.athleteRehabilitation'), description: t('expertise.sports.procedures.athleteRehabilitationDesc') },
        { name: t('expertise.sports.procedures.overuseInjuries'), description: t('expertise.sports.procedures.overuseInjuriesDesc') },
        { name: t('expertise.sports.procedures.achillesTendon'), description: t('expertise.sports.procedures.achillesTendonDesc') }
      ]
    },
    'joint-nerve': {
      title: t('expertise.jointNerve.title'),
      description: t('expertise.jointNerve.detailDescription'),
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      procedures: [
        { name: t('expertise.jointNerve.procedures.carpalTunnel'), description: t('expertise.jointNerve.procedures.carpalTunnelDesc') },
        { name: t('expertise.jointNerve.procedures.nerveDecompression'), description: t('expertise.jointNerve.procedures.nerveDecompressionDesc') },
        { name: t('expertise.jointNerve.procedures.jointDisorders'), description: t('expertise.jointNerve.procedures.jointDisordersDesc') },
        { name: t('expertise.jointNerve.procedures.intraArticularInjections'), description: t('expertise.jointNerve.procedures.intraArticularInjectionsDesc') }
      ]
    }
  };

  const currentExpertise = id ? expertiseData[id] : null;

  if (!currentExpertise) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t('expertise.notFound')}</h1>
            <p className="text-gray-600 mb-8">{t('expertise.notFoundDescription')}</p>
            <Button asChild>
              <Link to="/areas-of-expertise">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('expertise.backToExpertise')}
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
              <Button asChild className="bg-white text-black-200 hover:bg-blue-100">
                <Link to="/areas-of-expertise">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('expertise.backToExpertise')}
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
                {t('expertise.procedures')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('expertise.proceduresDescription')}
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
              {t('expertise.bookAppointmentTitle')}
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {t('expertise.bookAppointmentDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                <Link to="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('expertise.contactNow')}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3">
                <a href="tel:+994553977874">
                  <Phone className="mr-2 h-5 w-5" />
                  {t('expertise.callDirectly')}
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