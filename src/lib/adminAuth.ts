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

  public async login(email: string, password: string): Promise<AdminSession> {
    try {
      // For demo purposes, we'll use a simple check
      // In production, this should use proper password hashing
      if (email === 'admin@drgeryanilmaz.com' && password === 'admin123') {
        // Generate session token
        const sessionToken = this.generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 8); // 8 hours expiry

        // Create session in database
        const { data, error } = await supabase
          .from('admin_sessions')
          .insert({
            admin_id: '00000000-0000-0000-0000-000000000001', // Default admin ID
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
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@drgeryanilmaz.com',
            name: 'Dr. Gürkan Eryanılmaz'
          },
          sessionToken,
          expiresAt: expiresAt.toISOString()
        };

        this.currentSession = session;
        this.saveSessionToStorage(session);

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
      // Validate session with database
      const { data, error } = await supabase
        .rpc('validate_admin_session', { 
          session_token: this.currentSession.sessionToken 
        });

      if (error || !data || data.length === 0) {
        await this.logout();
        return false;
      }

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