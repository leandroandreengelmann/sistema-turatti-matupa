'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Product, Category, Subcategory } from '@/data/types';
import { categoryService, subcategoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import ProductsGrid from '@/components/ProductsGrid';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Filter, X } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showPromotionsOnly, setShowPromotionsOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Carrega informações da categoria
        const categoryData = await categoryService.getCategoryById(categoryId);
        setCategory(categoryData);
        
        // Carrega subcategorias desta categoria
        const subcategoriesData = await subcategoryService.getSubcategoriesByCategoryId(categoryId);
        setSubcategories(subcategoriesData);
        
        // Carrega produtos usando o método específico para categoria
        const categoryProducts = await productService.getByCategory(categoryId);
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
        
        // Define o range de preço baseado nos produtos desta categoria
        if (categoryProducts.length > 0) {
          const prices = categoryProducts.map(p => p.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (categoryId) {
      loadData();
    }
  }, [categoryId]);
  
  // Aplicar filtros quando qualquer filtro for alterado
  useEffect(() => {
    if (!loading && products.length > 0) {
      let result = [...products];
      
      // Filtrar por subcategoria
      if (activeSubcategory) {
        result = result.filter(product => product.subcategoryId === activeSubcategory);
      }
      
      // Filtrar por range de preço
      result = result.filter(product => {
        const productPrice = product.ispromotion ? (product.originalprice || product.price) : product.price;
        return productPrice >= priceRange[0] && productPrice <= priceRange[1];
      });
      
      // Filtrar apenas promoções
      if (showPromotionsOnly) {
        result = result.filter(product => product.ispromotion);
      }
      
      // Filtrar por termo de busca
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        );
      }
      
      setFilteredProducts(result);
    }
  }, [activeSubcategory, priceRange, showPromotionsOnly, searchTerm, products, subcategories, loading]);
  
  // Limpar todos os filtros
  const clearFilters = () => {
    setActiveSubcategory(null);
    setPriceRange([0, 1000]);
    setShowPromotionsOnly(false);
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Categoria não encontrada</h3>
          <p className="text-gray-600 mb-6">Não foi possível encontrar a categoria solicitada.</p>
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
            <span className="ml-1 text-blue-700 font-medium">
              {category.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Título da Página */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl mb-8 p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-2">
          {category.name}
        </h1>
        <p className="text-blue-100 mb-0">
          {category.description || `Confira todos os produtos da categoria ${category.name}`}
        </p>
      </div>
      
      {/* Layout principal com filtros e produtos */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Barra lateral de filtros (visível em desktop) */}
        <div className="hidden lg:block w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Filtros</h3>
            
            {/* Subcategorias */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Subcategorias</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveSubcategory(null)}
                    className={`text-sm w-full text-left px-2 py-1 rounded ${!activeSubcategory ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Todas as subcategorias
                  </button>
                </li>
                {subcategories.map((subcategory) => (
                  <li key={subcategory.id}>
                    <button 
                      onClick={() => setActiveSubcategory(subcategory.id)}
                      className={`text-sm w-full text-left px-2 py-1 rounded ${activeSubcategory === subcategory.id ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {subcategory.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Filtro de Preço */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2">Faixa de Preço</h4>
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">R$ {priceRange[0]}</span>
                  <span className="text-sm text-gray-500">R$ {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            {/* Filtro de Promoções */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showPromotionsOnly}
                  onChange={() => setShowPromotionsOnly(!showPromotionsOnly)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Apenas Promoções</span>
              </label>
            </div>
            
            {/* Botão para limpar filtros */}
            <button
              onClick={clearFilters}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1">
          {/* Filtros móveis (toggle para dispositivos pequenos) */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-white border border-gray-200 py-3 px-4 rounded-lg shadow-sm flex items-center justify-between"
            >
              <span className="flex items-center text-gray-700 font-medium">
                <Filter size={18} className="mr-2" />
                Filtros
              </span>
              <ChevronDown 
                size={18} 
                className={`text-gray-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {/* Painel de filtros em dispositivos móveis */}
            {showFilters && (
              <div className="mt-2 bg-white rounded-lg shadow-sm p-4">
                {/* Barra de pesquisa */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Subcategorias */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Subcategorias</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setActiveSubcategory(null)}
                      className={`text-sm px-3 py-2 rounded-md ${!activeSubcategory ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Todas
                    </button>
                    {subcategories.map((subcategory) => (
                      <button 
                        key={subcategory.id}
                        onClick={() => setActiveSubcategory(subcategory.id)}
                        className={`text-sm px-3 py-2 rounded-md ${activeSubcategory === subcategory.id ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {subcategory.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Promoções */}
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showPromotionsOnly}
                      onChange={() => setShowPromotionsOnly(!showPromotionsOnly)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Apenas Promoções</span>
                  </label>
                </div>
                
                {/* Range de preço */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">Faixa de Preço</h4>
                  <div className="px-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-500">R$ {priceRange[0]}</span>
                      <span className="text-sm text-gray-500">R$ {priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Botão para limpar filtros */}
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded flex items-center justify-center"
                >
                  <X size={16} className="mr-2" />
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
          
          {/* Barra de pesquisa desktop */}
          <div className="hidden lg:block mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos na categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Resumo dos filtros aplicados */}
          <div className="mb-4 bg-blue-50 rounded-lg p-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-blue-800">Filtros aplicados:</span>
            
            {/* Exibe o filtro de subcategoria ativo */}
            {activeSubcategory && (
              <div className="flex items-center bg-white px-2 py-1 rounded text-sm border border-blue-200">
                <span className="text-gray-700">
                  {subcategories.find(s => s.id === activeSubcategory)?.name}
                </span>
                <button 
                  onClick={() => setActiveSubcategory(null)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Exibe o filtro de preço se não for o padrão */}
            {priceRange[1] < 1000 && (
              <div className="flex items-center bg-white px-2 py-1 rounded text-sm border border-blue-200">
                <span className="text-gray-700">Até R$ {priceRange[1]}</span>
                <button 
                  onClick={() => setPriceRange([0, 1000])}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Exibe o filtro de promoções */}
            {showPromotionsOnly && (
              <div className="flex items-center bg-white px-2 py-1 rounded text-sm border border-blue-200">
                <span className="text-gray-700">Apenas Promoções</span>
                <button 
                  onClick={() => setShowPromotionsOnly(false)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Exibe o termo de busca */}
            {searchTerm && (
              <div className="flex items-center bg-white px-2 py-1 rounded text-sm border border-blue-200">
                <span className="text-gray-700">Busca: {searchTerm}</span>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {/* Se houver filtros aplicados, mostra botão para limpar tudo */}
            {(activeSubcategory || priceRange[1] < 1000 || showPromotionsOnly || searchTerm) && (
              <button
                onClick={clearFilters}
                className="ml-auto text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                Limpar todos
                <X size={14} className="ml-1" />
              </button>
            )}
            
            {/* Se não houver filtros, mostra mensagem */}
            {!activeSubcategory && priceRange[1] === 1000 && !showPromotionsOnly && !searchTerm && (
              <span className="text-sm text-gray-500">Nenhum filtro aplicado</span>
            )}
          </div>
          
          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          {/* Produtos */}
          {filteredProducts.length > 0 ? (
            <ProductsGrid products={filteredProducts} />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center my-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 mb-6">
                Não encontramos produtos com os filtros selecionados. Tente ajustar seus critérios de busca.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition duration-300 inline-flex items-center"
              >
                <X size={16} className="mr-2" />
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 