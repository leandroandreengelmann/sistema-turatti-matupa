import { supabase } from '@/lib/supabase';
import { Store } from '@/data/types';

// Serviço de lojas integrado ao Supabase
export const storeService = {
  // Buscar todas as lojas
  async getAll(): Promise<Store[]> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      return [];
    }
  },

  // Buscar uma loja pelo ID
  async getById(id: string): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar loja ${id}:`, error);
      return null;
    }
  },

  // Adicionar uma nova loja
  async add(store: Omit<Store, 'id'>): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          ...store,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar loja:', error);
      return null;
    }
  },

  // Atualizar uma loja
  async update(id: string, updates: Partial<Store>): Promise<Store | null> {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar loja ${id}:`, error);
      return null;
    }
  },

  // Excluir uma loja
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir loja ${id}:`, error);
      return false;
    }
  }
}; 