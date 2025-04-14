import { supabase } from '@/lib/supabase';
import { Product } from '@/data/types';

// Serviço de produtos integrado ao Supabase
export const productService = {
  // Buscar todos os produtos
  async getAll(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  },

  // Buscar produtos em promoção
  async getPromotions(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('ispromotion', true);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos em promoção:', error);
      return [];
    }
  },

  // Buscar produtos marcados como promoção do mês
  async getMonthPromotions(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('ismonthpromotion', true)
        .eq('active', true);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar promoções do mês:', error);
      return [];
    }
  },

  // Buscar produtos que não estão em promoção
  async getNonPromotions(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('ispromotion', false);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos que não estão em promoção:', error);
      return [];
    }
  },

  // Buscar produtos marcados como novidades
  async getNovidades(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('isnew', true);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error);
      return [];
    }
  },

  // Buscar produtos marcados como destaques
  async getFeatured(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('isfeatured', true)
        .eq('active', true);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar produtos em destaque:', error);
      return [];
    }
  },

  // Buscar um produto pelo ID
  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      return null;
    }
  },

  // Adicionar um novo produto
  async add(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    }
  },

  // Atualizar um produto
  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
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
      console.error(`Erro ao atualizar produto ${id}:`, error);
      return null;
    }
  },

  // Excluir um produto
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir produto ${id}:`, error);
      return false;
    }
  },

  // Buscar produtos por subcategoria
  async getBySubcategory(subcategoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('subcategoryid', subcategoryId)
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar produtos da subcategoria ${subcategoryId}:`, error);
      return [];
    }
  },

  // Buscar produtos por categoria
  async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, subcategory:subcategoryid(*)')
        .eq('subcategory.categoryid', categoryId)
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar produtos da categoria ${categoryId}:`, error);
      return [];
    }
  }
}; 