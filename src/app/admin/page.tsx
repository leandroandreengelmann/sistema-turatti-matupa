'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package2, 
  Palette, 
  Store, 
  Image as ImageIcon, 
  Users, 
  ShoppingCart,
  Tags,
  Tag,
  Layers
} from 'lucide-react';
import { productService, colorCollectionService, storeService, bannerService, sellerService } from '@/services/localDataService';
import { categoryService, subcategoryService } from '@/services/categoryService';

// Define o tipo para estatísticas
type Stats = {
  products: number;
  collections: number;
  colors: number;
  stores: number;
  banners: number;
  sellers: number;
  categories: number;
  subcategories: number;
};

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    collections: 0,
    colors: 0,
    stores: 0,
    banners: 0,
    sellers: 0,
    categories: 0,
    subcategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const products = await productService.getAll();
        const collections = await colorCollectionService.getAll();
        const stores = await storeService.getAll();
        const banners = await bannerService.getAll();
        const sellers = await sellerService.getAll();
        const categories = await categoryService.getAll();
        const subcategories = await subcategoryService.getAll();
        
        setStats({
          products: products.length,
          collections: collections.length,
          colors: 0,
          stores: stores.length,
          banners: banners.length,
          sellers: sellers.length,
          categories: categories.length,
          subcategories: subcategories.length
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStats();
  }, []);

  // Cards de menu para o dashboard
  const menuCards = [
    {
      title: 'Produtos',
      icon: Package2,
      description: 'Gerencie todos os produtos da loja',
      count: stats.products,
      link: '/admin/products',
      color: 'from-sky-500 to-sky-600',
      category: 'catálogo'
    },
    {
      title: 'Categorias',
      icon: Tags,
      description: 'Gerencie categorias de produtos',
      count: stats.categories,
      link: '/admin/categories',
      color: 'from-green-500 to-green-600',
      category: 'catálogo'
    },
    {
      title: 'Subcategorias',
      icon: Tag,
      description: 'Gerencie subcategorias de produtos',
      count: stats.subcategories,
      link: '/admin/subcategories',
      color: 'from-teal-500 to-teal-600',
      category: 'catálogo'
    },
    {
      title: 'Taxonomia',
      icon: Layers,
      description: 'Gerencie categorias e subcategorias juntas',
      count: stats.categories + stats.subcategories,
      link: '/admin/taxonomy',
      color: 'from-blue-500 to-blue-600',
      category: 'catálogo'
    },
    {
      title: 'Coleções',
      icon: Palette,
      description: 'Administre coleções de cores',
      count: stats.collections,
      link: '/admin/collections',
      color: 'from-indigo-500 to-indigo-600',
      category: 'catálogo'
    },
    {
      title: 'Banners',
      icon: ImageIcon,
      description: 'Configure banners promocionais',
      count: stats.banners,
      link: '/admin/banners',
      color: 'from-rose-400 to-rose-500',
      category: 'marketing'
    },
    {
      title: 'Lojas',
      icon: Store,
      description: 'Gerencie dados das lojas físicas',
      count: stats.stores,
      link: '/admin/stores',
      color: 'from-emerald-500 to-emerald-600',
      category: 'lojas'
    },
    {
      title: 'Vendedores',
      icon: Users,
      description: 'Gerencie equipe de vendedores',
      count: stats.sellers,
      link: '/admin/sellers',
      color: 'from-amber-400 to-amber-500',
      category: 'equipe'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
          <p className="text-slate-500">Carregando informações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Gerenciamento de Catálogo - Nova versão */}
      <div>
        <div className="flex flex-col space-y-12">
          {/* Seção Catálogo */}
          <div>
            <div className="border-b border-slate-200 pb-2 mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Gerenciamento de Catálogo</h2>
              <p className="text-sm text-slate-500 mt-1">Gerencie produtos, coleções e cores</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCards
                .filter(card => card.category === 'catálogo')
                .map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <Link href={card.link} key={index}>
                      <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full">
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-opacity-10 ${card.color.includes('sky') ? 'bg-sky-100 text-sky-700' : card.color.includes('indigo') ? 'bg-indigo-100 text-indigo-700' : 'bg-violet-100 text-violet-700'}`}>
                              {card.count}
                            </div>
                          </div>
                          
                          <div className="mb-auto">
                            <h3 className="text-lg font-medium text-slate-800 mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-500">{card.description}</p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                              Gerenciar
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
          
          {/* Seção Marketing */}
          <div>
            <div className="border-b border-slate-200 pb-2 mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Marketing</h2>
              <p className="text-sm text-slate-500 mt-1">Gerencie banners e promoções</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCards
                .filter(card => card.category === 'marketing')
                .map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <Link href={card.link} key={index}>
                      <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full">
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium bg-opacity-10">
                              {card.count}
                            </div>
                          </div>
                          
                          <div className="mb-auto">
                            <h3 className="text-lg font-medium text-slate-800 mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-500">{card.description}</p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                              Gerenciar
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
          
          {/* Seção Lojas e Equipe */}
          <div>
            <div className="border-b border-slate-200 pb-2 mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Lojas e Equipe</h2>
              <p className="text-sm text-slate-500 mt-1">Gerencie lojas físicas e vendedores</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuCards
                .filter(card => card.category === 'lojas' || card.category === 'equipe')
                .map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <Link href={card.link} key={index}>
                      <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full">
                        <div className="p-6 flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-opacity-10 ${card.color.includes('emerald') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {card.count}
                            </div>
                          </div>
                          
                          <div className="mb-auto">
                            <h3 className="text-lg font-medium text-slate-800 mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-500">{card.description}</p>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                              Gerenciar
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
