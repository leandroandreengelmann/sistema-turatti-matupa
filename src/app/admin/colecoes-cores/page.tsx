'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, RefreshCw } from 'lucide-react';

interface ColorCollection {
  id: string;
  name: string;
  description: string;
  active: boolean;
  imageurl?: string;
  representativecolor?: string;
  createdat: string;
  colorscount: number;
}

export default function ColeçõesCoresPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<ColorCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Carregar coleções de cores
  const loadCollections = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Consulta principal para buscar coleções
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('color_collections')
        .select('*')
        .order('name');
        
      if (collectionsError) throw collectionsError;
      
      // Para cada coleção, buscar a contagem de cores
      const collectionsWithCounts = await Promise.all(
        (collectionsData || []).map(async (collection) => {
          const { count, error: countError } = await supabase
            .from('colors')
            .select('*', { count: 'exact', head: true })
            .eq('collectionid', collection.id);
            
          return {
            ...collection,
            colorscount: count || 0
          };
        })
      );
      
      setCollections(collectionsWithCounts);
    } catch (error) {
      console.error('Erro ao carregar coleções:', error);
      setError('Ocorreu um erro ao carregar as coleções de cores. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Carregar dados iniciais
  useEffect(() => {
    loadCollections();
  }, []);
  
  // Alternar status ativo/inativo
  const toggleCollectionStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('color_collections')
        .update({ active: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Atualizar o estado localmente após a alteração
      setCollections(collections.map(collection => 
        collection.id === id 
          ? { ...collection, active: !currentStatus } 
          : collection
      ));
      
    } catch (error) {
      console.error('Erro ao alterar status da coleção:', error);
      alert('Erro ao alterar o status da coleção. Por favor, tente novamente.');
    }
  };
  
  // Filtrar coleções
  const filteredCollections = collections.filter(collection => {
    // Filtro por termo de busca
    const matchesSearch = 
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      collection.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtro por status (ativo/inativo)
    const matchesStatus = showInactive ? true : collection.active;
    
    return matchesSearch && matchesStatus;
  });
  
  // Cores amostra para o círculo representativo
  const getColorStyle = (color?: string) => {
    return color 
      ? { backgroundColor: color } 
      : { backgroundColor: '#e5e7eb' }; // Cor padrão se não houver representativa
  };
  
  return (
    <AdminPageLayout title="Coleções de Cores">
      {/* Barra de ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Campo de busca */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar coleções..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Filtro de status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
              Mostrar inativos
            </label>
          </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {/* Botão recarregar */}
          <button
            onClick={loadCollections}
            className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            title="Recarregar"
          >
            <RefreshCw size={18} />
          </button>
          
          {/* Botão nova coleção */}
          <Link
            href="/admin/colecoes-cores/novo"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full md:w-auto justify-center"
          >
            <Plus size={18} className="mr-1" />
            Nova Coleção
          </Link>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      
      {/* Tabela de coleções */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCollections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coleção
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cores
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCollections.map((collection) => (
                  <tr key={collection.id} className={!collection.active ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full mr-3 flex-shrink-0" 
                             style={getColorStyle(collection.representativecolor)}>
                          {collection.imageurl && (
                            <img 
                              src={collection.imageurl} 
                              alt={collection.name} 
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div className="font-medium text-gray-900">{collection.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {collection.description || 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{collection.colorscount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        collection.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Botão alternar status */}
                        <button
                          onClick={() => toggleCollectionStatus(collection.id, collection.active)}
                          className={`p-1 rounded ${
                            collection.active 
                              ? 'text-gray-600 hover:bg-gray-100' 
                              : 'text-blue-600 hover:bg-blue-100'
                          }`}
                          title={collection.active ? 'Desativar' : 'Ativar'}
                        >
                          {collection.active ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        
                        {/* Botão editar */}
                        <Link
                          href={`/admin/colecoes-cores/${collection.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        
                        {/* Botão excluir */}
                        <Link
                          href={`/admin/colecoes-cores/excluir/${collection.id}`}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Nenhuma coleção encontrada para esta busca.' 
                : 'Nenhuma coleção de cores cadastrada.'}
            </p>
            <Link
              href="/admin/colecoes-cores/novo"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={18} className="mr-1" />
              Criar Nova Coleção
            </Link>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
} 