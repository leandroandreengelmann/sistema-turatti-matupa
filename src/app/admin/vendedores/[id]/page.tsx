'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminPageLayout from '@/components/AdminPageLayout';
import { sellerService, storeService } from '@/services/supabaseService';
import { Seller, Store } from '@/data/types';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface EditarVendedorPageProps {
  params: {
    id: string;
  };
}

export default function EditarVendedorPage({ params }: EditarVendedorPageProps) {
  const router = useRouter();
  const sellerId = params.id;
  
  const [formData, setFormData] = useState<Seller>({
    id: sellerId,
    name: '',
    storeId: '',
    whatsapp: '',
    isActive: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stores, setStores] = useState<Store[]>([]);
  const [sellerNotFound, setSellerNotFound] = useState(false);

  // Carregar o vendedor e as lojas ao iniciar
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Carregar dados do vendedor
        const sellerData = await sellerService.getById(sellerId);
        if (!sellerData) {
          setSellerNotFound(true);
          toast.error('Vendedor não encontrado');
          return;
        }
        
        setFormData(sellerData);
        
        // Carregar lojas
        const storesData = await storeService.getAll();
        setStores(storesData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do vendedor');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [sellerId]);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Limpar erro do campo que foi editado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validar formulário antes de enviar
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do vendedor é obrigatório';
    }
    
    if (!formData.storeId) {
      newErrors.storeId = 'A loja é obrigatória';
    }
    
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'O WhatsApp é obrigatório';
    } else {
      // Validação básica de formato de WhatsApp
      const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
      if (!whatsappRegex.test(formData.whatsapp.replace(/\D/g, ''))) {
        newErrors.whatsapp = 'Formato de WhatsApp inválido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Atualizar o vendedor no banco de dados
      const updatedSeller = await sellerService.update(sellerId, {
        name: formData.name,
        storeId: formData.storeId,
        whatsapp: formData.whatsapp,
        isActive: formData.isActive
      });
      
      if (updatedSeller) {
        toast.success('Vendedor atualizado com sucesso!');
        router.push('/admin/vendedores');
      } else {
        toast.error('Erro ao atualizar vendedor. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar vendedor:', error);
      toast.error('Erro ao atualizar vendedor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Se o vendedor não foi encontrado
  if (sellerNotFound) {
    return (
      <AdminPageLayout title="Vendedor não encontrado">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Vendedor não encontrado</h2>
          <p className="text-gray-700 mb-6">
            O vendedor que você está tentando editar não existe ou foi removido.
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
      <AdminPageLayout title="Editando Vendedor">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <span className="ml-3">Carregando dados do vendedor...</span>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title={`Editando: ${formData.name}`}>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Vendedor */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Vendedor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Loja */}
          <div className="space-y-2">
            <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">
              Loja <span className="text-red-500">*</span>
            </label>
            <select
              id="storeId"
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.storeId ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            >
              <option value="">Selecione uma loja</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.city}
                </option>
              ))}
            </select>
            {errors.storeId && (
              <p className="text-red-500 text-sm mt-1">{errors.storeId}</p>
            )}
          </div>
          
          {/* WhatsApp */}
          <div className="space-y-2">
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+5511999999999"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.whatsapp ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isSubmitting}
            />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
            )}
            <p className="text-sm text-gray-500">
              Formato: código do país + DDD + número (ex: +5511999999999)
            </p>
          </div>
          
          {/* Status (Ativo/Inativo) */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive !== false}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Vendedor ativo
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Desmarque esta opção para desativar o vendedor sem excluí-lo do sistema.
            </p>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <Link
              href="/admin/vendedores"
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Atualizar Vendedor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 