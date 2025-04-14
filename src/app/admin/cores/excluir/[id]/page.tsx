'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-hot-toast';

interface Color {
  id: string;
  name: string;
  hexcode: string;
  collectionid: string;
  ativo: boolean;
  createdat: string;
  collectionname?: string;
}

export default function ExcluirCorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [color, setColor] = useState<Color | null>(null);
  
  // Carregar dados da cor
  useEffect(() => {
    const loadColor = async () => {
      setIsLoading(true);
      try {
        // Buscar a cor
        const { data: colorData, error: colorError } = await supabase
          .from('colors')
          .select('*')
          .eq('id', id)
          .single();
        
        if (colorError) {
          if (colorError.code === 'PGRST116') {
            setNotFound(true);
          }
          throw colorError;
        }
        
        // Buscar a coleção relacionada para exibir o nome
        const { data: collectionData, error: collectionError } = await supabase
          .from('color_collections')
          .select('name')
          .eq('id', colorData.collectionid)
          .single();
        
        if (collectionError && collectionError.code !== 'PGRST116') {
          throw collectionError;
        }
        
        // Atualizar estado com os dados da cor e coleção
        setColor({
          ...colorData,
          collectionname: collectionData?.name || 'Coleção não encontrada'
        });
      } catch (error) {
        console.error('Erro ao carregar dados da cor:', error);
        if (!notFound) {
          toast.error('Erro ao carregar os dados da cor');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadColor();
    }
  }, [id]);
  
  // Excluir cor
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('colors')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Cor excluída com sucesso!');
      router.push('/admin/cores');
    } catch (error) {
      console.error('Erro ao excluir cor:', error);
      toast.error('Ocorreu um erro ao excluir a cor');
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Se a cor não foi encontrada
  if (notFound && !isLoading) {
    return (
      <AdminPageLayout title="Cor não encontrada">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Cor não encontrada</h2>
          <p className="text-gray-600 mb-6">
            A cor que você está tentando excluir não existe ou já foi removida.
          </p>
          <Link 
            href="/admin/cores" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para a lista de cores
          </Link>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout title="Excluir Cor">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/cores"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Cores
        </Link>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Carregando dados da cor...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle size={40} className="text-red-500 mr-4" />
              <h2 className="text-xl font-semibold text-gray-800">
                Tem certeza que deseja excluir esta cor?
              </h2>
            </div>
            
            <div className="text-gray-600 text-center mb-6">
              <p>Esta ação não pode ser desfeita. A cor será permanentemente removida do sistema.</p>
              <p className="mt-2 text-sm">
                Produtos que utilizam esta cor podem ficar sem referência de cor.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row items-center">
                <div 
                  className="w-24 h-24 rounded-md shadow-md mb-4 md:mb-0 md:mr-6"
                  style={{ backgroundColor: color?.hexcode }}
                />
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {color?.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Código Hexadecimal</p>
                      <p className="font-medium">{color?.hexcode}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Coleção</p>
                      <p className="font-medium">{color?.collectionname}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium">
                        <span className={`inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                          color?.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {color?.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link
                href="/admin/cores"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancelar
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium flex items-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-1" />
                    Excluir Permanentemente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
} 