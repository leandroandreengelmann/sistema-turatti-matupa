'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Trash2, ArrowLeft } from 'lucide-react';

export default function ExcluirCategoriaPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoriesCount, setSubcategoriesCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [categoryNotFound, setCategoryNotFound] = useState(false);
  
  // Buscar dados da categoria
  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true);
      try {
        // Buscar categoria
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('name')
          .eq('id', id)
          .single();
          
        if (categoryError) {
          if (categoryError.code === 'PGRST116') {
            setCategoryNotFound(true);
          }
          throw categoryError;
        }
        
        if (category) {
          setCategoryName(category.name);
          
          // Verificar se há subcategorias associadas
          const { count: subcategoriesCount, error: subcategoriesError } = await supabase
            .from('subcategories')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);
            
          if (subcategoriesError) throw subcategoriesError;
          setSubcategoriesCount(subcategoriesCount || 0);
          
          // Verificar se há produtos associados
          const { count: productsCount, error: productsError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id);
            
          if (productsError) throw productsError;
          setProductsCount(productsCount || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da categoria:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [id]);
  
  // Excluir categoria
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      alert('Categoria excluída com sucesso!');
      router.push('/admin/categorias');
      
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      alert('Ocorreu um erro ao excluir a categoria. Tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Se a categoria não for encontrada
  if (categoryNotFound) {
    return (
      <AdminPageLayout title="Categoria não encontrada">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Categoria não encontrada</h2>
          <p className="text-gray-600 mb-6">A categoria que você está tentando excluir não existe ou já foi removida.</p>
          <button
            onClick={() => router.push('/admin/categorias')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para lista de categorias
          </button>
        </div>
      </AdminPageLayout>
    );
  }
  
  // Mostrar carregamento
  if (isLoading) {
    return (
      <AdminPageLayout title="Excluindo Categoria">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }
  
  // Se houver subcategorias ou produtos associados, mostrar aviso
  const hasAssociatedItems = subcategoriesCount > 0 || productsCount > 0;
  
  return (
    <AdminPageLayout title="Excluir Categoria">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle size={24} className="text-red-500 mr-2" />
            <h2 className="text-xl font-medium text-red-700">Confirmar Exclusão</h2>
          </div>
          
          <p className="text-gray-700 mb-4">
            Você está prestes a excluir permanentemente a categoria <strong>{categoryName}</strong>. 
            Esta ação não pode ser desfeita.
          </p>
          
          {hasAssociatedItems && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-yellow-800 mb-2">Atenção</h3>
              {subcategoriesCount > 0 && (
                <p className="text-yellow-700 mb-2">
                  Esta categoria possui <strong>{subcategoriesCount} subcategoria(s)</strong> associada(s).
                  Ao excluir esta categoria, todas as subcategorias associadas também serão excluídas.
                </p>
              )}
              {productsCount > 0 && (
                <p className="text-yellow-700">
                  Esta categoria possui <strong>{productsCount} produto(s)</strong> associado(s).
                  Ao excluir esta categoria, os produtos perderão esta associação.
                </p>
              )}
            </div>
          )}
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-800">{categoryName}</h3>
            <p className="text-sm text-gray-500">ID: {id}</p>
          </div>
          
          <p className="text-red-600 font-medium mb-6">
            Tem certeza que deseja excluir esta categoria?
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/categorias')}
            className="px-4 py-2 flex items-center text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} className="mr-1" />
            Voltar
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 flex items-center text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            <Trash2 size={18} className="mr-1" />
            {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
} 