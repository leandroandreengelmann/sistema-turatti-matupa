'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminPageLayout from '@/components/AdminPageLayout';
import { storeService } from '@/services/supabaseService';
import { Store } from '@/data/types';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ExcluirLojaPageProps {
  params: {
    id: string;
  };
}

export default function ExcluirLojaPage({ params }: ExcluirLojaPageProps) {
  const storeId = params.id;
  const router = useRouter();
  
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados da loja
  useEffect(() => {
    const loadStore = async () => {
      try {
        const data = await storeService.getById(storeId);
        if (data) {
          setStore(data);
        } else {
          setError('Loja não encontrada.');
          toast.error('Loja não encontrada.');
        }
      } catch (error) {
        console.error('Erro ao carregar loja:', error);
        setError('Erro ao carregar dados da loja.');
        toast.error('Erro ao carregar dados da loja.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStore();
  }, [storeId]);

  // Função para excluir a loja
  const handleDelete = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      const success = await storeService.delete(storeId);
      
      if (success) {
        toast.success('Loja excluída com sucesso!');
        router.push('/admin/lojas');
      } else {
        toast.error('Erro ao excluir loja. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao excluir loja:', error);
      toast.error('Erro ao excluir loja. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout title="Excluir Loja">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (error || !store) {
    return (
      <AdminPageLayout title="Excluir Loja">
        <div className="mb-6 flex items-center">
          <Link
            href="/admin/lojas"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            Voltar para Lojas
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center py-8">
            <p className="text-red-500 font-medium text-lg">{error || 'Loja não encontrada'}</p>
            <Link
              href="/admin/lojas"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Voltar para Lojas
            </Link>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Excluir Loja">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/lojas"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Lojas
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Confirmar exclusão
          </h2>
          <div className="text-red-600 mb-6">
            <Trash2 size={48} className="mx-auto mb-2" />
            <p className="text-lg font-medium">
              Você está prestes a excluir a loja:
            </p>
          </div>
          
          <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">{store.name}</h3>
            <p className="text-gray-700 mb-2"><span className="font-medium">Cidade:</span> {store.city}</p>
            <p className="text-gray-700 mb-2"><span className="font-medium">Telefone:</span> {store.phone}</p>
            {store.hours && (
              <p className="text-gray-700 mb-2"><span className="font-medium">Horário:</span> {store.hours}</p>
            )}
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Status:</span>{' '}
              {store.isActive ? (
                <span className="text-green-600">Ativa</span>
              ) : (
                <span className="text-red-600">Inativa</span>
              )}
            </p>
            
            {store.iconUrl && (
              <div className="mt-4 flex justify-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    src={store.iconUrl}
                    alt="Ícone da loja"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mb-6">
            <p className="text-red-600 font-medium">
              Esta ação não pode ser desfeita!
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link
              href="/admin/lojas"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-1" />
                  Excluir Loja
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
} 