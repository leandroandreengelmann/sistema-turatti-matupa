'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2 } from 'lucide-react';

type Subcategory = {
  id: string;
  name: string;
  categoryid: string;
  createdat: string;
  categoryName?: string;
};

export default function SubcategoriasPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    setIsLoading(true);
    try {
      // Buscar subcategorias com join na tabela de categorias para obter o nome da categoria
      const { data, error } = await supabase
        .from('subcategories')
        .select('*, categories(name)')
        .order('name');

      if (error) throw error;

      if (data) {
        // Formatar os dados para uma estrutura mais simples
        const formattedData = data.map(item => ({
          ...item,
          categoryName: item.categories ? item.categories.name : 'Sem categoria'
        }));
        
        setSubcategories(formattedData);
      }
    } catch (error) {
      console.error('Erro ao buscar subcategorias:', error);
      alert('Erro ao carregar subcategorias. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubcategories = subcategories.filter(
    subcategory => 
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminPageLayout title="Gerenciar Subcategorias">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar subcategorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={() => router.push('/admin/subcategorias/novo')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nova Subcategoria
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredSubcategories.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {searchTerm 
              ? 'Nenhuma subcategoria encontrada com o termo de busca.' 
              : 'Nenhuma subcategoria cadastrada ainda.'}
          </p>
          <button
            onClick={() => router.push('/admin/subcategorias/novo')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar Subcategoria
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubcategories.map((subcategory) => (
                <tr key={subcategory.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{subcategory.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subcategory.categoryName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/admin/subcategorias/${subcategory.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/subcategorias/excluir/${subcategory.id}`)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminPageLayout>
  );
} 