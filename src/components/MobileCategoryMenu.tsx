'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Category, Subcategory } from '@/data/types';
import { categoryService, subcategoryService } from '@/services/categoryService';

export interface MobileCategoryMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategoryMenu({ isOpen, onClose }: MobileCategoryMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [view, setView] = useState<'categories' | 'subcategories'>('categories');
  const [loadingSubcategories, setLoadingSubcategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Carrega as categorias quando o componente é montado
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const activeCategories = await categoryService.getActiveCategories();
        setCategories(activeCategories);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Carrega subcategorias quando uma categoria é selecionada
  useEffect(() => {
    async function loadSubcategories() {
      if (activeCategory) {
        try {
          const categorySubcategories = await subcategoryService.getSubcategoriesByCategoryId(activeCategory.id);
          setSubcategories(categorySubcategories);
          setLoadingSubcategories(false);
          setSelectedCategory(activeCategory.id);
        } catch (error) {
          console.error('Erro ao carregar subcategorias:', error);
          setLoadingSubcategories(false);
        }
      }
    }

    loadSubcategories();
  }, [activeCategory]);

  // Seleciona uma categoria e muda para a visualização de subcategorias
  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category);
    setView('subcategories');
  };

  // Volta para a lista de categorias
  const handleBackToCategories = () => {
    setView('categories');
    setActiveCategory(null);
  };

  const handleCategoryClick = async (categoryId: string) => {
    try {
      setLoadingSubcategories(true);
      const subcategories = await subcategoryService.getSubcategoriesByCategoryId(categoryId);
      setSubcategories(subcategories);
      setLoadingSubcategories(false);
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Erro ao carregar subcategorias:', error);
      setLoadingSubcategories(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 h-full">
      {view === 'categories' ? (
        <>
          <h2 className="text-xl font-semibold text-blue-800 mb-4 px-2">Categorias</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategorySelect(category)}
                  className="flex items-center justify-between w-full py-3 px-2 text-left hover:bg-blue-50 rounded-md text-gray-700 text-[15px]"
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-5 w-5 text-blue-500" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-blue-600 font-medium text-[15px]"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Voltar
            </button>
          </div>
          
          {activeCategory && (
            <>
              <h2 className="text-xl font-semibold text-blue-800 mb-3 px-2">{activeCategory.name}</h2>
              
              {subcategories.length > 0 ? (
                <ul className="space-y-2">
                  {subcategories.map((subcategory) => (
                    <li key={subcategory.id}>
                      <Link
                        href={`/categorias/${activeCategory.id}/${subcategory.id}`}
                        className="flex items-center justify-between w-full py-3 px-2 text-left hover:bg-blue-50 rounded-md text-gray-700 text-[15px]"
                        onClick={onClose}
                      >
                        <span>{subcategory.name}</span>
                        <ChevronRight className="h-5 w-5 text-blue-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[15px] text-gray-500 px-2">Nenhuma subcategoria encontrada.</p>
              )}
              
              <div className="mt-6 px-2">
                <Link
                  href={`/categorias/${activeCategory.id}`}
                  className="inline-block text-blue-600 font-medium hover:underline text-[15px]"
                  onClick={onClose}
                >
                  Ver todos os produtos de {activeCategory.name}
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
} 