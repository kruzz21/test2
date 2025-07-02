import { useState, useEffect } from 'react';
import { adminAuth, type AdminSession } from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const currentSession = adminAuth.getCurrentSession();
        
        if (currentSession) {
          const isValid = await adminAuth.validateSession();
          if (isValid) {
            setSession(currentSession);
            setIsAuthenticated(true);
          } else {
            setSession(null);
            setIsAuthenticated(false);
          }
        } else {
          setSession(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const newSession = await adminAuth.login(email, password);
      setSession(newSession);
      setIsAuthenticated(true);
      return newSession;
    } catch (error) {
      setSession(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } finally {
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  return {
    session,
    loading,
    isAuthenticated,
    login,
    logout
  };
};