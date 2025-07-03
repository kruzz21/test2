import { useState, useEffect } from 'react';
import { adminAuth, type AdminSession } from '@/lib/adminAuth';

export const useAdminAuth = () => {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔄 useAdminAuth: Starting auth check...');
        setLoading(true);
        
        // Wait for adminAuth to validate the session first
        // This ensures the adminAuth service has completed its internal session loading
        console.log('🔍 useAdminAuth: Validating session with adminAuth...');
        const isValid = await adminAuth.validateSession();
        console.log('✅ useAdminAuth: Session validation result:', isValid);
        
        if (isValid) {
          // Get the updated session after validation
          const updatedSession = adminAuth.getCurrentSession();
          console.log('✅ useAdminAuth: Setting valid session:', {
            adminEmail: updatedSession?.admin.email,
            isAuthenticated: true
          });
          setSession(updatedSession);
          setIsAuthenticated(true);
        } else {
          console.log('❌ useAdminAuth: Session invalid, clearing state');
          setSession(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('💥 useAdminAuth: Auth check failed:', error);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
        console.log('🏁 useAdminAuth: Auth check completed');
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 useAdminAuth: Starting login for:', email);
      const newSession = await adminAuth.login(email, password);
      console.log('✅ useAdminAuth: Login successful, updating state:', {
        adminEmail: newSession.admin.email,
        isAuthenticated: true
      });
      setSession(newSession);
      setIsAuthenticated(true);
      return newSession;
    } catch (error) {
      console.error('❌ useAdminAuth: Login failed:', error);
      setSession(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 useAdminAuth: Starting logout...');
      await adminAuth.logout();
      console.log('✅ useAdminAuth: Logout successful, clearing state');
    } finally {
      setSession(null);
      setIsAuthenticated(false);
    }
  };

  console.log('📊 useAdminAuth: Current state:', {
    hasSession: !!session,
    isAuthenticated,
    loading,
    adminEmail: session?.admin.email
  });

  return {
    session,
    loading,
    isAuthenticated,
    login,
    logout
  };
};