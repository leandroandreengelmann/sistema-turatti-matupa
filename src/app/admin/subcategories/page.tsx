"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category, Subcategory } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';
import AdminQuickLinks from '@/components/AdminQuickLinks';
import { Tag, Filter, Pencil, Trash2 } from 'lucide-react';
import { categoryService, subcategoryService } from '@/services/categoryService';

export default function SubcategoriesPage() {
  const { showToast } = useToast();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [active, setActive] = useState(true);
  
  // Carregar categorias e subcategorias
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, subcategoriesData] = await Promise.all([
          categoryService.getAll(),
          subcategoryService.getAll()
        ]);
        
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast('Erro ao carregar dados', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  // Filtrar subcategorias pela categoria selecionada
  const filteredSubcategories = filterCategory 
    ? subcategories.filter(sub => sub.categoryId === filterCategory)
    : subcategories;

  // Obter nome da categoria a partir do ID
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  // Adicionar nova subcategoria
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentSubcategory(null);
    resetForm();
  };

  // Editar subcategoria existente
  const handleEdit = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    setName(subcategory.name);
    setDescription(subcategory.description || '');
    setCategoryId(subcategory.categoryId);
    setActive(subcategory.active !== false);
    setIsEditing(true);
  };

  // Excluir subcategoria
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta subcategoria?')) {
      try {
        // Simulação de exclusão no frontend
        setSubcategories(prev => prev.filter(subcategory => subcategory.id !== id));
        showToast('Subcategoria excluída com sucesso!', 'success');
      } catch (error) {
        console.error("Erro ao excluir subcategoria:", error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setDescription('');
    setCategoryId('');
    setActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentSubcategory(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('O nome da subcategoria é obrigatório', 'error');
      return;
    }

    if (!categoryId) {
      showToast('Selecione uma categoria para esta subcategoria', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Dados da subcategoria
      const subcategoryData = {
        name,
        description: description || undefined,
        categoryId,
        active
      };
      
      if (currentSubcategory) {
        // Atualizar subcategoria existente (simulado para frontend)
        const updatedSubcategories = subcategories.map(s => 
          s.id === currentSubcategory.id ? { ...s, ...subcategoryData, id: s.id } : s
        );
        setSubcategories(updatedSubcategories);
        showToast(`Subcategoria "${name}" atualizada com sucesso!`, 'success');
      } else {
        // Adicionar nova subcategoria (simulado para frontend)
        const subcategoryIds = subcategories.map(s => parseInt(s.id));
        const newId = subcategoryIds.length > 0 ? (Math.max(...subcategoryIds) + 1).toString() : "1";
        const timestamp = new Date().toISOString();
        const newSubcategory = { 
          ...subcategoryData, 
          id: newId,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        setSubcategories([...subcategories, newSubcategory as Subcategory]);
        showToast(`Subcategoria "${name}" adicionada com sucesso!`, 'success');
      }
      
      setIsEditing(false);
      setCurrentSubcategory(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar subcategoria:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Configuração das colunas da tabela
  const columns = [
    {
      header: 'Nome',
      key: 'name'
    },
    {
      header: 'Categoria',
      key: 'categoryId',
      render: (value: string) => getCategoryName(value)
    },
    {
      header: 'Descrição',
      key: 'description',
      render: (value: string) => value || '-'
    },
    {
      header: 'Status',
      key: 'active',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value !== false ? 'Ativo' : 'Inativo'}
        </span>
      )
    }
  ];
  
  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout 
      title="Gerenciamento de Subcategorias"
      actionButton={{
        label: "Adicionar Nova Subcategoria",
        onClick: handleAddNew,
        show: !isEditing
      }}
      breadcrumb={{ 
        path: '/admin', 
        label: 'Dashboard' 
      }}
    >
      {!isEditing && (
        <AdminQuickLinks
          links={[
            { href: '/admin/products', label: 'Gerenciar Produtos' },
            { href: '/admin/categories', label: 'Gerenciar Categorias' },
            { href: '/admin/taxonomy', label: 'Gerenciar Taxonomia' }
          ]}
        />
      )}
      
      {isEditing ? (
        <AdminFormContainer
          title={currentSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentSubcategory ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome da Subcategoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="select"
              id="categoryId"
              label="Categoria"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={[
                { value: '', label: 'Selecione uma categoria' },
                ...categories.map(cat => ({ 
                  value: cat.id, 
                  label: cat.name 
                }))
              ]}
              required
            />
            
            <FormField
              type="checkbox"
              id="active"
              label="Subcategoria Ativa"
              checked={active}
              onChange={() => setActive(!active)}
            />
            
            <div className="col-span-full">
              <FormField
                type="textarea"
                id="description"
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </AdminFormContainer>
      ) : (
        <>
          {/* Filtro de categorias */}
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium">Filtrar por categoria:</span>
              </div>
              <div className="w-full md:w-64">
                <select 
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {filterCategory && (
                <button
                  onClick={() => setFilterCategory('')}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>
        
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={filteredSubcategories}
            actions={{
              onEdit: (subcategory) => handleEdit(subcategory),
              onDelete: (subcategory) => handleDelete(subcategory.id)
            }}
            emptyText={filterCategory 
              ? "Nenhuma subcategoria encontrada para esta categoria." 
              : "Nenhuma subcategoria cadastrada."}
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSubcategories.map((subcategory) => (
              <AdminItemCard
                key={subcategory.id}
                title={subcategory.name}
                subtitle={`Categoria: ${getCategoryName(subcategory.categoryId)}`}
                content={
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {subcategory.description || 'Sem descrição.'}
                  </p>
                }
                status={{
                  label: subcategory.active !== false ? 'Ativo' : 'Inativo',
                  isActive: subcategory.active !== false
                }}
                onEdit={() => handleEdit(subcategory)}
                onDelete={() => handleDelete(subcategory.id)}
              />
            ))}
            
            {filteredSubcategories.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">
                  {filterCategory 
                    ? "Nenhuma subcategoria encontrada para esta categoria." 
                    : "Nenhuma subcategoria cadastrada."}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
} 