import { supabase } from './supabase';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface AdminSession {
  admin: AdminUser;
  sessionToken: string;
  expiresAt: string;
}

class AdminAuthService {
  private static instance: AdminAuthService;
  private currentSession: AdminSession | null = null;

  private constructor() {
    // Load session from Supabase on initialization
    this.loadSessionFromSupabase();
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  private async loadSessionFromSupabase(): Promise<void> {
    try {
      console.log('🔍 Loading session from Supabase...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error loading session:', error);
        return;
      }

      console.log('📋 Session data received:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        appMetadata: session?.user?.app_metadata,
        isAdminFlag: session?.user?.app_metadata?.is_admin,
        isAdminType: typeof session?.user?.app_metadata?.is_admin,
        isAdminValue: session?.user?.app_metadata?.is_admin === true
      });

      if (session && session.user) {
        // Check if user is admin
        const isAdmin = session.user.app_metadata?.is_admin === true;
        console.log('🔐 Admin check result:', {
          isAdmin,
          appMetadata: session.user.app_metadata,
          isAdminFlag: session.user.app_metadata?.is_admin,
          comparison: `${session.user.app_metadata?.is_admin} === true = ${session.user.app_metadata?.is_admin === true}`
        });
        
        if (isAdmin) {
          this.currentSession = {
            admin: {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email || 'Admin'
            },
            sessionToken: session.access_token,
            expiresAt: new Date(session.expires_at! * 1000).toISOString()
          };
          console.log('✅ Admin session loaded from Supabase:', this.currentSession);
        } else {
          console.log('❌ User is not an admin - app_metadata.is_admin is not true');
          await this.logout();
        }
      } else {
        console.log('ℹ️ No session or user found');
      }
    } catch (error) {
      console.error('💥 Error loading admin session:', error);
    }
  }

  public async login(email: string, password: string): Promise<AdminSession> {
    try {
      console.log('🚀 Starting admin login process for:', email);
      
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('📨 Login response received:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error?.message || 'none'
      });

      if (error) {
        console.error('❌ Supabase auth error:', error);
        throw new Error(error.message);
      }

      if (!data.session || !data.user) {
        console.error('❌ No session or user returned from authentication');
        throw new Error('No session or user returned from authentication');
      }

      console.log('👤 User data received:', {
        id: data.user.id,
        email: data.user.email,
        appMetadata: data.user.app_metadata,
        userMetadata: data.user.user_metadata,
        isAdminFlag: data.user.app_metadata?.is_admin,
        isAdminType: typeof data.user.app_metadata?.is_admin,
        isAdminValue: data.user.app_metadata?.is_admin === true
      });

      // Check if user is admin
      const isAdmin = data.user.app_metadata?.is_admin === true;
      console.log('🔐 Admin validation:', {
        isAdmin,
        appMetadata: data.user.app_metadata,
        isAdminFlag: data.user.app_metadata?.is_admin,
        strictComparison: `${data.user.app_metadata?.is_admin} === true = ${data.user.app_metadata?.is_admin === true}`,
        looseComparison: `${data.user.app_metadata?.is_admin} == true = ${data.user.app_metadata?.is_admin == true}`
      });
      
      if (!isAdmin) {
        console.error('❌ Access denied - user is not admin:', {
          email: data.user.email,
          appMetadata: data.user.app_metadata,
          isAdminFlag: data.user.app_metadata?.is_admin
        });
        await supabase.auth.signOut();
        throw new Error('Access denied. Admin privileges required.');
      }

      const session: AdminSession = {
        admin: {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email || 'Admin'
        },
        sessionToken: data.session.access_token,
        expiresAt: new Date(data.session.expires_at! * 1000).toISOString()
      };

      this.currentSession = session;
      
      console.log('✅ Admin login successful:', {
        adminId: session.admin.id,
        adminEmail: session.admin.email,
        adminName: session.admin.name,
        sessionExpires: session.expiresAt
      });
      
      return session;
    } catch (error) {
      console.error('💥 Login error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      console.log('🚪 Logging out admin user...');
      await supabase.auth.signOut();
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    } finally {
      this.currentSession = null;
      console.log('🧹 Session cleared');
    }
  }

  public async validateSession(): Promise<boolean> {
    try {
      console.log('🔍 Validating current session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session validation error:', error);
        await this.logout();
        return false;
      }

      console.log('📋 Session validation data:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        appMetadata: session?.user?.app_metadata,
        isAdminFlag: session?.user?.app_metadata?.is_admin,
        sessionExpiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'unknown'
      });

      if (!session || !session.user) {
        console.log('❌ No session or user found during validation');
        await this.logout();
        return false;
      }

      // Check if session is expired
      const now = new Date().getTime();
      const expiresAt = session.expires_at! * 1000;
      
      console.log('⏰ Session expiry check:', {
        now: new Date(now).toISOString(),
        expiresAt: new Date(expiresAt).toISOString(),
        isExpired: now >= expiresAt,
        timeUntilExpiry: Math.round((expiresAt - now) / 1000 / 60) + ' minutes'
      });
      
      if (now >= expiresAt) {
        console.log('⏰ Session expired');
        await this.logout();
        return false;
      }

      // Check if user is still admin
      const isAdmin = session.user.app_metadata?.is_admin === true;
      console.log('🔐 Admin revalidation:', {
        isAdmin,
        appMetadata: session.user.app_metadata,
        isAdminFlag: session.user.app_metadata?.is_admin,
        comparison: `${session.user.app_metadata?.is_admin} === true = ${session.user.app_metadata?.is_admin === true}`
      });
      
      if (!isAdmin) {
        console.log('❌ User is no longer admin during validation');
        await this.logout();
        return false;
      }

      // Update current session
      this.currentSession = {
        admin: {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email || 'Admin'
        },
        sessionToken: session.access_token,
        expiresAt: new Date(session.expires_at! * 1000).toISOString()
      };

      console.log('✅ Session validation successful');
      return true;
    } catch (error) {
      console.error('💥 Session validation error:', error);
      await this.logout();
      return false;
    }
  }

  public getCurrentSession(): AdminSession | null {
    console.log('📋 Getting current session:', {
      hasSession: !!this.currentSession,
      sessionData: this.currentSession ? {
        adminId: this.currentSession.admin.id,
        adminEmail: this.currentSession.admin.email,
        expiresAt: this.currentSession.expiresAt
      } : null
    });
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    if (!this.currentSession) {
      console.log('❌ Not authenticated - no current session');
      return false;
    }
    
    const now = new Date().getTime();
    const expiresAt = new Date(this.currentSession.expiresAt).getTime();
    const isValid = now < expiresAt;
    
    console.log('🔐 Authentication check:', {
      hasSession: !!this.currentSession,
      now: new Date(now).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      isValid,
      timeUntilExpiry: isValid ? Math.round((expiresAt - now) / 1000 / 60) + ' minutes' : 'expired'
    });
    
    return isValid;
  }
}

export const adminAuth = AdminAuthService.getInstance();