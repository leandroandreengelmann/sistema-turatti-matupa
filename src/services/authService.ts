import { supabase } from '@/lib/supabase';

// Tipagens para o serviço de autenticação
export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  user: AuthUser | null;
  session: {
    expires_at?: number;
  } | null;
}

// Serviço de autenticação com Supabase
export const authService = {
  // Obter a sessão atual
  async getSession(): Promise<AuthSession> {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erro ao buscar sessão:', error);
      return { user: null, session: null };
    }
    
    return {
      user: data.session?.user ? {
        id: data.session.user.id,
        email: data.session.user.email || '',
      } : null,
      session: data.session
    };
  },
  
  // Login com email e senha
  async login(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { 
        success: true, 
        user: data.user,
        message: 'Login realizado com sucesso' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Falha no login' 
      };
    }
  },
  
  // Logout
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { 
        success: true, 
        message: 'Logout realizado com sucesso' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Falha no logout' 
      };
    }
  },
  
  // Verificar se o usuário está autenticado
  async isAuthenticated() {
    const { user } = await this.getSession();
    return !!user;
  },
  
  // Verificar status de autenticação
  async checkAuthStatus() {
    return await this.isAuthenticated();
  }
}; 