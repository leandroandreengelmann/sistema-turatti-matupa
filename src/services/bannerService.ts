import { supabase } from '@/lib/supabase';
import { Banner } from '@/data/types';

// Função para verificar se um objeto é um banner válido
function isValidBanner(obj: any): obj is Banner {
  return (
    obj && 
    typeof obj === 'object' &&
    typeof obj.id === 'string' && 
    (typeof obj.imageUrl === 'string' || typeof obj.imageurl === 'string') &&
    typeof obj.isactive === 'boolean'
  );
}

// Função para processar os dados retornados do Supabase
function processBannersData(data: any[]): Banner[] {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(item => item && typeof item === 'object')
    .map(item => {
      // Mapear campos do banco (minúsculos) para o formato da interface (camelCase)
      const banner: Banner = {
        id: item.id,
        imageUrl: item.imageUrl || item.imageurl || '',
        isactive: item.isactive,
        order: typeof item.order === 'number' ? item.order : 0,
        createdAt: item.createdat || item.createdAt,
        updatedAt: item.updatedat || item.updatedAt
      };
      
      // Garantir que a URL da imagem está definida e é uma string
      if (banner.imageUrl) {
        banner.imageUrl = banner.imageUrl.trim();
      }
      
      return banner;
    })
    .filter(banner => banner.imageUrl && banner.imageUrl.trim() !== '')
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

// Serviço de banners integrado ao Supabase
export const bannerService = {
  // Buscar todos os banners
  async getAll(): Promise<Banner[]> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('order');
        
      if (error) throw error;
      
      console.log('Banners brutos do Supabase:', JSON.stringify(data));
      return processBannersData(data || []);
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
      return [];
    }
  },

  // Buscar apenas banners ativos
  async getActive(): Promise<Banner[]> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('isactive', true)
        .order('order');
        
      if (error) throw error;
      
      console.log('Banners ativos brutos do Supabase:', JSON.stringify(data));
      return processBannersData(data || []);
    } catch (error) {
      console.error('Erro ao buscar banners ativos:', error);
      return [];
    }
  },

  // Buscar um banner pelo ID
  async getById(id: string): Promise<Banner | null> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) {
        console.warn(`Banner ${id} não encontrado`);
        return null;
      }
      
      // Mapear campos do banco para o formato da interface
      const banner: Banner = {
        id: data.id,
        imageUrl: data.imageUrl || data.imageurl || '',
        isactive: data.isactive,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
      
      // Garantir que a URL da imagem está definida
      if (!banner.imageUrl || banner.imageUrl.trim() === '') {
        console.warn(`Banner ${id} com URL de imagem inválida`);
        return null;
      }
      
      return banner;
    } catch (error) {
      console.error(`Erro ao buscar banner ${id}:`, error);
      return null;
    }
  },

  // Adicionar um novo banner
  async add(banner: Omit<Banner, 'id'>): Promise<Banner | null> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .insert([{
          imageurl: banner.imageUrl,  // Usar o nome do campo como no banco
          isactive: banner.isactive,
          order: banner.order,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      if (!data) {
        console.warn('Banner não foi adicionado corretamente');
        return null;
      }
      
      // Retornar com os campos mapeados para o formato da interface
      return {
        id: data.id,
        imageUrl: data.imageUrl || data.imageurl || '',
        isactive: data.isactive,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error('Erro ao adicionar banner:', error);
      return null;
    }
  },

  // Atualizar um banner
  async update(id: string, updates: Partial<Banner>): Promise<Banner | null> {
    try {
      // Mapear para nomes de campos do banco
      const dbUpdates: any = {};
      
      if (updates.imageUrl !== undefined) dbUpdates.imageurl = updates.imageUrl;
      if (updates.isactive !== undefined) dbUpdates.isactive = updates.isactive;
      if (updates.order !== undefined) dbUpdates.order = updates.order;
      
      dbUpdates.updatedat = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('banners')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      if (!data) {
        console.warn(`Banner ${id} não foi atualizado corretamente`);
        return null;
      }
      
      // Retornar com os campos mapeados para o formato da interface
      return {
        id: data.id,
        imageUrl: data.imageUrl || data.imageurl || '',
        isactive: data.isactive,
        order: typeof data.order === 'number' ? data.order : 0,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error(`Erro ao atualizar banner ${id}:`, error);
      return null;
    }
  },

  // Excluir um banner
  async delete(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir banner ${id}:`, error);
      return false;
    }
  }
}; 