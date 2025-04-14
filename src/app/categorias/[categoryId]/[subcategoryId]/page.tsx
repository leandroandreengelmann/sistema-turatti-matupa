'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Category, Subcategory } from '@/data/types';
import { categoryService, subcategoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import ProductsGrid from '@/components/ProductsGrid';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function SubcategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const subcategoryId = params.subcategoryId as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Carrega informações da categoria
        const categoryData = await categoryService.getCategoryById(categoryId);
        setCategory(categoryData);
        
        // Carrega informações da subcategoria
        const subcategoryData = await subcategoryService.getSubcategoryById(subcategoryId);
        setSubcategory(subcategoryData);
        
        // Carrega produtos da subcategoria usando o método específico
        const subcategoryProducts = await productService.getBySubcategory(subcategoryId);
        setProducts(subcategoryProducts);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (categoryId && subcategoryId) {
      loadData();
    }
  }, [categoryId, subcategoryId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!subcategory || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Subcategoria não encontrada</h3>
          <p className="text-gray-600 mb-6">Não foi possível encontrar a subcategoria solicitada.</p>
          <Link href="/" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition duration-300 inline-flex items-center">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6 text-sm">
        <ol className="flex items-center space-x-1">
          <li>
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              Início
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href={`/categorias/${category.id}`} className="ml-1 text-gray-500 hover:text-blue-600">
              {category.name}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="ml-1 text-blue-700 font-medium">
              {subcategory.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Título da Página */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl mb-8 p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">
          {subcategory.name}
        </h1>
        <p className="text-blue-100 mb-0">
          {subcategory.description || `Confira nossos produtos da subcategoria ${subcategory.name}`}
        </p>
      </div>
      
      {/* Produtos */}
      <div>
        {products.length > 0 ? (
          <ProductsGrid products={products} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center my-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-600 mb-6">Não encontramos produtos nesta subcategoria no momento.</p>
            <Link href="/" className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition duration-300 inline-flex items-center">
              Voltar para a página inicial
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 