import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import './lib/i18n';
import { adminAuth } from './lib/adminAuth';

import Layout from './layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import SymptomsAndTreatments from './pages/SymptomsAndTreatments';
import SymptomDetail from './pages/SymptomDetail';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set document language
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    // Initialize admin authentication on app load
    const initializeAuth = async () => {
      try {
        // Check if there's an existing admin session and validate it
        const currentSession = adminAuth.getCurrentSession();
        if (currentSession) {
          await adminAuth.validateSession();
        }
      } catch (error) {
        console.error('Error initializing admin auth:', error);
      }
    };

    initializeAuth();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/symptoms-and-treatments" element={<SymptomsAndTreatments />} />
          <Route path="/symptoms-and-treatments/:id" element={<SymptomDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;