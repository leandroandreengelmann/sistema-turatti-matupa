import { supabase } from '@/lib/supabase';
import { Seller } from '@/data/types';

// Serviço de vendedores integrado ao Supabase
export const sellerService = {
  // Buscar todos os vendedores
  async getAll(): Promise<Seller[]> {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
  },

  // Buscar vendedores por ID da loja
  async getByStoreId(storeId: string): Promise<Seller[]> {
    try {
      console.log('sellerService.getByStoreId - Iniciando busca para storeId:', storeId);
      
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('storeid', storeId);
      
      if (error) {
        console.error('sellerService.getByStoreId - Erro na query:', error);
        throw error;
      }
      
      console.log(`sellerService.getByStoreId - Encontrados ${data?.length || 0} vendedores para storeId ${storeId}`);
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar vendedores da loja ${storeId}:`, error);
      return [];
    }
  },

  // Buscar um vendedor pelo ID
  async getById(id: string): Promise<Seller | null> {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar vendedor ${id}:`, error);
      return null;
    }
  },

  // Adicionar um novo vendedor
  async add(seller: Omit<Seller, 'id'>): Promise<Seller | null> {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .insert([{
          ...seller,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
      return null;
    }
  },

  // Atualizar um vendedor
  async update(id: string, updates: Partial<Seller>): Promise<Seller | null> {
    try {
      const { data, error } = await supabase
        .from('sellers')
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
      console.error(`Erro ao atualizar vendedor ${id}:`, error);
      return null;
    }
  },

  // Excluir um vendedor
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir vendedor ${id}:`, error);
      return false;
    }
  },

  // Verificar associações entre lojas e vendedores
  async checkStoreSellerAssociations(): Promise<Record<string, number>> {
    try {
      console.log('Verificando associações entre lojas e vendedores...');
      
      // Primeiro tenta buscar todos os vendedores para analisar
      const { data, error } = await supabase
        .from('sellers')
        .select('*');
      
      if (error) {
        console.error('Erro ao verificar associações:', error);
        return {};
      }
      
      if (!data || data.length === 0) {
        console.log('Nenhum vendedor encontrado');
        return {};
      }
      
      // Conta manualmente as associações
      const storeAssociations: Record<string, number> = {};
      
      data.forEach(seller => {
        // Verifica tanto storeId quanto storeid
        const storeId = seller.storeId || seller.storeid;
        
        if (storeId) {
          storeAssociations[storeId] = (storeAssociations[storeId] || 0) + 1;
        }
      });
      
      console.log('Associações encontradas:', storeAssociations);
      return storeAssociations;
    } catch (error) {
      console.error('Erro ao verificar associações entre lojas e vendedores:', error);
      return {};
    }
  },
  
  // Verificar todos os campos disponíveis na tabela de vendedores
  async getTableSchema(): Promise<string[]> {
    try {
      console.log('Verificando schema da tabela sellers...');
      
      // Buscando um vendedor para analisar sua estrutura
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .limit(1);
        
      if (error) {
        console.error('Erro ao verificar schema da tabela:', error);
        return [];
      }
      
      if (!data || data.length === 0) {
        console.log('Nenhum vendedor encontrado para análise de schema');
        return [];
      }
      
      // Retorna os nomes dos campos do primeiro vendedor
      return Object.keys(data[0]);
    } catch (error) {
      console.error('Erro ao verificar schema da tabela:', error);
      return [];
    }
  }
}; 