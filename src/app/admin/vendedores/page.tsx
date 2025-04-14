'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Seller } from '@/data/types';
import { sellerService, storeService } from '@/services/supabaseService';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Eye, Search, RefreshCw } from 'lucide-react';

export default function VendedoresPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [stores, setStores] = useState<Record<string, string>>({});

  // Carregar vendedores e lojas ao iniciar
  useEffect(() => {
    loadSellers();
    loadStores();
  }, []);

  // Filtrar vendedores quando o termo de busca ou a opção de mostrar inativos mudar
  useEffect(() => {
    filterSellers();
  }, [searchTerm, showInactive, sellers]);

  // Carrega os vendedores do serviço Supabase
  const loadSellers = async () => {
    try {
      setLoading(true);
      const data = await sellerService.getAll();
      setSellers(data);
    } catch (error) {
      console.error('Erro ao carregar vendedores:', error);
      toast.error('Erro ao carregar vendedores');
    } finally {
      setLoading(false);
    }
  };

  // Carrega as lojas para exibir os nomes
  const loadStores = async () => {
    try {
      const storesData = await storeService.getAll();
      const storesMap: Record<string, string> = {};
      
      storesData.forEach(store => {
        storesMap[store.id] = store.name;
      });
      
      setStores(storesMap);
    } catch (error) {
      console.error('Erro ao carregar lojas:', error);
    }
  };

  // Filtra os vendedores com base no termo de busca e na opção de mostrar inativos
  const filterSellers = () => {
    let filtered = [...sellers];
    
    // Filtra por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        seller => 
          seller.name.toLowerCase().includes(term) || 
          (stores[seller.storeId] && stores[seller.storeId].toLowerCase().includes(term)) ||
          seller.whatsapp.toLowerCase().includes(term)
      );
    }
    
    // Filtra por status (ativo/inativo)
    if (!showInactive) {
      filtered = filtered.filter(seller => seller.isActive !== false);
    }
    
    setFilteredSellers(filtered);
  };

  // Alternar status do vendedor (ativo/inativo)
  const toggleSellerStatus = async (seller: Seller) => {
    try {
      const updatedSeller = await sellerService.update(seller.id, {
        isActive: !seller.isActive
      });
      
      if (updatedSeller) {
        // Atualizar o estado local com o vendedor atualizado
        setSellers(prev => 
          prev.map(s => s.id === seller.id ? { ...s, isActive: !s.isActive } : s)
        );
        
        toast.success(`Vendedor ${seller.isActive ? 'desativado' : 'ativado'} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do vendedor:', error);
      toast.error('Falha ao atualizar o status do vendedor');
    }
  };

  // Renderiza um loader durante o carregamento
  if (loading) {
    return (
      <AdminPageLayout title="Gerenciamento de Vendedores">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Gerenciamento de Vendedores">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Vendedores</h2>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          {/* Campo de busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar vendedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Checkbox para mostrar vendedores inativos */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="showInactive" className="text-sm text-gray-700">
              Mostrar inativos
            </label>
          </div>
          
          {/* Botões de ação */}
          <div className="flex space-x-2">
            <button
              onClick={loadSellers}
              className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              title="Atualizar lista"
            >
              <RefreshCw size={16} className="mr-1" />
              <span className="hidden md:inline">Atualizar</span>
            </button>
            
            <Link
              href="/admin/vendedores/novo"
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              <Plus size={16} className="mr-1" />
              <span>Novo Vendedor</span>
            </Link>
          </div>
        </div>
      </div>
      
      {filteredSellers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nenhum vendedor encontrado</h2>
          {searchTerm || !showInactive ? (
            <p className="text-gray-500 mb-6">
              Tente ajustar os filtros ou {' '}
              <button 
                onClick={() => { setSearchTerm(''); setShowInactive(true); }} 
                className="text-blue-600 hover:underline"
              >
                limpar os filtros
              </button>
            </p>
          ) : (
            <p className="text-gray-500 mb-6">
              Comece adicionando um novo vendedor para exibir em seu site.
            </p>
          )}
          <Link 
            href="/admin/vendedores/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Vendedor
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loja
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id} className={!seller.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{seller.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{stores[seller.storeId] || 'Loja não encontrada'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{seller.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {seller.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/vendedores/${seller.id}`}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <Link
                          href={`/admin/vendedores/excluir/${seller.id}`}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </Link>
                        <button
                          onClick={() => toggleSellerStatus(seller)}
                          className={`p-1 rounded ${
                            seller.isActive 
                              ? 'text-gray-600 hover:bg-gray-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={seller.isActive ? 'Desativar' : 'Ativar'}
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
} 