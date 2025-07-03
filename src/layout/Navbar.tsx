import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Phone, MessageCircle, Languages } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'services', href: '/services' },
    { key: 'symptoms', href: '/symptoms' },
    { key: 'gallery', href: '/gallery' },
    { key: 'blog', href: '/blog' },
    { key: 'reviews', href: '/reviews' },
    { key: 'contact', href: '/contact' },
    { key: 'faq', href: '/faq' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-xl font-bold text-primary">
              Op. Dr. Gürkan Eryanılmaz
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Languages className="h-4 w-4 mr-2" />
                  {i18n.language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                <DropdownMenuItem onClick={() => changeLanguage('tr')} className="hover:bg-accent hover:text-accent-foreground">
                  Türkçe
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('az')} className="hover:bg-accent hover:text-accent-foreground">
                  Azərbaycan
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')} className="hover:bg-accent hover:text-accent-foreground">
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Contact Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a href="tel:+994553977874" className="flex items-center">
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href="https://wa.me/994553977874" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* CTA Button */}
            <Button asChild>
              <Link to="/contact">{t('nav.appointment')}</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
                
                <div className="border-t pt-4 space-y-4">
                  {/* Language Switcher Mobile */}
                  <div>
                    <p className="text-sm font-medium mb-2">Language / Dil</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant={i18n.language === 'tr' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => changeLanguage('tr')}
                      >
                        TR
                      </Button>
                      <Button 
                        variant={i18n.language === 'az' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => changeLanguage('az')}
                      >
                        AZ
                      </Button>
                      <Button 
                        variant={i18n.language === 'en' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => changeLanguage('en')}
                      >
                        EN
                      </Button>
                    </div>
                  </div>

                  {/* Contact Actions Mobile */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a href="tel:+994553977874" className="flex items-center justify-center">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <a 
                        href="https://wa.me/994553977874" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>

                  <Button className="w-full" asChild>
                    <Link to="/contact" onClick={() => setIsOpen(false)}>
                      {t('nav.appointment')}
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;