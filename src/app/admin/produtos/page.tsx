"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AdminPageLayout from '@/components/AdminPageLayout';
import { Product } from "@/data/types";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";
import { Edit, Trash2, Plus, Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

export default function AdminProdutosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPromotion, setFilterPromotion] = useState<boolean | null>(null);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>({ key: 'name', direction: 'asc' });
  
  useEffect(() => {
    loadProdutos();
  }, []);
  
  async function loadProdutos() {
    setLoading(true);
    try {
      let query = supabase.from('products').select('*');
      
      const { data, error } = await query;
      
      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const sortedProdutos = [...produtos].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof Product];
    const bValue = b[sortConfig.key as keyof Product];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    }
    
    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortConfig.direction === 'asc'
        ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
        : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }
    
    return 0;
  });
  
  const filteredProdutos = sortedProdutos.filter(produto => {
    let matchesSearch = true;
    let matchesPromotion = true;
    let matchesActive = true;
    
    // Filtrar por termo de pesquisa
    if (searchTerm) {
      matchesSearch = produto.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // Filtrar por promoção
    if (filterPromotion !== null) {
      matchesPromotion = produto.ispromotion === filterPromotion;
    }
    
    // Filtrar por status
    if (filterActive !== null) {
      matchesActive = produto.active === filterActive;
    }
    
    return matchesSearch && matchesPromotion && matchesActive;
  });
  
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Remover produto da lista
      setProdutos(produtos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Erro ao excluir produto. Tente novamente.');
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterPromotion(null);
    setFilterActive(null);
  };
  
  return (
    <AdminPageLayout title="Gerenciamento de Produtos">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64 md:w-80">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        
        <Link 
          href="/admin/produtos/novo"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Link>
      </div>
      
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="relative inline-block">
          <button 
            className={`px-4 py-2 border rounded-md inline-flex items-center ${
              filterPromotion !== null ? 'bg-blue-50 border-blue-300 text-blue-800' : 'border-gray-300 text-gray-700'
            }`}
            onClick={() => setFilterPromotion(filterPromotion === null ? true : (filterPromotion === true ? false : null))}
          >
            <Filter size={16} className="mr-2" />
            Promoção: {filterPromotion === null ? 'Todos' : (filterPromotion ? 'Sim' : 'Não')}
          </button>
        </div>
        
        <div className="relative inline-block">
          <button 
            className={`px-4 py-2 border rounded-md inline-flex items-center ${
              filterActive !== null ? 'bg-blue-50 border-blue-300 text-blue-800' : 'border-gray-300 text-gray-700'
            }`}
            onClick={() => setFilterActive(filterActive === null ? true : (filterActive === true ? false : null))}
          >
            <Filter size={16} className="mr-2" />
            Status: {filterActive === null ? 'Todos' : (filterActive ? 'Ativo' : 'Inativo')}
          </button>
        </div>
        
        {(searchTerm || filterPromotion !== null || filterActive !== null) && (
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md inline-flex items-center text-gray-700 hover:bg-gray-50"
            onClick={clearFilters}
          >
            <X size={16} className="mr-2" />
            Limpar Filtros
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredProdutos.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center">
                          Preço
                          {sortConfig?.key === 'price' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('active')}>
                          Status
                          {sortConfig?.key === 'active' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('ispromotion')}>
                          Promoção
                          {sortConfig?.key === 'ispromotion' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('isnew')}>
                          Novo
                          {sortConfig?.key === 'isnew' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('ismonthpromotion')}>
                          Promoção Mês
                          {sortConfig?.key === 'ismonthpromotion' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('isfeatured')}>
                          Destaque
                          {sortConfig?.key === 'isfeatured' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center cursor-pointer" onClick={() => handleSort('ispaint')}>
                          Tinta
                          {sortConfig?.key === 'ispaint' && (
                            sortConfig.direction === 'asc' ? 
                              <ChevronUp size={14} className="ml-1" /> : 
                              <ChevronDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProdutos.map((produto) => (
                      <tr key={produto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 relative">
                              {produto.images && produto.images.length > 0 && (
                                <Image
                                  src={typeof produto.images[0] === 'string' 
                                    ? produto.images[0]
                                    : produto.images[0].standard}
                                  alt={produto.name}
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 object-cover rounded"
                                />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{produto.name}</div>
                              <div className="text-sm text-gray-500">SKU: {produto.sku || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(produto.price)}</div>
                          {produto.originalprice && produto.originalprice > produto.price && (
                            <div className="text-xs text-gray-500 line-through">{formatCurrency(produto.originalprice)}</div>
                          )}
                          {produto.ispromotion && produto.originalprice && (
                            <div className="text-xs text-green-600 font-medium">
                              {Math.round((1 - produto.price / produto.originalprice) * 100)}% off
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {produto.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.ispromotion ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.ispromotion ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.isnew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.isnew ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.ismonthpromotion ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.ismonthpromotion ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.isfeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.isfeatured ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            produto.ispaint ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {produto.ispaint ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/produtos/${produto.id}`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit size={18} className="inline" />
                          </Link>
                          <button
                            onClick={() => handleDelete(produto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} className="inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 text-center rounded-md shadow">
              <p className="text-gray-500 mb-4">Nenhum produto encontrado com os filtros atuais.</p>
              {(searchTerm || filterPromotion !== null || filterActive !== null) && (
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </>
      )}
    </AdminPageLayout>
  );
} 