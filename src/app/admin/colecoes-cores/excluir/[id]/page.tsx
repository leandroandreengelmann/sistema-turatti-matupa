'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { AlertCircle, CheckCircle2, ArrowLeft, Trash2 } from 'lucide-react';

export default function ExcluirColeçãoCoresPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [collectionNotFound, setCollectionNotFound] = useState(false);
  const [collection, setCollection] = useState<any>(null);
  const [colorsCount, setColorsCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Buscar dados da coleção e dependências
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados da coleção
        const { data: collectionData, error: collectionError } = await supabase
          .from('color_collections')
          .select('*')
          .eq('id', id)
          .single();
          
        if (collectionError) {
          if (collectionError.code === 'PGRST116') {
            setCollectionNotFound(true);
          }
          throw collectionError;
        }
        
        setCollection(collectionData);
        
        // Contar cores associadas
        const { count: colorsCountData, error: colorsError } = await supabase
          .from('colors')
          .select('*', { count: 'exact', head: true })
          .eq('collectionid', id);
          
        if (colorsError) throw colorsError;
        
        setColorsCount(colorsCountData || 0);
        
        // Contar produtos que usam alguma cor desta coleção
        // Nota: Esta parte depende de como os produtos estão relacionados às cores
        // Vamos supor que exista uma tabela product_colors para essa relação
        const { count: productsCountData, error: productsError } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('colorcollectionid', id);
          
        if (productsError) throw productsError;
        
        setProductsCount(productsCountData || 0);
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        if (!collectionNotFound) {
          setError('Ocorreu um erro ao carregar os dados da coleção. Por favor, tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Excluir coleção e suas cores
  const handleDelete = async () => {
    if (!isConfirmed) {
      setError('Por favor, confirme a exclusão marcando a caixa de seleção.');
      return;
    }
    
    setIsDeleting(true);
    setError(null);
    
    try {
      // 1. Primeiro excluir todas as cores associadas
      const { error: colorsError } = await supabase
        .from('colors')
        .delete()
        .eq('collectionid', id);
        
      if (colorsError) throw colorsError;
      
      // 2. Depois excluir a coleção
      const { error: collectionError } = await supabase
        .from('color_collections')
        .delete()
        .eq('id', id);
        
      if (collectionError) throw collectionError;
      
      // Exclusão bem-sucedida
      setDeleteSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/admin/colecoes-cores');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao excluir coleção:', error);
      setError('Ocorreu um erro ao excluir a coleção. Por favor, tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <AdminPageLayout title="Excluindo Coleção">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }
  
  if (collectionNotFound) {
    return (
      <AdminPageLayout title="Coleção não encontrada">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Coleção não encontrada</h2>
          <p className="text-gray-600 mb-6">A coleção que você está tentando excluir não existe ou já foi removida.</p>
          <button
            onClick={() => router.push('/admin/colecoes-cores')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para lista de coleções
          </button>
        </div>
      </AdminPageLayout>
    );
  }
  
  if (deleteSuccess) {
    return (
      <AdminPageLayout title="Coleção Excluída">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Coleção excluída com sucesso!</h2>
          <p className="text-gray-600 mb-6">Você será redirecionado em alguns instantes...</p>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout title="Excluir Coleção de Cores">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle size={24} className="text-red-500 mr-3 mt-0.5" />
            <div>
              <h2 className="text-lg font-medium text-red-800">Atenção: Esta ação não pode ser desfeita</h2>
              <p className="text-red-700 mt-1">
                Você está prestes a excluir a coleção <strong>{collection?.name}</strong> e todas as suas cores.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">Detalhes da coleção a ser excluída:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
            <li><strong>Nome:</strong> {collection?.name}</li>
            <li><strong>Descrição:</strong> {collection?.description || 'Nenhuma descrição'}</li>
            <li><strong>Cores:</strong> {colorsCount} cores nesta coleção</li>
            {productsCount > 0 && (
              <li className="text-red-600">
                <strong>Atenção:</strong> Esta coleção está associada a {productsCount} produtos!
              </li>
            )}
          </ul>
          
          {productsCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <p className="text-yellow-800">
                <strong>Aviso:</strong> Excluir esta coleção pode afetar {productsCount} produtos que a utilizam.
                Recomenda-se revisar ou atualizar esses produtos antes de prosseguir com a exclusão.
              </p>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="confirmDelete"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="confirmDelete" className="ml-2 text-sm text-gray-700">
              Confirmo que desejo excluir permanentemente esta coleção e todas as suas cores
            </label>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.push(`/admin/colecoes-cores/${id}`)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowLeft size={18} className="inline mr-1" />
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || !isConfirmed}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            <Trash2 size={18} className="mr-1" />
            {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
} 