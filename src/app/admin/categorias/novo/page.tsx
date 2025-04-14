'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

type Category = {
  id: string;
  name: string;
};

// Função para gerar slug a partir do nome
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
};

export default function NovaCategoriaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
    featured: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome da categoria é obrigatório';
    }
    
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
      // Gerar slug baseado no nome da categoria
      const slug = generateSlug(formData.name);
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: formData.name,
          description: formData.description,
          active: formData.active,
          featured: formData.featured,
          slug: slug // Incluir o slug gerado automaticamente
        }])
        .select();
      
      if (error) throw error;
      
      alert('Categoria criada com sucesso!');
      router.push('/admin/categorias');
      
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      alert('Ocorreu um erro ao criar a categoria. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminPageLayout title="Nova Categoria">
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Categoria */}
          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Categoria *
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
                placeholder="Nome da categoria"
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
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Descrição da categoria (opcional)"
              />
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
                Categoria Ativa
              </label>
            </div>
            
            {/* Em destaque */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Categoria em Destaque
              </label>
              <div className="ml-2 text-xs text-gray-500">
                (Categorias em destaque serão exibidas em áreas especiais da loja)
              </div>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/categorias')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
            >
              <ArrowLeft size={18} className="mr-1" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </AdminPageLayout>
  );
} 