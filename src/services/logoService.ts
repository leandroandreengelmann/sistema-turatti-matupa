import { supabase } from '@/lib/supabase';

export interface Logo {
  id: string;
  name?: string;
  imageurl: string;
  alttext?: string;
  type?: string;
  isactive?: boolean;
  description?: string;
  createdat?: string;
  updatedat?: string;
}

export const logoService = {
  // Buscar todos os logos
  async getAll(): Promise<Logo[]> {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar logos:', error);
      return [];
    }
  },

  // Buscar logos ativos
  async getActive(): Promise<Logo[]> {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('isactive', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter logos ativos:', error);
      return [];
    }
  },

  // Buscar logo pelo ID
  async getById(id: string): Promise<Logo | null> {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar logo ${id}:`, error);
      return null;
    }
  },

  // Buscar logo pelo tipo
  async getByType(type: string): Promise<Logo | null> {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('type', type)
        .eq('isactive', true)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar logo do tipo ${type}:`, error);
      return null;
    }
  }
}; 