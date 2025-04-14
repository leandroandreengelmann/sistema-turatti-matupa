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

export default function NovaSubcategoriaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .eq('active', true)
          .order('name');
          
        if (error) throw error;
        
        setCategories(data || []);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        alert('Erro ao carregar categorias. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Manipular alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      newErrors.name = 'O nome da subcategoria é obrigatório';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'A categoria é obrigatória';
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
      const { data, error } = await supabase
        .from('subcategories')
        .insert([{
          name: formData.name,
          description: formData.description,
          categoryid: formData.categoryId,
          active: formData.active
        }])
        .select();
      
      if (error) throw error;
      
      alert('Subcategoria criada com sucesso!');
      router.push('/admin/subcategorias');
      
    } catch (error) {
      console.error('Erro ao criar subcategoria:', error);
      alert('Ocorreu um erro ao criar a subcategoria. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminPageLayout title="Nova Subcategoria">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações da Subcategoria */}
            <div className="space-y-4">
              {/* Categoria */}
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>
              
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Subcategoria *
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
                  placeholder="Nome da subcategoria"
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
                  placeholder="Descrição da subcategoria (opcional)"
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
                  Subcategoria Ativa
                </label>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/subcategorias')}
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
                {isSubmitting ? 'Salvando...' : 'Salvar Subcategoria'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageLayout>
  );
} 