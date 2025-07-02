import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-8 w-full">
      <div className="w-full px-4 lg:px-8 max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-8">
              <h1 className="text-8xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
              <p className="text-gray-600 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/">
                  <Home className="mr-2 h-5 w-5" />
                  Go Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-500">
                If you believe this is an error, please contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;