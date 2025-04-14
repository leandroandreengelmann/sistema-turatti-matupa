"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Star } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  created_at: string;
  featured: boolean;
  subcategories_count?: number;
};

export default function CategoriasPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // Buscar categorias ordenadas por nome
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Para cada categoria, buscar contagem de subcategorias
      if (categoriesData) {
        const categoriesWithCount = await Promise.all(
          categoriesData.map(async (category) => {
            const { count, error } = await supabase
              .from('subcategories')
              .select('*', { count: 'exact', head: true })
              .eq('categoryid', category.id);

            return {
              ...category,
              subcategories_count: count || 0
            };
          })
        );
        
        setCategories(categoriesWithCount);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      alert('Erro ao carregar categorias. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(
    category => category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminPageLayout title="Gerenciar Categorias">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button
          onClick={() => router.push('/admin/categorias/novo')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Nova Categoria
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white shadow-md rounded-lg p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-gray-500">
            {searchTerm 
              ? 'Nenhuma categoria encontrada com o termo de busca.' 
              : 'Nenhuma categoria cadastrada ainda.'}
          </p>
          <button
            onClick={() => router.push('/admin/categorias/novo')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Adicionar Categoria
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
                  Subcategorias
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destaque
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {category.subcategories_count} subcategoria(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {category.featured ? (
                      <Star className="inline-block h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/admin/categorias/${category.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/categorias/excluir/${category.id}`)}
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