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
    // Load session from localStorage on initialization
    this.loadSessionFromStorage();
  }

  public static getInstance(): AdminAuthService {
    if (!AdminAuthService.instance) {
      AdminAuthService.instance = new AdminAuthService();
    }
    return AdminAuthService.instance;
  }

  private loadSessionFromStorage(): void {
    try {
      const stored = localStorage.getItem('admin_session');
      if (stored) {
        const session = JSON.parse(stored);
        // Check if session is not expired
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
          // Set the session in Supabase client
          this.setSupabaseSession(session);
        } else {
          localStorage.removeItem('admin_session');
        }
      }
    } catch (error) {
      console.error('Error loading admin session:', error);
      localStorage.removeItem('admin_session');
    }
  }

  private saveSessionToStorage(session: AdminSession): void {
    localStorage.setItem('admin_session', JSON.stringify(session));
  }

  private clearSessionFromStorage(): void {
    localStorage.removeItem('admin_session');
  }

  private async setSupabaseSession(session: AdminSession): Promise<void> {
    try {
      // Create a proper Supabase auth session with our custom session token
      const authSession = {
        access_token: session.sessionToken, // This is our custom session token
        refresh_token: session.sessionToken,
        expires_in: Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
        expires_at: Math.floor(new Date(session.expiresAt).getTime() / 1000),
        token_type: 'bearer',
        user: {
          id: session.admin.id,
          email: session.admin.email,
          role: 'authenticated',
          aud: 'authenticated',
          app_metadata: { role: 'admin' },
          user_metadata: { name: session.admin.name },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString()
        }
      };

      // Set the session in Supabase - this will make our custom token available to RLS policies
      await supabase.auth.setSession(authSession as any);
      
      console.log('Admin session set in Supabase client');
    } catch (error) {
      console.error('Error setting Supabase session:', error);
    }
  }

  public async login(email: string, password: string): Promise<AdminSession> {
    try {
      // For demo purposes, we'll use a simple check
      // In production, this should use proper password hashing
      if (email === 'admin@drgeryanilmaz.com' && password === 'admin123') {
        // Generate session token
        const sessionToken = this.generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 8); // 8 hours expiry

        const adminId = '00000000-0000-0000-0000-000000000001';

        // Create session in database using service role
        const { data, error } = await supabase
          .from('admin_sessions')
          .insert({
            admin_id: adminId,
            session_token: sessionToken,
            expires_at: expiresAt.toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating admin session:', error);
          throw new Error('Failed to create session');
        }

        const session: AdminSession = {
          admin: {
            id: adminId,
            email: 'admin@drgeryanilmaz.com',
            name: 'Dr. Gürkan Eryanılmaz'
          },
          sessionToken,
          expiresAt: expiresAt.toISOString()
        };

        this.currentSession = session;
        this.saveSessionToStorage(session);
        
        // Set the session in Supabase client for authenticated requests
        await this.setSupabaseSession(session);

        console.log('Admin login successful, session token:', sessionToken);
        return session;
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    try {
      if (this.currentSession) {
        // Remove session from database
        await supabase
          .from('admin_sessions')
          .delete()
          .eq('session_token', this.currentSession.sessionToken);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.currentSession = null;
      this.clearSessionFromStorage();
      // Clear the session from Supabase client
      await supabase.auth.signOut();
    }
  }

  public async validateSession(): Promise<boolean> {
    if (!this.currentSession) {
      return false;
    }

    // Check if session is expired
    if (new Date(this.currentSession.expiresAt) <= new Date()) {
      await this.logout();
      return false;
    }

    try {
      // Validate session with database using our custom function
      const { data, error } = await supabase.rpc('is_admin_session_valid', {
        session_token: this.currentSession.sessionToken
      });

      if (error || !data) {
        console.log('Session validation failed:', error);
        await this.logout();
        return false;
      }

      // Ensure Supabase client has the session
      await this.setSupabaseSession(this.currentSession);
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
    return this.currentSession !== null && new Date(this.currentSession.expiresAt) > new Date();
  }

  private generateSessionToken(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

export const adminAuth = AdminAuthService.getInstance();