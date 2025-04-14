import { supabase } from '@/lib/supabase';
import { Category, Subcategory } from '@/data/types';

// Dados de categorias
export const categories: Category[] = [
  {
    id: '1',
    name: 'Tintas',
    description: 'Tintas para diversas superfícies',
    active: true,
    ismainmenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Acessórios',
    description: 'Acessórios para pintura',
    active: true,
    ismainmenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Revestimentos',
    description: 'Revestimentos para paredes',
    active: true,
    ismainmenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Impermeabilizantes',
    description: 'Produtos para impermeabilização',
    active: true,
    ismainmenu: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Dados de subcategorias
export const subcategories: Subcategory[] = [
  // Subcategorias de Tintas
  {
    id: '1',
    name: 'Tintas Acrílicas',
    categoryid: '1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Tintas Látex',
    categoryid: '1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Esmaltes',
    categoryid: '1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Vernizes',
    categoryid: '1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Subcategorias de Acessórios
  {
    id: '5',
    name: 'Pincéis',
    categoryid: '2',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Rolos',
    categoryid: '2',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Lixas',
    categoryid: '2',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Subcategorias de Revestimentos
  {
    id: '8',
    name: 'Texturas',
    categoryid: '3',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Grafiatos',
    categoryid: '3',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Subcategorias de Impermeabilizantes
  {
    id: '10',
    name: 'Asfálticos',
    categoryid: '4',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Acrílicos',
    categoryid: '4',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Serviço de categorias integrado ao Supabase
export const categoryService = {
  // Buscar todas as categorias
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  },

  // Buscar categorias ativas
  async getActiveCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter categorias ativas:', error);
      return [];
    }
  },

  // Buscar categorias do menu principal
  async getMainMenuCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .eq('ismainmenu', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter categorias do menu principal:', error);
      return [];
    }
  },

  // Buscar categorias destacadas para o menu
  async getFeaturedCategories(): Promise<Category[]> {
    try {
      // Tenta buscar as que têm a flag "featured"
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .eq('featured', true)
        .order('name');
      
      if (error) {
        console.error('Erro ao buscar categorias destacadas, campo featured pode não existir:', error);
        // Fallback: retorna categorias do menu principal se não encontrar destacadas
        return await this.getMainMenuCategories();
      }
      
      // Se retornou dados, mesmo que vazio, usa-os
      if (data !== null) {
        return data;
      }
      
      // Caso não encontre o campo featured, usa as categorias do menu principal
      return await this.getMainMenuCategories();
    } catch (error) {
      console.error('Erro ao obter categorias destacadas:', error);
      // Fallback para categorias do menu principal em caso de erro
      return await this.getMainMenuCategories();
    }
  },

  // Buscar uma categoria pelo ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar categoria ${id}:`, error);
      return null;
    }
  },

  // Adicionar uma nova categoria
  async addCategory(category: Omit<Category, 'id'>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...category,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      return null;
    }
  },

  // Atualizar uma categoria
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
      console.error(`Erro ao atualizar categoria ${id}:`, error);
      return null;
    }
  },

  // Excluir uma categoria
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir categoria ${id}:`, error);
      return false;
    }
  },

  // SUBCATEGORIAS

  // Buscar todas as subcategorias
  async getAllSubcategories(): Promise<Subcategory[]> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      return [];
    }
  },

  // Buscar subcategorias por ID da categoria
  async getSubcategoriesByCategoryId(categoryId: string): Promise<Subcategory[]> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('categoryid', categoryId)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar subcategorias da categoria ${categoryId}:`, error);
      return [];
    }
  },

  // Buscar subcategorias ativas
  async getActiveSubcategories(): Promise<Subcategory[]> {
    try {
      console.log('Buscando subcategorias...');
      const { data, error } = await supabase
        .from('subcategories')
        .select('*');
        
      if (error) {
        console.error('Erro na consulta de subcategorias:', error);
        throw error;
      }
      
      console.log('Subcategorias retornadas do Supabase:', data);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar subcategorias ativas:', error);
      return [];
    }
  },

  // Buscar uma subcategoria pelo ID
  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar subcategoria ${id}:`, error);
      return null;
    }
  },

  // Adicionar uma nova subcategoria
  async addSubcategory(subcategory: Omit<Subcategory, 'id'>): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{
          ...subcategory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      return null;
    }
  },

  // Atualizar uma subcategoria
  async updateSubcategory(id: string, updates: Partial<Subcategory>): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
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
      console.error(`Erro ao atualizar subcategoria ${id}:`, error);
      return null;
    }
  },

  // Excluir uma subcategoria
  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir subcategoria ${id}:`, error);
      return false;
    }
  }
};

// Serviço de subcategorias (para corrigir os erros de importação)
export const subcategoryService = {
  // Buscar todas as subcategorias
  async getAllSubcategories(): Promise<Subcategory[]> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      return [];
    }
  },
  
  // Buscar subcategorias por categoria
  async getSubcategoriesByCategoryId(categoryId: string): Promise<Subcategory[]> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('categoryid', categoryId)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar subcategorias da categoria ${categoryId}:`, error);
      return [];
    }
  },
  
  // Buscar subcategorias ativas
  async getActiveSubcategories(): Promise<Subcategory[]> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('active', true)
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar subcategorias ativas:', error);
      return [];
    }
  },
  
  // Buscar uma subcategoria pelo ID
  async getSubcategoryById(id: string): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erro ao buscar subcategoria ${id}:`, error);
      return null;
    }
  },
  
  // Adicionar uma nova subcategoria
  async addSubcategory(subcategory: Omit<Subcategory, 'id'>): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{
          ...subcategory,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao adicionar subcategoria:', error);
      return null;
    }
  },
  
  // Atualizar uma subcategoria
  async updateSubcategory(id: string, updates: Partial<Subcategory>): Promise<Subcategory | null> {
    try {
      const { data, error } = await supabase
        .from('subcategories')
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
      console.error(`Erro ao atualizar subcategoria ${id}:`, error);
      return null;
    }
  },
  
  // Excluir uma subcategoria
  async deleteSubcategory(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Erro ao excluir subcategoria ${id}:`, error);
      return false;
    }
  }
}; 