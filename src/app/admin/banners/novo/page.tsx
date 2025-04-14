'use client';
import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import AdminPageLayout from '@/components/AdminPageLayout';
import { bannerService } from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

export default function NovoBannerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    order: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setErrors(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Usar o método dedicado do bannerService para fazer upload
      return await bannerService.uploadBannerImage(file);
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      toast.error('Falha ao fazer upload da imagem. Tente novamente.');
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedFile && !previewUrl) {
      newErrors.imageUrl = 'É necessário selecionar uma imagem para o banner';
    }
    
    if (formData.order <= 0) {
      newErrors.order = 'A ordem deve ser um número maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsUploading(true);
      let imageUrl = '';
      
      // Fazer upload da imagem e obter URL persistente
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      
      // Criar o banner com a URL da imagem persistente
      const newBanner = await bannerService.add({
        imageUrl,
        isActive: formData.isActive,
        order: Number(formData.order),
      });
      
      if (newBanner) {
        toast.success('Banner criado com sucesso!');
        router.push('/admin/banners');
      } else {
        toast.error('Erro ao criar banner. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar banner:', error);
      toast.error('Erro ao criar banner. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpa o erro do campo que foi alterado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <AdminPageLayout
      title="Novo Banner"
    >
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Imagem */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Imagem do Banner *
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                Selecionar Imagem
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
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
            )}
            
            {/* Preview da imagem */}
            {previewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Pré-visualização:
                </p>
                <div className="relative overflow-hidden rounded-lg border border-gray-300">
                  <img
                    src={previewUrl}
                    alt="Preview do banner"
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              </div>
            )}
            
            {/* Barra de progresso de upload */}
            {isUploading && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Enviando imagem: {uploadProgress}%
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
          
          {/* Ordem */}
          <div className="space-y-2">
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              Ordem de Exibição *
            </label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.order ? 'border-red-500' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              disabled={isUploading}
            />
            {errors.order && (
              <p className="text-red-500 text-sm mt-1">{errors.order}</p>
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
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isUploading}
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Banner Ativo
              </label>
            </div>
            <p className="text-sm text-gray-500">
              Se desativado, o banner não será exibido na loja.
            </p>
          </div>
          
          {/* Botões de ação */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/banners')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isUploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Salvar Banner'}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 