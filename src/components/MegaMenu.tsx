'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TopNavBar from './TopNavBar';
import { ChevronDown } from 'lucide-react';

type SubCategory = {
  id: number;
  name: string;
  slug: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  featured: boolean;
  subcategories: SubCategory[];
};

export default function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Mock data - em produção, substitua por chamada à API
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: 1,
        name: 'Energia Solar',
        slug: 'energia-solar',
        featured: true,
        subcategories: [
          { id: 101, name: 'Placas Solares', slug: 'placas-solares' },
          { id: 102, name: 'Inversores', slug: 'inversores' },
          { id: 103, name: 'Baterias', slug: 'baterias' },
          { id: 104, name: 'Kits Completos', slug: 'kits-completos' },
        ]
      },
      {
        id: 2,
        name: 'Iluminação',
        slug: 'iluminacao',
        featured: true,
        subcategories: [
          { id: 201, name: 'LED', slug: 'led' },
          { id: 202, name: 'Lâmpadas', slug: 'lampadas' },
          { id: 203, name: 'Luminárias', slug: 'luminarias' },
          { id: 204, name: 'Acessórios', slug: 'acessorios-iluminacao' },
        ]
      },
      {
        id: 3,
        name: 'Automação',
        slug: 'automacao',
        featured: true,
        subcategories: [
          { id: 301, name: 'Smart Home', slug: 'smart-home' },
          { id: 302, name: 'Controle de Acesso', slug: 'controle-acesso' },
          { id: 303, name: 'Sensores', slug: 'sensores' },
          { id: 304, name: 'Controladores', slug: 'controladores' },
        ]
      },
      {
        id: 4,
        name: 'Ferramentas',
        slug: 'ferramentas',
        featured: false,
        subcategories: [
          { id: 401, name: 'Elétricas', slug: 'eletricas' },
          { id: 402, name: 'Manuais', slug: 'manuais' },
          { id: 403, name: 'De Medição', slug: 'medicao' },
          { id: 404, name: 'Acessórios', slug: 'acessorios-ferramentas' },
        ]
      },
      {
        id: 5,
        name: 'Materiais Elétricos',
        slug: 'materiais-eletricos',
        featured: false,
        subcategories: [
          { id: 501, name: 'Fios e Cabos', slug: 'fios-cabos' },
          { id: 502, name: 'Disjuntores', slug: 'disjuntores' },
          { id: 503, name: 'Tomadas e Interruptores', slug: 'tomadas-interruptores' },
          { id: 504, name: 'Quadros de Distribuição', slug: 'quadros-distribuicao' },
        ]
      },
    ];
    
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  // Fecha o menu quando clica fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveCategory(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Abre ou fecha o submenu da categoria
  const handleCategoryToggle = (categoryId: number) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };
  
  const featuredCategories = categories.filter(cat => cat.featured);
  const otherCategories = categories.filter(cat => !cat.featured);

  if (loading) {
    return <div className="h-20 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Barra de navegação principal */}
      <TopNavBar />
      
      {/* Menu de categorias */}
      <div className="bg-gray-100 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            {/* Categorias em destaque */}
            <div className="flex-1 flex">
              {featuredCategories.map((category) => (
                <div key={category.id} className="relative group">
                  <button
                    className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-white text-blue-700'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    {category.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      activeCategory === category.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              ))}
            </div>
            
            {/* Botão "Todas as Categorias" */}
            <div className="relative">
              <button
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  activeCategory === 0 ? 'bg-white text-blue-700' : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleCategoryToggle(0)}
              >
                Todas as Categorias
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeCategory === 0 ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mega menu dropdown */}
      {activeCategory !== null && (
        <div className="absolute left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50">
          <div className="container mx-auto py-6">
            {activeCategory === 0 ? (
              /* Todas as categorias */
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {categories.map((category) => (
                  <div key={category.id} className="mb-6">
                    <h3 className="text-md font-semibold mb-3 text-gray-800">
                      <Link href={`/categorias/${category.slug}`} className="hover:text-blue-600">
                        {category.name}
                      </Link>
                    </h3>
                    <ul className="space-y-2">
                      {category.subcategories.map((sub) => (
                        <li key={sub.id}>
                          <Link 
                            href={`/categorias/${category.slug}/${sub.slug}`}
                            className="text-sm text-gray-600 hover:text-blue-600"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              /* Subcategorias da categoria selecionada */
              <div>
                {categories.filter(cat => cat.id === activeCategory).map((category) => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                      <Link 
                        href={`/categorias/${category.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Ver todos os produtos
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {category.subcategories.map((sub) => (
                        <Link 
                          key={sub.id}
                          href={`/categorias/${category.slug}/${sub.slug}`}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="text-center">
                            <div className="h-16 w-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                              {/* Ícone da subcategoria - pode ser substituído por uma imagem real */}
                              <span className="text-xl text-gray-400">{sub.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-700">{sub.name}</h3>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 