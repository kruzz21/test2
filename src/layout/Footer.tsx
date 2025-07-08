import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-white w-full">
      <div className="w-full px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Op. Dr. Gürkan Eryanılmaz</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">Afyon Kocatepe Devlet Hastanesi</p>
                  <p className="text-sm text-gray-300">Ortopedi ve Travmatoloji Kliniği</p>
                  <p className="text-sm text-gray-300">Afyon, Türkiye</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+994553977874" className="text-sm hover:text-blue-400 transition-colors">
                  +994 55 397 78 74
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-sm">info@drgeryanilmaz.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('nav.about')}
              </Link>
              <Link to="/areas-of-expertise" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('nav.expertise')}
              </Link>
              <Link to="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('nav.contact')}
              </Link>
              <Link to="/faq" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('nav.faq')}
              </Link>
            </div>
          </div>

          {/* Social Media & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.social')}</h3>
            <div className="space-y-3">
              <a 
                href="https://instagram.com/uzmantravmatolojiortoped" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5 text-pink-400" />
                <span>@uzmantravmatolojiortoped</span>
              </a>
              <a 
                href="https://tiktok.com/@opdrgeryanilmaz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span className="h-5 w-5 text-pink-400 font-bold">TT</span>
                <span>@opdrgeryanilmaz</span>
              </a>
            </div>

            <div className="mt-6 space-y-2">
              <Link to="/privacy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link to="/kvkk" className="block text-sm text-gray-300 hover:text-white transition-colors">
                {t('footer.kvkk')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 Op. Dr. Gürkan Eryanılmaz. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;