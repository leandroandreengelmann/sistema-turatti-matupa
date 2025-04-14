import { supabase } from '@/lib/supabase';
import { Color } from '@/data/types';

// Serviço de cores integrado ao Supabase
export const colorService = {
  // Buscar todas as cores
  async getAll(): Promise<Color[]> {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar cores:', error);
      return [];
    }
  },

  // Buscar cores por ID de coleção
  async getByCollectionId(collectionId: string): Promise<Color[]> {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('collectionid', collectionId)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar cores da coleção ${collectionId}:`, error);
      return [];
    }
  },

  // Buscar uma cor pelo ID
  async getById(id: string): Promise<Color | null> {
    try {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar cor ${id}:`, error);
      return null;
    }
  },

  // Adicionar uma nova cor
  async add(color: Omit<Color, 'id'>): Promise<Color | null> {
    try {
      const { data, error } = await supabase
        .from('colors')
        .insert([{
          ...color,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar cor:', error);
      return null;
    }
  },

  // Atualizar uma cor
  async update(id: string, updates: Partial<Color>): Promise<Color | null> {
    try {
      const { data, error } = await supabase
        .from('colors')
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
      console.error(`Erro ao atualizar cor ${id}:`, error);
      return null;
    }
  },

  // Excluir uma cor
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir cor ${id}:`, error);
      return false;
    }
  }
}; 