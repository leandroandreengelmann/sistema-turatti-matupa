import { supabase } from '@/lib/supabase';
import { ColorCollection } from '@/data/types';

// Serviço de coleções de cores integrado ao Supabase
export const colorCollectionService = {
  // Buscar todas as coleções de cores
  async getAll(): Promise<ColorCollection[]> {
    try {
      const { data, error } = await supabase
        .from('color_collections')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar coleções de cores:', error);
      return [];
    }
  },

  // Buscar coleções de cores ativas
  async getActive(): Promise<ColorCollection[]> {
    try {
      const { data, error } = await supabase
        .from('color_collections')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar coleções de cores ativas:', error);
      return [];
    }
  },

  // Buscar uma coleção pelo ID
  async getById(id: string): Promise<ColorCollection | null> {
    try {
      const { data, error } = await supabase
        .from('color_collections')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar coleção de cores ${id}:`, error);
      return null;
    }
  },

  // Adicionar uma nova coleção
  async add(collection: Omit<ColorCollection, 'id'>): Promise<ColorCollection | null> {
    try {
      const { data, error } = await supabase
        .from('color_collections')
        .insert([{
          ...collection,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar coleção de cores:', error);
      return null;
    }
  },

  // Atualizar uma coleção
  async update(id: string, updates: Partial<ColorCollection>): Promise<ColorCollection | null> {
    try {
      const { data, error } = await supabase
        .from('color_collections')
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
      console.error(`Erro ao atualizar coleção de cores ${id}:`, error);
      return null;
    }
  },

  // Excluir uma coleção
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('color_collections')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir coleção de cores ${id}:`, error);
      return false;
    }
  }
}; 