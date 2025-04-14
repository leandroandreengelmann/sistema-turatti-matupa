'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { Category, Subcategory } from '@/data/types';
import { categoryService, subcategoryService } from '@/services/categoryService';

export default function DynamicMegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [categorySubcategories, setCategorySubcategories] = useState<Record<string, Subcategory[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carrega categorias e subcategorias
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Carrega apenas categorias ativas para o menu principal
      const mainMenuCategories = await categoryService.getMainMenuCategories();
      setCategories(mainMenuCategories);

      // Carrega categorias destacadas
      const highlightedCategories = await categoryService.getFeaturedCategories();
      setFeaturedCategories(highlightedCategories);

      // Carrega todas as categorias ativas para o menu "Todas as categorias"
      const allActiveCategories = await categoryService.getActiveCategories();
      setAllCategories(allActiveCategories);
      
      // Pré-carrega as subcategorias para cada categoria
      const subcategoriesMap: Record<string, Subcategory[]> = {};
      for (const category of allActiveCategories) {
        const subs = await subcategoryService.getSubcategoriesByCategoryId(category.id);
        subcategoriesMap[category.id] = subs;
      }
      setCategorySubcategories(subcategoriesMap);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Calcula a posição do dropdown quando uma categoria é ativada
  useEffect(() => {
    if (activeCategory && dropdownRef.current && containerRef.current) {
      const activeRef = categoryRefs.current[activeCategory === 'all' ? 'all' : activeCategory];
      
      if (activeRef) {
        // Obtém a posição relativa ao container
        const containerRect = containerRef.current.getBoundingClientRect();
        const activeRect = activeRef.getBoundingClientRect();
        
        // Define o dropdown logo abaixo da categoria
        dropdownRef.current.style.left = `${activeRef.offsetLeft}px`;
        dropdownRef.current.style.width = '90%';
        dropdownRef.current.style.maxWidth = '1200px';
        
        // Assegura que o dropdown não ultrapasse o container à direita
        const dropdownWidth = dropdownRef.current.offsetWidth;
        const containerWidth = containerRect.width;
        const rightEdge = activeRef.offsetLeft + dropdownWidth;
        
        if (rightEdge > containerWidth) {
          // Ajusta para que o dropdown não ultrapasse o limite direito
          dropdownRef.current.style.left = `${Math.max(0, containerWidth - dropdownWidth)}px`;
        }
      }
    }
  }, [activeCategory]);

  // Abre o menu para a categoria ao passar o mouse
  const handleMouseEnter = (categoryId: string) => {
    // Limpa qualquer timeout existente
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Ativa a categoria imediatamente
    setActiveCategory(categoryId);
  };

  // Mostra o menu "Todas as Categorias" ao passar o mouse
  const handleAllCategoriesMouseEnter = () => {
    // Limpa qualquer timeout existente
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Ativa o menu "Todas as Categorias"
    setActiveCategory('all');
  };

  // Fecha o menu quando o mouse sai da área do menu
  const handleMenuMouseLeave = () => {
    // Adiciona um pequeno delay antes de fechar para evitar que feche imediatamente
    // ao passar entre categorias ou entre o dropdown e as categorias
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null);
    }, 300);
  };

  // Cancela o fechamento do menu se o mouse voltar para o menu
  const handleMenuMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // Limpa o timeout quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="h-8 bg-blue-600 border-b border-blue-700">
        <div className="container mx-auto">
          <div className="flex items-center h-full">
            <div className="animate-pulse w-full h-4 bg-blue-400 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full" 
      ref={menuRef}
      onMouseLeave={handleMenuMouseLeave}
    >
      {/* Menu de categorias */}
      <div className="bg-blue-600 border-b border-blue-700">
        <div className="container mx-auto px-3 md:px-4" ref={containerRef}>
          <div className="flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
            {/* Botão "Todas as Categorias" */}
            <div 
              className="relative" 
              ref={(el) => { categoryRefs.current['all'] = el; }}
              onMouseEnter={handleAllCategoriesMouseEnter}
            >
              <button
                className={`flex items-center py-1.5 px-2.5 text-base font-medium transition-colors whitespace-nowrap ${
                  activeCategory === 'all' ? 'text-white border-b-2 border-white' : 'text-blue-50 hover:text-white'
                }`}
                aria-expanded={activeCategory === 'all'}
              >
                Todas as Categorias
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                  activeCategory === 'all' ? 'rotate-180' : ''
                }`} />
              </button>
            </div>
            
            {/* Linha divisória */}
            <div className="h-6 mx-2 border-l border-blue-400"></div>
            
            {/* Categorias em destaque */}
            {featuredCategories.map((category) => (
              <div 
                key={`featured-${category.id}`} 
                className="relative"
                ref={(el) => { categoryRefs.current[category.id] = el; }}
                onMouseEnter={() => handleMouseEnter(category.id)}
              >
                <button
                  className={`flex items-center py-1.5 px-2.5 text-base font-medium transition-colors whitespace-nowrap ${
                    activeCategory === category.id 
                      ? 'text-white border-b-2 border-white' 
                      : 'text-blue-50 hover:text-white'
                  }`}
                  aria-expanded={activeCategory === category.id}
                >
                  {category.name}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                    activeCategory === category.id ? 'rotate-180' : ''
                  }`} />
                </button>
              </div>
            ))}
            
            {/* Categorias do menu principal (opcional, se quiser manter) */}
            {categories.map((category) => {
              // Evita duplicação se a categoria já estiver nas destacadas
              if (featuredCategories.some(fc => fc.id === category.id)) return null;
              
              return (
                <div 
                  key={category.id} 
                  className="relative"
                  ref={(el) => { categoryRefs.current[category.id] = el; }}
                  onMouseEnter={() => handleMouseEnter(category.id)}
                >
                  <button
                    className={`flex items-center py-1.5 px-2.5 text-base font-medium transition-colors whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-blue-50 hover:text-white'
                    }`}
                    aria-expanded={activeCategory === category.id}
                  >
                    {category.name}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      activeCategory === category.id ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Mega menu dropdown para categorias individuais */}
      {activeCategory && (
        <div 
          ref={dropdownRef}
          className="absolute bg-white shadow-md z-40 border-t border-blue-300 rounded-b-lg"
          style={{ width: '90%', maxWidth: '1200px', marginTop: '2px' }}
          onMouseEnter={handleMenuMouseEnter}
        >
          <div className="py-4 px-6">
            {activeCategory === 'all' ? (
              /* Todas as categorias */
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <h3 className="text-base font-semibold mb-2 text-blue-800">
                      <Link href={`/categorias/${category.id}`} className="hover:text-blue-600">
                        {category.name}
                      </Link>
                    </h3>
                    {categorySubcategories[category.id] && categorySubcategories[category.id].length > 0 ? (
                      <ul className="space-y-1 pl-3">
                        {categorySubcategories[category.id].map((sub) => (
                          <li key={sub.id}>
                            <Link 
                              href={`/categorias/${category.id}/${sub.id}`}
                              className="text-[15px] text-gray-600 hover:text-blue-600 block py-1"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[15px] text-gray-500 pl-3">Sem subcategorias</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Subcategorias da categoria selecionada */
              <div>
                {/* Busca a categoria ativa em ambos os arrays: categories e featuredCategories */}
                {(() => {
                  // Encontra a categoria ativa combinando os dois arrays
                  const allAvailableCategories = [...categories, ...featuredCategories];
                  // Elimina duplicatas que possam existir em ambos os arrays
                  const uniqueCategories = allAvailableCategories.filter((cat, index, self) => 
                    index === self.findIndex(c => c.id === cat.id)
                  );
                  
                  // Filtra para encontrar apenas a categoria ativa
                  const activeCategories = uniqueCategories.filter(cat => cat.id === activeCategory);
                  
                  return activeCategories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-blue-800">{category.name}</h2>
                        <Link 
                          href={`/categorias/${category.id}`}
                          className="text-[15px] text-blue-600 hover:underline"
                        >
                          Ver todos os produtos
                        </Link>
                      </div>
                      
                      {categorySubcategories[category.id] && categorySubcategories[category.id].length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
                          {categorySubcategories[category.id].map((sub) => (
                            <Link 
                              key={sub.id}
                              href={`/categorias/${category.id}/${sub.id}`}
                              className="text-[15px] text-gray-600 hover:text-blue-600 block py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[15px] text-gray-500">Nenhuma subcategoria encontrada.</p>
                      )}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 