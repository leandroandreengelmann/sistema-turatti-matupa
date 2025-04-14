'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

interface ColorCollectionForm {
  name: string;
  description: string;
  representativeColor: string;
  active: boolean;
  imageUrl: string;
}

interface ColorForm {
  id?: string;
  name: string;
  hex: string;
  isNew?: boolean;
  isDeleted?: boolean;
}

export default function EditarColeçãoCoresPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collectionNotFound, setCollectionNotFound] = useState(false);
  
  const [formData, setFormData] = useState<ColorCollectionForm>({
    name: '',
    description: '',
    representativeColor: '#FFFFFF',
    active: true,
    imageUrl: ''
  });
  
  const [colors, setColors] = useState<ColorForm[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Buscar dados da coleção e suas cores
  useEffect(() => {
    const fetchCollectionData = async () => {
      setIsLoading(true);
      try {
        // Buscar dados da coleção
        const { data: collection, error: collectionError } = await supabase
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
        
        // Preencher formulário com dados da coleção
        if (collection) {
          setFormData({
            name: collection.name || '',
            description: collection.description || '',
            representativeColor: collection.representativeColor || '#FFFFFF',
            active: collection.active !== false, // default true
            imageUrl: collection.imageUrl || ''
          });
          
          // Buscar cores da coleção
          const { data: colorsData, error: colorsError } = await supabase
            .from('colors')
            .select('*')
            .eq('collectionid', id)
            .order('name');
            
          if (colorsError) throw colorsError;
          
          setColors(colorsData || []);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        if (!collectionNotFound) {
          alert('Erro ao carregar coleção. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollectionData();
  }, [id]);
  
  // Manipular alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
    
    // Limpar erro quando o campo for preenchido
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Manipular mudanças na imagem
  const handleImageChange = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        imageUrl: urls[0]
      }));
      
      // Limpar erro de imagem se existir
      if (errors.imageUrl) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.imageUrl;
          return newErrors;
        });
      }
    }
  };
  
  // Adicionar nova cor
  const addColor = () => {
    setColors([
      ...colors,
      {
        name: '',
        hex: '#FFFFFF',
        isNew: true
      }
    ]);
  };
  
  // Remover cor
  const removeColor = (index: number) => {
    const updatedColors = [...colors];
    
    // Se for uma cor existente, marcar para exclusão
    if (updatedColors[index].id) {
      updatedColors[index] = {
        ...updatedColors[index],
        isDeleted: true
      };
    } else {
      // Remover diretamente se for uma nova cor
      updatedColors.splice(index, 1);
    }
    
    setColors(updatedColors);
  };
  
  // Atualizar cor
  const updateColor = (index: number, field: keyof ColorForm, value: string) => {
    const updatedColors = [...colors];
    updatedColors[index] = {
      ...updatedColors[index],
      [field]: value
    };
    setColors(updatedColors);
  };
  
  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da coleção é obrigatório';
    }
    
    const activeColors = colors.filter(color => !color.isDeleted);
    activeColors.forEach((color, index) => {
      if (!color.name.trim()) {
        newErrors[`color_name_${index}`] = 'O nome da cor é obrigatório';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Enviar formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Atualizar dados da coleção
      const { error: collectionError } = await supabase
        .from('color_collections')
        .update({
          name: formData.name,
          description: formData.description,
          representativeColor: formData.representativeColor,
          active: formData.active,
          imageUrl: formData.imageUrl
        })
        .eq('id', id);
        
      if (collectionError) throw collectionError;
      
      // Processar cores
      const colorsToAdd = colors.filter(color => color.isNew && !color.isDeleted);
      const colorsToUpdate = colors.filter(color => color.id && !color.isNew && !color.isDeleted);
      const colorsToDelete = colors.filter(color => color.id && color.isDeleted);
      
      // Adicionar novas cores
      if (colorsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('colors')
          .insert(colorsToAdd.map(color => ({
            name: color.name,
            hex: color.hex,
            collectionid: id
          })));
          
        if (addError) throw addError;
      }
      
      // Atualizar cores existentes
      for (const color of colorsToUpdate) {
        const { error: updateError } = await supabase
          .from('colors')
          .update({
            name: color.name,
            hex: color.hex
          })
          .eq('id', color.id);
          
        if (updateError) throw updateError;
      }
      
      // Excluir cores
      for (const color of colorsToDelete) {
        const { error: deleteError } = await supabase
          .from('colors')
          .delete()
          .eq('id', color.id);
          
        if (deleteError) throw deleteError;
      }
      
      alert('Coleção atualizada com sucesso!');
      router.push('/admin/colecoes-cores');
      
    } catch (error) {
      console.error('Erro ao atualizar coleção:', error);
      alert('Ocorreu um erro ao atualizar a coleção. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (collectionNotFound) {
    return (
      <AdminPageLayout title="Coleção não encontrada">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Coleção não encontrada</h2>
          <p className="text-gray-600 mb-6">A coleção que você está tentando editar não existe ou foi removida.</p>
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
  
  if (isLoading) {
    return (
      <AdminPageLayout title="Editando Coleção">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout title="Editar Coleção de Cores">
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Coleção */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Informações da Coleção</h2>
            
            <div className="space-y-4">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Coleção *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome da coleção de cores"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Descrição */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Descrição da coleção (opcional)"
                />
              </div>
              
              {/* Cor Representativa */}
              <div>
                <label htmlFor="representativeColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Representativa
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="representativeColor"
                    name="representativeColor"
                    value={formData.representativeColor}
                    onChange={handleChange}
                    className="p-1 border border-gray-300 rounded h-10 w-14"
                  />
                  <input
                    type="text"
                    value={formData.representativeColor}
                    onChange={handleChange}
                    name="representativeColor"
                    className="w-28 p-2 border border-gray-300 rounded-md"
                    placeholder="#FFFFFF"
                  />
                  <span className="text-sm text-gray-500">
                    Cor principal que representa esta coleção
                  </span>
                </div>
              </div>
              
              {/* Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagem da Coleção
                </label>
                <ImageUploader 
                  onImagesChange={handleImageChange} 
                  initialImages={formData.imageUrl ? [formData.imageUrl] : []}
                  maxImages={1}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Adicione uma imagem para representar esta coleção (opcional)
                </p>
              </div>
              
              {/* Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                  Coleção Ativa
                </label>
              </div>
            </div>
          </div>
          
          {/* Cores */}
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Cores da Coleção</h2>
              <button
                type="button"
                onClick={addColor}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Cor
              </button>
            </div>
            
            {colors.filter(color => !color.isDeleted).length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md">
                <p className="text-gray-500">Nenhuma cor adicionada a esta coleção.</p>
                <button
                  type="button"
                  onClick={addColor}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Adicionar Primeira Cor
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {colors.map((color, index) => (
                  !color.isDeleted && (
                    <div key={index} className="flex items-center space-x-3 border border-gray-200 p-3 rounded-md bg-white">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="p-1 border border-gray-300 rounded h-10 w-10"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="w-28 p-2 border border-gray-300 rounded-md"
                        placeholder="#FFFFFF"
                      />
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => updateColor(index, 'name', e.target.value)}
                        className={`flex-1 p-2 border rounded-md ${
                          errors[`color_name_${index}`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nome da cor"
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
          
          {/* Botões de Ação */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Deseja excluir esta coleção? Esta ação não pode ser desfeita.')) {
                  router.push(`/admin/colecoes-cores/excluir/${id}`);
                }
              }}
              className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              <Trash2 size={18} className="inline mr-1" />
              Excluir Coleção
            </button>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push('/admin/colecoes-cores')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowLeft size={18} className="inline mr-1" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 