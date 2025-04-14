// Arquivo que integra os serviços com Supabase
import { supabase } from '@/lib/supabase';
import { Banner, Store, Seller, Logo, SocialLink } from '@/data/types';
import { authService } from './authService';

// Implementação real do serviço de banners
const bannerService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('"order"', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar banners:', error);
      return [];
    }
  },
  
  async getActive() {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('isActive', true)
        .order('"order"', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar banners ativos:', error);
      return [];
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar banner ${id}:`, error);
      return null;
    }
  },
  
  async add(banner: Omit<Banner, 'id'>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const bannerData = {
        imageurl: banner.imageUrl,
        isactive: banner.isActive,
        order: banner.order
      };
      
      const { data, error } = await supabase
        .from('banners')
        .insert([bannerData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar banner:', error);
      return null;
    }
  },
  
  async update(id: string, updates: Partial<Banner>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const updateData: Record<string, any> = {};
      
      if (updates.imageUrl !== undefined) {
        updateData.imageurl = updates.imageUrl;
      }
      
      if (updates.isActive !== undefined) {
        updateData.isactive = updates.isActive;
      }
      
      if (updates.order !== undefined) {
        updateData.order = updates.order;
      }
      
      const { data, error } = await supabase
        .from('banners')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao atualizar banner ${id}:`, error);
      return null;
    }
  },
  
  async delete(id: string) {
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
  },
  
  async uploadBannerImage(file: File): Promise<string> {
    try {
      // Cria um nome de arquivo único baseado no timestamp e nome original
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;
      
      // Faz o upload para o bucket de storage do Supabase
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Obtém a URL pública do arquivo
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }
};

// Implementação real do serviço de lojas
const storeService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const stores = data?.map(store => ({
        id: store.id,
        name: store.name,
        city: store.city,
        phone: store.phone,
        hours: store.hours,
        iconUrl: store.iconurl || store.iconUrl,
        isActive: store.isactive !== undefined ? store.isactive : store.isActive,
        createdAt: store.createdat || store.createdAt,
        updatedAt: store.updatedat || store.updatedAt
      })) || [];
      
      return stores;
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      return [];
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        city: data.city,
        phone: data.phone,
        hours: data.hours,
        iconUrl: data.iconurl || data.iconUrl,
        isActive: data.isactive !== undefined ? data.isactive : data.isActive,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error(`Erro ao buscar loja ${id}:`, error);
      return null;
    }
  },
  
  async add(store: Omit<Store, 'id'>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const storeData = {
        name: store.name,
        city: store.city,
        phone: store.phone,
        hours: store.hours,
        iconurl: store.iconUrl,
        isactive: store.isActive
      };
      
      const { data, error } = await supabase
        .from('stores')
        .insert([storeData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        city: data.city,
        phone: data.phone,
        hours: data.hours,
        iconUrl: data.iconurl,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error('Erro ao adicionar loja:', error);
      return null;
    }
  },
  
  async update(id: string, updates: Partial<Store>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) {
        updateData.name = updates.name;
      }
      
      if (updates.city !== undefined) {
        updateData.city = updates.city;
      }
      
      if (updates.phone !== undefined) {
        updateData.phone = updates.phone;
      }
      
      if (updates.hours !== undefined) {
        updateData.hours = updates.hours;
      }
      
      if (updates.iconUrl !== undefined) {
        updateData.iconurl = updates.iconUrl;
      }
      
      if (updates.isActive !== undefined) {
        updateData.isactive = updates.isActive;
      }
      
      const { data, error } = await supabase
        .from('stores')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        city: data.city,
        phone: data.phone,
        hours: data.hours,
        iconUrl: data.iconurl,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error(`Erro ao atualizar loja ${id}:`, error);
      return null;
    }
  },
  
  async delete(id: string) {
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
  },
  
  async uploadStoreIcon(file: File): Promise<string> {
    try {
      // Cria um nome de arquivo único baseado no timestamp e nome original
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `stores/${fileName}`;
      
      // Faz o upload para o bucket de storage do Supabase
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Obtém a URL pública do arquivo
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  }
};

// Implementação real do serviço de vendedores
const sellerService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const sellers = data?.map(seller => ({
        id: seller.id,
        name: seller.name,
        storeId: seller.storeid || seller.storeId,
        whatsapp: seller.whatsapp,
        isActive: seller.isactive !== undefined ? seller.isactive : seller.isActive,
        createdAt: seller.createdat || seller.createdAt,
        updatedAt: seller.updatedat || seller.updatedAt
      })) || [];
      
      return sellers;
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
      return [];
    }
  },
  
  async getByStoreId(storeId: string) {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('storeid', storeId)
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const sellers = data?.map(seller => ({
        id: seller.id,
        name: seller.name,
        storeId: seller.storeid || seller.storeId,
        whatsapp: seller.whatsapp,
        isActive: seller.isactive !== undefined ? seller.isactive : seller.isActive,
        createdAt: seller.createdat || seller.createdAt,
        updatedAt: seller.updatedat || seller.updatedAt
      })) || [];
      
      return sellers;
    } catch (error) {
      console.error(`Erro ao buscar vendedores da loja ${storeId}:`, error);
      return [];
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        storeId: data.storeid || data.storeId,
        whatsapp: data.whatsapp,
        isActive: data.isactive !== undefined ? data.isactive : data.isActive,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error(`Erro ao buscar vendedor ${id}:`, error);
      return null;
    }
  },
  
  async add(seller: Omit<Seller, 'id'>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const sellerData = {
        name: seller.name,
        storeid: seller.storeId,
        whatsapp: seller.whatsapp,
        isactive: seller.isActive
      };
      
      const { data, error } = await supabase
        .from('sellers')
        .insert([sellerData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        storeId: data.storeid,
        whatsapp: data.whatsapp,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error('Erro ao adicionar vendedor:', error);
      return null;
    }
  },
  
  async update(id: string, updates: Partial<Seller>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const updateData: Record<string, any> = {};
      
      if (updates.name !== undefined) {
        updateData.name = updates.name;
      }
      
      if (updates.storeId !== undefined) {
        updateData.storeid = updates.storeId;
      }
      
      if (updates.whatsapp !== undefined) {
        updateData.whatsapp = updates.whatsapp;
      }
      
      if (updates.isActive !== undefined) {
        updateData.isactive = updates.isActive;
      }
      
      const { data, error } = await supabase
        .from('sellers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        name: data.name,
        storeId: data.storeid,
        whatsapp: data.whatsapp,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error(`Erro ao atualizar vendedor ${id}:`, error);
      return null;
    }
  },
  
  async delete(id: string) {
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
  }
};

// Implementação real do serviço de logos
const logoService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .order('type', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const logos = data?.map(logo => ({
        id: logo.id,
        imageUrl: logo.imageurl || logo.imageUrl,
        type: logo.type,
        isActive: logo.isactive !== undefined ? logo.isactive : logo.isActive,
        altText: logo.alttext || logo.altText,
        description: logo.description,
        createdAt: logo.createdat || logo.createdAt,
        updatedAt: logo.updatedat || logo.updatedAt
      })) || [];
      
      return logos;
    } catch (error) {
      console.error('Erro ao buscar logos:', error);
      return [];
    }
  },
  
  async getActive() {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('isactive', true)
        .order('type', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const logos = data?.map(logo => ({
        id: logo.id,
        imageUrl: logo.imageurl || logo.imageUrl,
        type: logo.type,
        isActive: true,
        altText: logo.alttext || logo.altText,
        description: logo.description,
        createdAt: logo.createdat || logo.createdAt,
        updatedAt: logo.updatedat || logo.updatedAt
      })) || [];
      
      return logos;
    } catch (error) {
      console.error('Erro ao buscar logos ativos:', error);
      return [];
    }
  },
  
  async getByType(type: string) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('type', type)
        .order('type', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const logos = data?.map(logo => ({
        id: logo.id,
        imageUrl: logo.imageurl || logo.imageUrl,
        type: logo.type,
        isActive: logo.isactive !== undefined ? logo.isactive : logo.isActive,
        altText: logo.alttext || logo.altText,
        description: logo.description,
        createdAt: logo.createdat || logo.createdAt,
        updatedAt: logo.updatedat || logo.updatedAt
      })) || [];
      
      return logos;
    } catch (error) {
      console.error(`Erro ao buscar logos do tipo ${type}:`, error);
      return [];
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        imageUrl: data.imageurl || data.imageUrl,
        type: data.type,
        isActive: data.isactive !== undefined ? data.isactive : data.isActive,
        altText: data.alttext || data.altText,
        description: data.description,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error(`Erro ao buscar logo ${id}:`, error);
      return null;
    }
  },
  
  async add(logo: Omit<Logo, 'id'>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const logoData = {
        imageurl: logo.imageUrl,
        type: logo.type,
        isactive: logo.isActive,
        alttext: logo.altText,
        description: logo.description
      };
      
      const { data, error } = await supabase
        .from('logos')
        .insert([logoData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        imageUrl: data.imageurl,
        type: data.type,
        isActive: data.isactive,
        altText: data.alttext,
        description: data.description,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error('Erro ao adicionar logo:', error);
      return null;
    }
  },
  
  async update(id: string, updates: Partial<Logo>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const updateData: Record<string, any> = {};
      
      if (updates.imageUrl !== undefined) {
        updateData.imageurl = updates.imageUrl;
      }
      
      if (updates.type !== undefined) {
        updateData.type = updates.type;
      }
      
      if (updates.isActive !== undefined) {
        updateData.isactive = updates.isActive;
      }
      
      if (updates.altText !== undefined) {
        updateData.alttext = updates.altText;
      }
      
      if (updates.description !== undefined) {
        updateData.description = updates.description;
      }
      
      const { data, error } = await supabase
        .from('logos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        imageUrl: data.imageurl,
        type: data.type,
        isActive: data.isactive,
        altText: data.alttext,
        description: data.description,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error(`Erro ao atualizar logo ${id}:`, error);
      return null;
    }
  },
  
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('logos')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir logo ${id}:`, error);
      return false;
    }
  },
  
  async uploadLogoImage(file: File): Promise<string> {
    try {
      // Cria um nome de arquivo único baseado no timestamp e nome original
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Faz o upload para o bucket de storage do Supabase
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Obtém a URL pública do arquivo
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem do logo:', error);
      throw error;
    }
  }
};

// Implementação real do serviço de links sociais
const socialLinkService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('platform', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const links = data?.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        description: link.description,
        isActive: link.isactive !== undefined ? link.isactive : link.isActive,
        createdAt: link.createdat || link.createdAt,
        updatedAt: link.updatedat || link.updatedAt
      })) || [];
      
      return links;
    } catch (error) {
      console.error('Erro ao buscar links sociais:', error);
      return [];
    }
  },
  
  async getActive() {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('isactive', true)
        .order('platform', { ascending: true });
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      const links = data?.map(link => ({
        id: link.id,
        platform: link.platform,
        url: link.url,
        description: link.description,
        isActive: true,
        createdAt: link.createdat || link.createdAt,
        updatedAt: link.updatedat || link.updatedAt
      })) || [];
      
      return links;
    } catch (error) {
      console.error('Erro ao buscar links sociais ativos:', error);
      return [];
    }
  },
  
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (!data) return null;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        platform: data.platform,
        url: data.url,
        description: data.description,
        isActive: data.isactive !== undefined ? data.isactive : data.isActive,
        createdAt: data.createdat || data.createdAt,
        updatedAt: data.updatedat || data.updatedAt
      };
    } catch (error) {
      console.error(`Erro ao buscar link social ${id}:`, error);
      return null;
    }
  },
  
  async add(link: Omit<SocialLink, 'id'>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const linkData = {
        platform: link.platform,
        url: link.url,
        description: link.description,
        isactive: link.isActive
      };
      
      const { data, error } = await supabase
        .from('social_links')
        .insert([linkData])
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        platform: data.platform,
        url: data.url,
        description: data.description,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error('Erro ao adicionar link social:', error);
      return null;
    }
  },
  
  async update(id: string, updates: Partial<SocialLink>) {
    try {
      // Converter camelCase para snake_case para o banco de dados
      const updateData: Record<string, any> = {};
      
      if (updates.platform !== undefined) {
        updateData.platform = updates.platform;
      }
      
      if (updates.url !== undefined) {
        updateData.url = updates.url;
      }
      
      if (updates.description !== undefined) {
        updateData.description = updates.description;
      }
      
      if (updates.isActive !== undefined) {
        updateData.isactive = updates.isActive;
      }
      
      const { data, error } = await supabase
        .from('social_links')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      // Mapear os nomes das colunas do banco para o formato da interface
      return {
        id: data.id,
        platform: data.platform,
        url: data.url,
        description: data.description,
        isActive: data.isactive,
        createdAt: data.createdat,
        updatedAt: data.updatedat
      };
    } catch (error) {
      console.error(`Erro ao atualizar link social ${id}:`, error);
      return null;
    }
  },
  
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir link social ${id}:`, error);
      return false;
    }
  }
};

// Exporta os serviços
export { 
  authService,
  bannerService,
  storeService,
  sellerService,
  logoService,
  socialLinkService
}; 