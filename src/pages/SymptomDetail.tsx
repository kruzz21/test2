import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';

const SymptomDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Placeholder symptom data
  const symptomData = {
    'knee-pain': {
      title: 'Knee Pain & Arthritis',
      description: 'Comprehensive treatment options for knee pain, arthritis, and joint problems',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Understanding Knee Pain</h2>
        <p>Knee pain is one of the most common orthopedic complaints affecting people of all ages. It can result from various causes including arthritis, injuries, or wear and tear.</p>
        
        <h3>Common Symptoms</h3>
        <ul>
          <li>Joint pain and stiffness</li>
          <li>Swelling and inflammation</li>
          <li>Reduced range of motion</li>
          <li>Difficulty walking or climbing stairs</li>
        </ul>
        
        <h3>Treatment Options</h3>
        <p>Dr. Eryanılmaz offers both non-surgical and surgical treatment options depending on the severity of your condition:</p>
        
        <h4>Non-Surgical Treatments</h4>
        <ul>
          <li>Physical therapy</li>
          <li>Anti-inflammatory medications</li>
          <li>Joint injections</li>
          <li>Activity modification</li>
        </ul>
        
        <h4>Surgical Treatments</h4>
        <ul>
          <li>Arthroscopic surgery</li>
          <li>Partial knee replacement</li>
          <li>Total knee replacement</li>
          <li>Revision surgery</li>
        </ul>
      `
    },
    'shoulder-injuries': {
      title: 'Shoulder Injuries',
      description: 'Treatment for rotator cuff tears, shoulder impingement, and dislocations',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Understanding Shoulder Injuries</h2>
        <p>Shoulder injuries are common in both athletes and everyday activities. The shoulder is a complex joint that allows for a wide range of motion but can be prone to injury.</p>
        
        <h3>Common Shoulder Problems</h3>
        <ul>
          <li>Rotator cuff tears</li>
          <li>Shoulder impingement syndrome</li>
          <li>Shoulder dislocation</li>
          <li>Frozen shoulder (adhesive capsulitis)</li>
          <li>Shoulder arthritis</li>
        </ul>
        
        <h3>Treatment Approaches</h3>
        <p>Treatment depends on the specific condition and severity:</p>
        
        <h4>Conservative Treatment</h4>
        <ul>
          <li>Rest and activity modification</li>
          <li>Physical therapy</li>
          <li>Anti-inflammatory medications</li>
          <li>Corticosteroid injections</li>
        </ul>
        
        <h4>Surgical Options</h4>
        <ul>
          <li>Arthroscopic rotator cuff repair</li>
          <li>Shoulder stabilization surgery</li>
          <li>Shoulder replacement</li>
          <li>Bankart repair</li>
        </ul>
      `
    },
    'hip-problems': {
      title: 'Hip Problems',
      description: 'Hip replacement, hip arthritis, and developmental hip dysplasia treatment',
      image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Hip Conditions and Treatment</h2>
        <p>Hip problems can significantly impact mobility and quality of life. Dr. Eryanılmaz specializes in both adult and pediatric hip conditions.</p>
        
        <h3>Common Hip Conditions</h3>
        <ul>
          <li>Hip arthritis</li>
          <li>Hip fractures</li>
          <li>Developmental hip dysplasia (DDH)</li>
          <li>Hip impingement</li>
          <li>Avascular necrosis</li>
        </ul>
        
        <h3>Pediatric Hip Conditions</h3>
        <p>Special attention is given to pediatric hip problems:</p>
        <ul>
          <li>Developmental dysplasia of the hip (DDH)</li>
          <li>Legg-Calvé-Perthes disease</li>
          <li>Slipped capital femoral epiphysis</li>
        </ul>
        
        <h3>Treatment Options</h3>
        <h4>Non-Surgical</h4>
        <ul>
          <li>Physical therapy</li>
          <li>Medications</li>
          <li>Activity modification</li>
          <li>Hip injections</li>
        </ul>
        
        <h4>Surgical</h4>
        <ul>
          <li>Hip replacement surgery</li>
          <li>Hip arthroscopy</li>
          <li>Hip fracture repair</li>
          <li>Pediatric hip reconstruction</li>
        </ul>
      `
    },
    'sports-injuries': {
      title: 'Sports Injuries',
      description: 'ACL tears, meniscus injuries, and athletic rehabilitation programs',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Sports Injury Treatment</h2>
        <p>Sports injuries require specialized care to ensure athletes can return to their sport safely and effectively. Dr. Eryanılmaz has extensive experience treating sports-related injuries.</p>
        
        <h3>Common Sports Injuries</h3>
        <ul>
          <li>ACL (Anterior Cruciate Ligament) tears</li>
          <li>Meniscus tears</li>
          <li>Achilles tendon injuries</li>
          <li>Shoulder dislocations</li>
          <li>Tennis elbow</li>
          <li>Stress fractures</li>
        </ul>
        
        <h3>Treatment Philosophy</h3>
        <p>Our approach focuses on:</p>
        <ul>
          <li>Accurate diagnosis</li>
          <li>Minimally invasive techniques when possible</li>
          <li>Comprehensive rehabilitation</li>
          <li>Safe return to sport protocols</li>
        </ul>
        
        <h3>Rehabilitation Programs</h3>
        <p>Customized rehabilitation programs include:</p>
        <ul>
          <li>Sport-specific exercises</li>
          <li>Strength and conditioning</li>
          <li>Injury prevention education</li>
          <li>Performance optimization</li>
        </ul>
      `
    },
    'fractures': {
      title: 'Fractures & Trauma',
      description: 'Emergency fracture care and complex trauma surgery',
      image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Fracture and Trauma Care</h2>
        <p>Fractures and traumatic injuries require immediate and expert care. Dr. Eryanılmaz provides comprehensive trauma surgery services.</p>
        
        <h3>Types of Fractures Treated</h3>
        <ul>
          <li>Simple and complex fractures</li>
          <li>Open (compound) fractures</li>
          <li>Stress fractures</li>
          <li>Pathological fractures</li>
          <li>Non-union fractures</li>
        </ul>
        
        <h3>Common Fracture Sites</h3>
        <ul>
          <li>Hip fractures</li>
          <li>Ankle fractures</li>
          <li>Wrist fractures</li>
          <li>Femur fractures</li>
          <li>Elbow fractures</li>
        </ul>
        
        <h3>Treatment Approach</h3>
        <p>Treatment depends on the type and location of the fracture:</p>
        
        <h4>Non-Surgical Treatment</h4>
        <ul>
          <li>Casting</li>
          <li>Splinting</li>
          <li>Bracing</li>
          <li>Traction</li>
        </ul>
        
        <h4>Surgical Treatment</h4>
        <ul>
          <li>Internal fixation with plates and screws</li>
          <li>Intramedullary nailing</li>
          <li>External fixation</li>
          <li>Joint replacement for complex fractures</li>
        </ul>
      `
    },
    'pediatric-conditions': {
      title: 'Pediatric Conditions',
      description: 'Specialized care for children with orthopedic conditions',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      content: `
        <h2>Pediatric Orthopedic Care</h2>
        <p>Children have unique orthopedic needs that require specialized knowledge and gentle care. Dr. Eryanılmaz has extensive experience in pediatric orthopedics.</p>
        
        <h3>Common Pediatric Conditions</h3>
        <ul>
          <li>Developmental dysplasia of the hip (DDH)</li>
          <li>Clubfoot (talipes equinovarus)</li>
          <li>Scoliosis</li>
          <li>Growth plate injuries</li>
          <li>Limb length discrepancies</li>
          <li>Cerebral palsy-related orthopedic issues</li>
        </ul>
        
        <h3>Specialized Treatments</h3>
        <h4>Hip Dysplasia Treatment</h4>
        <ul>
          <li>Pavlik harness</li>
          <li>Closed reduction and casting</li>
          <li>Open reduction surgery</li>
          <li>Pelvic osteotomy</li>
        </ul>
        
        <h4>Clubfoot Treatment</h4>
        <ul>
          <li>Ponseti method casting</li>
          <li>Achilles tenotomy</li>
          <li>Bracing protocols</li>
          <li>Surgical correction when needed</li>
        </ul>
        
        <h3>Family-Centered Care</h3>
        <p>Our approach includes:</p>
        <ul>
          <li>Parent education and support</li>
          <li>Age-appropriate communication</li>
          <li>Minimally invasive techniques</li>
          <li>Long-term follow-up care</li>
        </ul>
      `
    }
  };

  const symptom = symptomData[id as keyof typeof symptomData];

  if (!symptom) {
    return (
      <div className="min-h-screen py-8 w-full">
        <div className="w-full px-4 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Symptom Not Found</h1>
          <Button asChild>
            <Link to="/symptoms">Back to Symptoms</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 w-full">
      <div className="w-full px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/symptoms">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.back')} to {t('symptoms.title')}
            </Link>
          </Button>

          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">{symptom.title}</h1>
              <p className="text-xl text-gray-600 mb-6">{symptom.description}</p>
              <Button asChild size="lg">
                <Link to="/contact">
                  <Calendar className="mr-2 h-5 w-5" />
                  {t('symptoms.scheduleConsultation')}
                </Link>
              </Button>
            </div>
            <div>
              <img
                src={symptom.image}
                alt={symptom.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: symptom.content }}
              />
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Get Treatment?</h2>
                <p className="text-gray-600 mb-6">
                  Contact Dr. Eryanılmaz to discuss your symptoms and treatment options.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/contact">{t('services.scheduleAppointment')}</Link>
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
    </div>
  );
};

export default SymptomDetail;