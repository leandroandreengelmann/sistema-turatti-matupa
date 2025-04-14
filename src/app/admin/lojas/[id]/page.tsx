'use client';

import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import AdminPageLayout from '@/components/AdminPageLayout';
import { storeService } from '@/services/supabaseService';
import { Store } from '@/data/types';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface EditarLojaPageProps {
  params: {
    id: string;
  };
}

export default function EditarLojaPage({ params }: EditarLojaPageProps) {
  const storeId = params.id;
  const router = useRouter();
  
  const [formData, setFormData] = useState<Omit<Store, 'id'>>({
    name: '',
    city: '',
    phone: '',
    hours: '',
    isActive: true,
    iconUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados da loja ao iniciar a página
  useEffect(() => {
    const loadStore = async () => {
      try {
        const store = await storeService.getById(storeId);
        
        if (store) {
          setFormData({
            name: store.name,
            city: store.city,
            phone: store.phone,
            hours: store.hours || '',
            isActive: store.isActive,
            iconUrl: store.iconUrl || ''
          });
          
          if (store.iconUrl) {
            setPreviewUrl(store.iconUrl);
          }
        } else {
          toast.error('Loja não encontrada.');
          router.push('/admin/lojas');
        }
      } catch (error) {
        console.error('Erro ao carregar loja:', error);
        toast.error('Erro ao carregar dados da loja.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStore();
  }, [storeId, router]);

  // Manipular mudanças nos campos do formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  // Manipular seleção de arquivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Verificar o tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          iconUrl: 'O arquivo selecionado não é uma imagem'
        }));
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Limpar erro do campo de imagem
      if (errors.iconUrl) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.iconUrl;
          return newErrors;
        });
      }
    }
  };

  // Upload de imagem para o Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Upload da imagem usando o serviço
      const imageUrl = await storeService.uploadStoreIcon(file);
      setUploadProgress(100);
      return imageUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Falha ao fazer upload da imagem. Tente novamente.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Validar formulário antes de enviar
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da loja é obrigatório';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'A cidade é obrigatória';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'O telefone é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsUploading(true);
      
      let updatedData = { ...formData };
      
      // Se há um arquivo selecionado, fazer upload e obter a URL
      if (selectedFile) {
        const imageUrl = await uploadImage(selectedFile);
        updatedData.iconUrl = imageUrl;
      }
      
      // Atualizar a loja no banco de dados
      const success = await storeService.update(storeId, updatedData);
      
      if (success) {
        toast.success('Loja atualizada com sucesso!');
        router.push('/admin/lojas');
      } else {
        toast.error('Erro ao atualizar loja. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      toast.error('Erro ao atualizar loja. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminPageLayout title="Editar Loja">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Editar Loja">
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Loja */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome da Loja <span className="text-red-500">*</span>
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
              disabled={isUploading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          
          {/* Cidade */}
          <div className="space-y-2">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Cidade <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isUploading}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          {/* Telefone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(00) 0000-0000"
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isUploading}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          
          {/* Horário de Funcionamento */}
          <div className="space-y-2">
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
              Horário de Funcionamento
            </label>
            <input
              type="text"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              placeholder="Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled={isUploading}
            />
          </div>
          
          {/* Ícone/Imagem */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Ícone/Imagem da Loja
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                {formData.iconUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading}
              />
              {selectedFile && (
                <span className="text-sm text-gray-600">
                  {selectedFile.name}
                </span>
              )}
            </div>
            {errors.iconUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.iconUrl}</p>
            )}
            
            {/* Preview da imagem */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Imagem:
                </p>
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    src={previewUrl}
                    alt="Ícone da loja"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Barra de progresso de upload */}
            {isUploading && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Enviando dados: {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Status Ativo */}
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange(e as ChangeEvent<HTMLInputElement>)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isUploading}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Loja Ativa
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Se desativada, a loja não será exibida no site.
            </p>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <Link
              href="/admin/lojas"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 