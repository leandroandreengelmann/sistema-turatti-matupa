"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';
import AdminQuickLinks from '@/components/AdminQuickLinks';
import { Tag, Pencil, Trash2 } from 'lucide-react';
import { categoryService } from '@/services/categoryService';

export default function CategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [isMainMenu, setIsMainMenu] = useState(false);
  
  // Carregar categorias
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await categoryService.getAll();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        showToast('Erro ao carregar categorias', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [showToast]);

  // Adicionar nova categoria
  const handleAddNew = () => {
    setIsEditing(true);
    setCurrentCategory(null);
    resetForm();
  };

  // Editar categoria existente
  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setActive(category.active !== false);
    setIsMainMenu(category.isMainMenu === true);
    setIsEditing(true);
  };

  // Excluir categoria
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Todas as subcategorias associadas também serão excluídas.')) {
      try {
        // Simulação de exclusão no frontend
        setCategories(prev => prev.filter(category => category.id !== id));
        showToast('Categoria excluída com sucesso!', 'success');
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setName('');
    setDescription('');
    setActive(true);
    setIsMainMenu(false);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    setCurrentCategory(null);
    resetForm();
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast('O nome da categoria é obrigatório', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Dados da categoria
      const categoryData = {
        name,
        description: description || undefined,
        active,
        isMainMenu
      };
      
      if (currentCategory) {
        // Atualizar categoria existente (simulado para frontend)
        const updatedCategories = categories.map(c => 
          c.id === currentCategory.id ? { ...c, ...categoryData, id: c.id } : c
        );
        setCategories(updatedCategories);
        showToast(`Categoria "${name}" atualizada com sucesso!`, 'success');
      } else {
        // Adicionar nova categoria (simulado para frontend)
        const categoryIds = categories.map(c => parseInt(c.id));
        const newId = categoryIds.length > 0 ? (Math.max(...categoryIds) + 1).toString() : "1";
        const timestamp = new Date().toISOString();
        const newCategory = { 
          ...categoryData, 
          id: newId,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        setCategories([...categories, newCategory as Category]);
        showToast(`Categoria "${name}" adicionada com sucesso!`, 'success');
      }
      
      setIsEditing(false);
      setCurrentCategory(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
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
      header: 'Descrição',
      key: 'description',
      render: (value: string) => value || '-'
    },
    {
      header: 'Menu Principal',
      key: 'isMainMenu',
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === true ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {value === true ? 'Sim' : 'Não'}
        </span>
      )
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
      title="Gerenciamento de Categorias"
      actionButton={{
        label: "Adicionar Nova Categoria",
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
            { href: '/admin/subcategories', label: 'Gerenciar Subcategorias' },
            { href: '/admin/taxonomy', label: 'Gerenciar Taxonomia' }
          ]}
        />
      )}
      
      {isEditing ? (
        <AdminFormContainer
          title={currentCategory ? 'Editar Categoria' : 'Nova Categoria'}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel={currentCategory ? 'Atualizar' : 'Salvar'}
          isSubmitting={submitting}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormField
              type="text"
              id="name"
              label="Nome da Categoria"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <FormField
              type="checkbox"
              id="active"
              label="Categoria Ativa"
              checked={active}
              onChange={() => setActive(!active)}
            />
            
            <FormField
              type="checkbox"
              id="isMainMenu"
              label="Mostrar no Menu Principal"
              checked={isMainMenu}
              onChange={() => setIsMainMenu(!isMainMenu)}
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
          {/* Exibição em tabela para desktop */}
          <AdminTable
            columns={columns}
            data={categories}
            actions={{
              onEdit: (category) => handleEdit(category),
              onDelete: (category) => handleDelete(category.id)
            }}
            emptyText="Nenhuma categoria cadastrada."
          />
          
          {/* Exibição em cards para mobile */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
            {categories.map((category) => (
              <AdminItemCard
                key={category.id}
                title={category.name}
                content={
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description || 'Sem descrição.'}
                  </p>
                }
                status={{
                  label: category.active !== false ? 'Ativo' : 'Inativo',
                  isActive: category.active !== false
                }}
                onEdit={() => handleEdit(category)}
                onDelete={() => handleDelete(category.id)}
              />
            ))}
            
            {categories.length === 0 && (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
              </div>
            )}
          </div>
        </>
      )}
    </AdminPageLayout>
  );
} 