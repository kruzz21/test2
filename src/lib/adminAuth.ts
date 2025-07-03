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
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error loading session:', error);
        return;
      }

      if (session && session.user) {
        // Check if user is admin
        const isAdmin = session.user.app_metadata?.is_admin === true;
        
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
          console.log('Admin session loaded from Supabase');
        } else {
          console.log('User is not an admin');
          await this.logout();
        }
      }
    } catch (error) {
      console.error('Error loading admin session:', error);
    }
  }

  public async login(email: string, password: string): Promise<AdminSession> {
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new Error(error.message);
      }

      if (!data.session || !data.user) {
        throw new Error('No session or user returned from authentication');
      }

      // Check if user is admin
      const isAdmin = data.user.app_metadata?.is_admin === true;
      
      if (!isAdmin) {
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
      
      console.log('Admin login successful');
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.currentSession = null;
    }
  }

  public async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        await this.logout();
        return false;
      }

      if (!session || !session.user) {
        await this.logout();
        return false;
      }

      // Check if session is expired
      const now = new Date().getTime();
      const expiresAt = session.expires_at! * 1000;
      
      if (now >= expiresAt) {
        console.log('Session expired');
        await this.logout();
        return false;
      }

      // Check if user is still admin
      const isAdmin = session.user.app_metadata?.is_admin === true;
      
      if (!isAdmin) {
        console.log('User is no longer admin');
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

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.logout();
      return false;
    }
  }

  public getCurrentSession(): AdminSession | null {
    return this.currentSession;
  }

  public isAuthenticated(): boolean {
    if (!this.currentSession) return false;
    
    const now = new Date().getTime();
    const expiresAt = new Date(this.currentSession.expiresAt).getTime();
    
    return now < expiresAt;
  }
}

export const adminAuth = AdminAuthService.getInstance();