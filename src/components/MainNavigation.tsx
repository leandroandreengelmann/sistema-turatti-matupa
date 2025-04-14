'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Package, Tag, Layers, Battery, Zap, Gauge, Wrench, Car, Home } from 'lucide-react';
import { categoryService, subcategoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { Category, Subcategory, Product } from '@/data/types';

type SubcategoryWithProducts = {
  id: string;
  name: string;
  href: string;
  products?: { id: string; name: string; href: string }[];
};

type CategoryItem = {
  id: string;
  name: string;
  href: string;
  subcategories?: SubcategoryWithProducts[];
};

type MenuItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  categories?: CategoryItem[];
};

// Ícones fixos para o menu principal
const defaultMenuItems: Omit<MenuItem, 'categories'>[] = [
  {
    name: 'Todas as Categorias',
    href: '/categorias',
    icon: Layers,
  },
  {
    name: 'Painel Solar',
    href: '/categoria/painel-solar',
    icon: Zap,
  },
  {
    name: 'Kits',
    href: '/categoria/kits',
    icon: Package,
  },
  {
    name: 'Baterias',
    href: '/categoria/baterias',
    icon: Battery,
  },
  {
    name: 'Inversor',
    href: '/categoria/inversor',
    icon: Zap,
  },
  {
    name: 'Controlador',
    href: '/categoria/controlador',
    icon: Gauge,
  },
  {
    name: 'Bombas de Água',
    href: '/categoria/bombas-de-agua',
    icon: Wrench,
  },
  {
    name: 'Carro Elétrico',
    href: '/categoria/carro-eletrico',
    icon: Car,
  },
  {
    name: 'Instalação',
    href: '/categoria/instalacao',
    icon: Wrench,
  },
  {
    name: 'Materiais Elétricos',
    href: '/categoria/materiais-eletricos',
    icon: Zap,
  },
  {
    name: 'Motorhome',
    href: '/categoria/motorhome',
    icon: Home,
  },
];

export default function MainNavigation() {
  const [mainMenuItems, setMainMenuItems] = useState<MenuItem[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  // Carregar categorias e subcategorias
  useEffect(() => {
    async function loadData() {
      try {
        // Buscar todas as categorias ativas
        const activeCategories = await categoryService.getActiveCategories();
        console.log('Categorias carregadas:', activeCategories);
        setCategories(activeCategories);
        
        // Buscar todas as subcategorias ativas
        const allSubcategories = await subcategoryService.getActiveSubcategories();
        console.log('Subcategorias carregadas:', allSubcategories);
        setSubcategories(allSubcategories);
        
        // Inicializar menu principal
        await initializeMenu(activeCategories, allSubcategories);
      } catch (error) {
        console.error('Erro ao carregar dados do menu:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Inicializar menu com dados do Supabase
  const initializeMenu = async (cats: Category[], subcats: Subcategory[]) => {
    try {
    // Criar item "Todas as Categorias" com categorias do banco
      const categoriesWithSubcategories: CategoryItem[] = await Promise.all(cats.map(async cat => {
        // Encontrar todas as subcategorias desta categoria
        const categorySubcats = subcats.filter(subcat => subcat.categoryid === cat.id);
        
        // Para cada subcategoria, buscar produtos populares (limitado a 5)
        const subcategoriesWithProducts: SubcategoryWithProducts[] = await Promise.all(
          categorySubcats.map(async subcat => {
            try {
              // Buscar produtos desta subcategoria
              const subcatProducts = await productService.getBySubcategory(subcat.id);
              
              // Limitar a 5 produtos populares
              const popularProducts = subcatProducts.slice(0, 5).map(product => ({
                id: product.id,
                name: product.name,
                href: `/products/${product.id}`
              }));
              
              return {
                id: subcat.id,
                name: subcat.name,
                href: `/categorias/${cat.id}/${subcat.id}`,
                products: popularProducts
              };
            } catch (error) {
              console.error(`Erro ao buscar produtos para subcategoria ${subcat.id}:`, error);
              return {
                id: subcat.id,
                name: subcat.name,
                href: `/categorias/${cat.id}/${subcat.id}`,
                products: []
              };
            }
          })
        );
        
        return {
          id: cat.id,
          name: cat.name,
          href: `/categorias/${cat.id}`,
          subcategories: subcategoriesWithProducts
        };
      }));
      
      // Criar item "Todas as Categorias" com categorias do banco
      const allCategoriesMenuItem: MenuItem = {
        ...defaultMenuItems[0],
        categories: categoriesWithSubcategories
    };
    
    // Combinar com os outros itens do menu padrão
    const menuItems = [
      allCategoriesMenuItem,
      ...defaultMenuItems.slice(1)
    ];
    
    setMainMenuItems(menuItems);
    } catch (error) {
      console.error('Erro ao inicializar menu com produtos:', error);
      
      // Fallback para inicialização sem produtos
      const fallbackMenuItem = {
        ...defaultMenuItems[0],
        categories: cats.map(cat => {
          // Encontrar todas as subcategorias desta categoria
          const categorySubcats = subcats.filter(subcat => subcat.categoryid === cat.id);
          
          return {
            id: cat.id,
            name: cat.name,
            href: `/categorias/${cat.id}`,
            subcategories: categorySubcats.map(subcat => ({
              id: subcat.id,
              name: subcat.name,
              href: `/categorias/${cat.id}/${subcat.id}`
            }))
          };
        })
      };
      
      setMainMenuItems([fallbackMenuItem, ...defaultMenuItems.slice(1)]);
    }
  };

  const handleMenuItemHover = (itemName: string) => {
    setActiveMenuItem(itemName);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setMegaMenuOpen(false);
    setActiveMenuItem(null);
  };

  const activeCategoryItem = mainMenuItems.find(item => item.name === activeMenuItem);

  return (
    <div className="relative bg-white border-b border-gray-200">
      {/* Menu Principal */}
      <div className="container mx-auto">
        <nav className="flex items-center justify-start text-sm text-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {loading ? (
            <div className="flex items-center p-3">
              <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent"></div>
              <span className="ml-2">Carregando...</span>
            </div>
          ) : (
            mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMenuItemHover(item.name)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 whitespace-nowrap hover:text-blue-600 ${
                      activeMenuItem === item.name ? 'text-blue-600 font-medium' : ''
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {item.name}
                    {item.categories && (
                      <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                        activeMenuItem === item.name && megaMenuOpen ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                </div>
              );
            })
          )}
        </nav>
      </div>

      {/* Mega Menu */}
      {megaMenuOpen && activeCategoryItem?.categories && (
        <div 
          className="absolute left-0 w-full bg-white shadow-lg z-50 border-t border-gray-200 transition-all duration-200 ease-in"
          onMouseLeave={handleMouseLeave}
        >
          <div className="container mx-auto py-6 px-4">
            {activeCategoryItem.categories.length > 0 ? (
              <div className="grid grid-cols-4 gap-8">
                {activeCategoryItem.categories.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <Link 
                      href={category.href}
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {category.name}
                    </Link>
                    
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="space-y-4">
                        {category.subcategories.map((subcategory) => (
                          <div key={subcategory.id} className="space-y-2">
                            <Link 
                              href={subcategory.href}
                              className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                            
                            {subcategory.products && subcategory.products.length > 0 && (
                              <ul className="pl-3 space-y-1 border-l-2 border-gray-100">
                                {subcategory.products.map((product) => (
                                  <li key={product.id}>
                                    <Link 
                                      href={product.href}
                                      className="text-xs text-gray-600 hover:text-blue-600 transition-colors block truncate"
                                    >
                                      {product.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Sem subcategorias</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">Nenhuma categoria encontrada</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 