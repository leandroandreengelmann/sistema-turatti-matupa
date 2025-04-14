'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import AdminPageLayout from '@/components/AdminPageLayout';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'react-hot-toast';

interface FormData {
  name: string;
  description: string;
  representativeColor: string;
  active: boolean;
  imageUrl: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  representativeColor?: string;
}

export default function NovaColeçãoCoresPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    representativeColor: '#000000',
    active: true,
    imageUrl: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Hook de upload de imagem
  const { uploadImage, isUploading, progress, error: uploadError } = useImageUpload();
  
  // Gerenciamento de arquivo localmente
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Função para gerenciar mudança no arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Criar URL temporária para preview
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  // Função para resetar o estado do arquivo
  const resetFileState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Função para validar o formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da coleção é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.representativeColor) {
      newErrors.representativeColor = 'Escolha uma cor representativa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Atualizar valores do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro do campo ao digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulário
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da coleção é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = formData.imageUrl;

      // Fazer upload da imagem se uma nova foi selecionada
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (uploadError) {
          throw new Error(`Erro ao fazer upload da imagem: ${uploadError}`);
        }
      }

      // 2. Criar a coleção de cores no banco de dados
      const { data, error } = await supabase
        .from('color_collections')
        .insert([
          {
            name: formData.name,
            description: formData.description,
            representativecolor: formData.representativeColor,
            active: formData.active,
            imageurl: imageUrl
          }
        ])
        .select();

      if (error) {
        throw new Error(`Erro ao salvar coleção: ${error.message}`);
      }

      // Redirecionar para a listagem após salvar com sucesso
      toast.success('Coleção de cores criada com sucesso!');
      router.push('/admin/colecoes-cores');
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error(error.message || 'Ocorreu um erro ao salvar a coleção');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminPageLayout title="Nova Coleção de Cores">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/colecoes-cores"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Coleções
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coluna de informações */}
            <div className="space-y-6">
              {/* Nome da coleção */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Coleção <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-md resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
                )}
              </div>
              
              {/* Cor representativa */}
              <div>
                <label htmlFor="representativeColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Representativa
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    id="representativeColor"
                    name="representativeColor"
                    value={formData.representativeColor || '#000000'}
                    onChange={handleInputChange}
                    className="h-10 w-10 border-0 p-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.representativeColor}
                    onChange={handleInputChange}
                    name="representativeColor"
                    className="px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                {errors.representativeColor && (
                  <p className="mt-1 text-xs text-red-600">{errors.representativeColor}</p>
                )}
              </div>
              
              {/* Status */}
              <div className="mt-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Coleção ativa
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Coleções inativas não são exibidas no site.
                </p>
              </div>
            </div>
            
            {/* Coluna de imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Imagem da Coleção (opcional)
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="w-full">
                    <div className="relative mb-4 w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={resetFileState}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                        title="Remover imagem"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                    
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {progress}% concluído
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div className="mt-2 text-center">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="text-blue-600 hover:text-blue-700">
                            Selecione uma imagem
                          </span>{' '}
                          ou arraste e solte
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </>
                )}
                
                {uploadError && (
                  <p className="text-red-500 text-sm mt-2">
                    Erro: {uploadError}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                A imagem será exibida junto com a coleção no catálogo de produtos.
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link
              href="/admin/colecoes-cores"
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-1" />
                  Salvar Coleção
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 