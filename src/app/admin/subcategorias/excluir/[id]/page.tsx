'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function ExcluirSubcategoriaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subcategoriaName, setSubcategoriaName] = useState('');
  const [subcategoriaEncontrada, setSubcategoriaEncontrada] = useState(true);

  useEffect(() => {
    const fetchSubcategoria = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('subcategories')
          .select('name')
          .eq('id', params.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setSubcategoriaEncontrada(false);
          } else {
            throw error;
          }
        }

        if (data) {
          setSubcategoriaName(data.name);
        }
      } catch (error) {
        console.error('Erro ao buscar subcategoria:', error);
        alert('Erro ao carregar dados da subcategoria. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategoria();
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('subcategories')
        .delete()
        .eq('id', params.id);

      if (error) throw error;

      alert('Subcategoria excluída com sucesso!');
      router.push('/admin/subcategorias');
    } catch (error) {
      console.error('Erro ao excluir subcategoria:', error);
      alert('Ocorreu um erro ao excluir a subcategoria. Tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!subcategoriaEncontrada) {
    return (
      <AdminPageLayout title="Subcategoria não encontrada">
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700 mb-4">A subcategoria solicitada não foi encontrada.</p>
          <button
            onClick={() => router.push('/admin/subcategorias')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <ArrowLeft size={18} className="mr-1" />
            Voltar para a lista
          </button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Excluir Subcategoria">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Tem certeza que deseja excluir esta subcategoria?
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">Nome da subcategoria:</span> {subcategoriaName}
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Esta ação não pode ser desfeita. Todos os dados relacionados a esta subcategoria serão permanentemente removidos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/subcategorias')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft size={18} className="mr-1" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              <Trash2 size={18} className="mr-1" />
              {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </button>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
} 