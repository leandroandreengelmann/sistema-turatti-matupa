'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Trash2, ArrowLeft } from 'lucide-react';

export default function ExcluirProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productNotFound, setProductNotFound] = useState(false);
  
  // Buscar dados do produto
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const { data: product, error } = await supabase
          .from('products')
          .select('name, images')
          .eq('id', id)
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            setProductNotFound(true);
          }
          throw error;
        }
        
        if (product) {
          setProductName(product.name);
          
          // Obter primeira imagem para exibição
          if (product.images && product.images.length > 0) {
            if (typeof product.images[0] === 'string') {
              setProductImage(product.images[0]);
            } else if (product.images[0].standard) {
              setProductImage(product.images[0].standard);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Excluir produto
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      alert('Produto excluído com sucesso!');
      router.push('/admin/produtos');
      
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert('Ocorreu um erro ao excluir o produto. Tente novamente mais tarde.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Se o produto não for encontrado
  if (productNotFound) {
    return (
      <AdminPageLayout title="Produto não encontrado">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">O produto que você está tentando excluir não existe ou já foi removido.</p>
          <button
            onClick={() => router.push('/admin/produtos')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para lista de produtos
          </button>
        </div>
      </AdminPageLayout>
    );
  }
  
  // Mostrar carregamento
  if (isLoading) {
    return (
      <AdminPageLayout title="Excluindo Produto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout title="Excluir Produto">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertCircle size={24} className="text-red-500 mr-2" />
            <h2 className="text-xl font-medium text-red-700">Confirmar Exclusão</h2>
          </div>
          
          <p className="text-gray-700 mb-4">
            Você está prestes a excluir permanentemente o produto <strong>{productName}</strong>. 
            Esta ação não pode ser desfeita.
          </p>
          
          <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg mb-6">
            {productImage && (
              <div className="w-16 h-16 mr-4 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={productImage} 
                  alt={productName} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-800">{productName}</h3>
              <p className="text-sm text-gray-500">ID: {id}</p>
            </div>
          </div>
          
          <p className="text-red-600 font-medium mb-6">
            Tem certeza que deseja excluir este produto?
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/produtos')}
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