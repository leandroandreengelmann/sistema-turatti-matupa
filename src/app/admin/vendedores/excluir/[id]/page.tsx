'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { sellerService, storeService } from '@/services/supabaseService';
import { Seller } from '@/data/types';
import AdminPageLayout from '@/components/AdminPageLayout';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';

interface ExcluirVendedorPageProps {
  params: {
    id: string;
  };
}

export default function ExcluirVendedorPage({ params }: ExcluirVendedorPageProps) {
  const router = useRouter();
  const vendedorId = params.id;
  
  const [vendedor, setVendedor] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [lojaNome, setLojaNome] = useState<string>('');

  // Carregar dados do vendedor
  useEffect(() => {
    async function loadVendedor() {
      try {
        setIsLoading(true);
        const data = await sellerService.getById(vendedorId);
        
        if (!data) {
          setNotFound(true);
          return;
        }
        
        setVendedor(data);
        
        // Carregar nome da loja
        if (data.storeId) {
          const store = await storeService.getById(data.storeId);
          if (store) {
            setLojaNome(store.name);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar vendedor:', error);
        toast.error('Erro ao carregar dados do vendedor');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadVendedor();
  }, [vendedorId]);

  // Função para excluir o vendedor
  const handleDelete = async () => {
    if (!vendedor) return;
    
    try {
      setIsDeleting(true);
      const success = await sellerService.delete(vendedorId);
      
      if (success) {
        toast.success('Vendedor excluído com sucesso!');
        router.push('/admin/vendedores');
      } else {
        toast.error('Falha ao excluir vendedor. Tente novamente.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Erro ao excluir vendedor:', error);
      toast.error('Ocorreu um erro ao excluir o vendedor.');
      setIsDeleting(false);
    }
  };

  // Se o vendedor não foi encontrado
  if (notFound) {
    return (
      <AdminPageLayout title="Vendedor não encontrado">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Vendedor não encontrado</h2>
          <p className="text-gray-700 mb-6">
            O vendedor que você está tentando excluir não existe ou já foi removido.
          </p>
          <Link 
            href="/admin/vendedores" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para lista de vendedores
          </Link>
        </div>
      </AdminPageLayout>
    );
  }

  // Loader durante o carregamento inicial
  if (isLoading) {
    return (
      <AdminPageLayout title="Excluir Vendedor">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3">Carregando dados do vendedor...</span>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Excluir Vendedor">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/vendedores"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Vendedores
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6 text-center">
          <AlertTriangle size={48} className="mx-auto text-red-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirmar Exclusão</h2>
          <p className="text-gray-600">
            Você está prestes a excluir permanentemente o vendedor abaixo.
            Esta ação não pode ser desfeita.
          </p>
        </div>

        {vendedor && (
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{vendedor.name}</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <span className="font-semibold">Loja:</span> {lojaNome || 'Loja não encontrada'}
              </div>
              <div>
                <span className="font-semibold">WhatsApp:</span> {vendedor.whatsapp}
              </div>
              <div>
                <span className="font-semibold">Status:</span> 
                <span className={`ml-1 ${vendedor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {vendedor.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Link
            href="/admin/vendedores"
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                Confirmar Exclusão
              </>
            )}
          </button>
        </div>
      </div>
    </AdminPageLayout>
  );
} 