'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Palette, Plus, Edit, Trash2, Eye, Search, X, RefreshCcw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-hot-toast';

// Interface para as cores
interface Color {
  id: string;
  name: string;
  hexcode: string;
  collectionid: string;
  active: boolean;
  createdat: string;
  collectionname?: string;
}

export default function CoresPage() {
  const router = useRouter();
  const [cores, setCores] = useState<Color[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Carregar todas as cores
  const loadColors = async () => {
    setIsLoading(true);
    try {
      const { data: colorsData, error: colorsError } = await supabase
        .from('colors')
        .select('*');
      
      if (colorsError) throw colorsError;
      
      // Buscar as coleções para obter os nomes
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('color_collections')
        .select('id, name');
      
      if (collectionsError) throw collectionsError;
      
      // Mapear as cores com os nomes das coleções
      const colorsWithCollections = colorsData.map(color => {
        const collection = collectionsData.find(coll => coll.id === color.collectionid);
        return {
          ...color,
          collectionname: collection ? collection.name : 'Sem coleção'
        };
      });
      
      setCores(colorsWithCollections);
    } catch (error) {
      console.error('Erro ao carregar cores:', error);
      toast.error('Falha ao carregar a lista de cores');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados ao montar o componente
  useEffect(() => {
    loadColors();
  }, []);
  
  // Filtrar cores com base no termo de pesquisa e status ativo
  const filteredColors = cores.filter(color => {
    // Filtrar por termo de pesquisa
    const matchesSearch = color.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         color.collectionname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por status ativo/inativo
    const matchesStatus = showInactive ? true : color.active;
    
    return matchesSearch && matchesStatus;
  });
  
  // Alternar status ativo/inativo
  const toggleColorStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('colors')
        .update({ active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      setCores(prevCores => 
        prevCores.map(color => 
          color.id === id ? { ...color, active: !currentStatus } : color
        )
      );
      
      toast.success(`Cor ${currentStatus ? 'desativada' : 'ativada'} com sucesso`);
    } catch (error) {
      console.error('Erro ao atualizar status da cor:', error);
      toast.error('Falha ao atualizar o status da cor');
    }
  };
  
  return (
    <AdminPageLayout title="Gerenciar Cores">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/admin/cores/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={20} className="mr-1" />
          Nova Cor
        </Link>
        
        <button 
          onClick={loadColors} 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md flex items-center"
          disabled={isLoading}
        >
          <RefreshCcw size={16} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>
      
      {/* Filtros e pesquisa */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cores..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm('')}
              >
                <X size={18} className="text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showInactive" className="ml-2 block text-sm text-gray-900">
              Mostrar cores inativas
            </label>
          </div>
        </div>
      </div>
      
      {/* Tabela de cores */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Carregando cores...</span>
            </div>
          </div>
        ) : filteredColors.length === 0 ? (
          <div className="p-8 text-center">
            <Palette size={40} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-2">Nenhuma cor encontrada</p>
            {searchTerm && (
              <p className="text-sm text-gray-400">Tente ajustar sua pesquisa</p>
            )}
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coleção
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredColors.map((color) => (
                <tr key={color.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div 
                      className="w-10 h-10 rounded-md shadow-sm border border-gray-200" 
                      style={{ backgroundColor: color.hexcode }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{color.name}</div>
                    <div className="text-sm text-gray-500">{color.hexcode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{color.collectionname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        color.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {color.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/admin/cores/${color.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </Link>
                      <Link
                        href={`/admin/cores/excluir/${color.id}`}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </Link>
                      <button
                        onClick={() => toggleColorStatus(color.id, color.active)}
                        className={`${
                          color.active 
                            ? 'text-gray-600 hover:text-red-700' 
                            : 'text-gray-600 hover:text-green-700'
                        }`}
                        title={color.active ? 'Desativar' : 'Ativar'}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminPageLayout>
  );
} 