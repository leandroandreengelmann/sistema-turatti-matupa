import { supabase } from '@/lib/supabase';
import { products, colorCollections, colors, stores } from '@/data/sampleData';

/**
 * Utilitário para inicializar o banco de dados Supabase com dados de exemplo
 * Usado apenas para desenvolvimento quando não é possível acessar o painel do Supabase
 */
export async function initSupabaseData() {
  try {
    console.log('Iniciando migração de dados para o Supabase...');
    
    // Verificar se já existem dados
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
      
    if (count && count > 0) {
      console.log('Banco de dados já contém produtos. Pulando inicialização.');
      return;
    }
    
    // 1. Inserir categorias
    const categories = [
      {
        id: 'c7824ce1-1023-4f2e-860c-5f31f5df9a11',
        name: 'Tintas',
        description: 'Tintas para diversos tipos de superfícies',
        active: true,
        isMainMenu: true
      },
      {
        id: 'c7824ce1-1023-4f2e-860c-5f31f5df9a12',
        name: 'Materiais Elétricos',
        description: 'Materiais para instalações elétricas',
        active: true,
        isMainMenu: true
      }
    ];
    
    await supabase.from('categories').insert(categories);
    console.log('Categorias inseridas com sucesso');
    
    // 2. Inserir subcategorias
    const subcategories = [
      {
        id: 'd7824ce1-1023-4f2e-860c-5f31f5df9a21',
        name: 'Tintas Acrílicas',
        categoryId: 'c7824ce1-1023-4f2e-860c-5f31f5df9a11',
        description: 'Tintas acrílicas para paredes',
        active: true
      },
      {
        id: 'd7824ce1-1023-4f2e-860c-5f31f5df9a22',
        name: 'Tintas Látex',
        categoryId: 'c7824ce1-1023-4f2e-860c-5f31f5df9a11',
        description: 'Tintas látex para paredes internas',
        active: true
      },
      {
        id: 'd7824ce1-1023-4f2e-860c-5f31f5df9a23',
        name: 'Esmaltes',
        categoryId: 'c7824ce1-1023-4f2e-860c-5f31f5df9a11',
        description: 'Esmaltes para madeiras e metais',
        active: true
      }
    ];
    
    await supabase.from('subcategories').insert(subcategories);
    console.log('Subcategorias inseridas com sucesso');
    
    // 3. Inserir coleções de cores
    for (const collection of colorCollections) {
      await supabase.from('color_collections').insert({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        active: true
      });
    }
    console.log('Coleções de cores inseridas com sucesso');
    
    // 4. Inserir cores
    for (const color of colors) {
      await supabase.from('colors').insert({
        id: color.id,
        name: color.name,
        collectionId: color.collectionId,
        hex: color.hex,
        active: true
      });
    }
    console.log('Cores inseridas com sucesso');
    
    // 5. Inserir lojas
    for (const store of stores) {
      await supabase.from('stores').insert({
        id: store.id,
        name: store.name,
        city: store.city,
        phone: store.phone,
        hours: store.hours,
        isActive: true
      });
    }
    console.log('Lojas inseridas com sucesso');
    
    // 6. Inserir produtos
    for (const product of products) {
      // Converter imagens para JSON
      const images = product.images.map(img => {
        if (typeof img === 'string') {
          return {
            id: `img-${Math.random().toString(36).substring(2, 10)}`,
            standard: img,
            thumbnail: img,
            isMain: false
          };
        }
        return img;
      });
      
      // Determinar a subcategoria com base no nome do produto
      let subcategoryId = 'd7824ce1-1023-4f2e-860c-5f31f5df9a21'; // Default: Tintas Acrílicas
      
      if (product.name.toLowerCase().includes('esmalte')) {
        subcategoryId = 'd7824ce1-1023-4f2e-860c-5f31f5df9a23'; // Esmaltes
      } else if (product.name.toLowerCase().includes('látex') || product.name.toLowerCase().includes('latex')) {
        subcategoryId = 'd7824ce1-1023-4f2e-860c-5f31f5df9a22'; // Tintas Látex
      }
      
      await supabase.from('products').insert({
        id: product.id,
        name: product.name,
        slug: product.name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || product.price,
        isPromotion: product.isPromotion,
        active: true,
        isNew: product.isNew || false,
        sellerName: product.sellerName,
        images: images,
        categoryId: 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', // Default categoria
        subcategoryId: subcategoryId
      });
    }
    console.log('Produtos inseridos com sucesso');
    
    console.log('Inicialização do Supabase concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o Supabase:', error);
  }
} 