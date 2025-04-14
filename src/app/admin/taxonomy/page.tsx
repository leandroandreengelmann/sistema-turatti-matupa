"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category, Subcategory } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminQuickLinks from '@/components/AdminQuickLinks';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';
import { Tag, Filter, Pencil, Trash2, Tags, ChevronRight } from 'lucide-react';
import { categoryService, subcategoryService } from '@/services/categoryService';

export default function TaxonomyPage() {
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'categories' | 'subcategories'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para categorias
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryActive, setCategoryActive] = useState(true);
  
  // Estados para subcategorias
  const [isEditingSubcategory, setIsEditingSubcategory] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryDescription, setSubcategoryDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryActive, setSubcategoryActive] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  
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
  
  // === FUNÇÕES PARA GERENCIAR CATEGORIAS ===
  
  // Adicionar nova categoria
  const handleAddCategory = () => {
    setIsEditingCategory(true);
    setCurrentCategory(null);
    resetCategoryForm();
  };

  // Editar categoria existente
  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setCategoryActive(category.active !== false);
    setIsEditingCategory(true);
  };

  // Excluir categoria
  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Todas as subcategorias associadas também serão excluídas.')) {
      try {
        // Simulação de exclusão no frontend
        setCategories(prev => prev.filter(category => category.id !== id));
        
        // Remover também todas as subcategorias relacionadas
        setSubcategories(prev => prev.filter(subcategory => subcategory.categoryId !== id));
        
        showToast('Categoria excluída com sucesso!', 'success');
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Resetar formulário de categoria
  const resetCategoryForm = () => {
    setCategoryName('');
    setCategoryDescription('');
    setCategoryActive(true);
  };

  // Cancelar edição de categoria
  const handleCancelCategory = () => {
    setIsEditingCategory(false);
    setCurrentCategory(null);
    resetCategoryForm();
  };

  // Submeter formulário de categoria
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      showToast('O nome da categoria é obrigatório', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Dados da categoria
      const categoryData = {
        name: categoryName,
        description: categoryDescription || undefined,
        active: categoryActive
      };
      
      if (currentCategory) {
        // Atualizar categoria existente (simulado para frontend)
        const updatedCategories = categories.map(c => 
          c.id === currentCategory.id ? { ...c, ...categoryData, id: c.id } : c
        );
        setCategories(updatedCategories);
        showToast(`Categoria "${categoryName}" atualizada com sucesso!`, 'success');
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
        showToast(`Categoria "${categoryName}" adicionada com sucesso!`, 'success');
      }
      
      setIsEditingCategory(false);
      setCurrentCategory(null);
      resetCategoryForm();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // === FUNÇÕES PARA GERENCIAR SUBCATEGORIAS ===
  
  // Adicionar nova subcategoria
  const handleAddSubcategory = () => {
    setIsEditingSubcategory(true);
    setCurrentSubcategory(null);
    resetSubcategoryForm();
  };

  // Editar subcategoria existente
  const handleEditSubcategory = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory);
    setSubcategoryName(subcategory.name);
    setSubcategoryDescription(subcategory.description || '');
    setCategoryId(subcategory.categoryId);
    setSubcategoryActive(subcategory.active !== false);
    setIsEditingSubcategory(true);
  };

  // Excluir subcategoria
  const handleDeleteSubcategory = async (id: string) => {
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

  // Resetar formulário de subcategoria
  const resetSubcategoryForm = () => {
    setSubcategoryName('');
    setSubcategoryDescription('');
    setCategoryId('');
    setSubcategoryActive(true);
  };

  // Cancelar edição de subcategoria
  const handleCancelSubcategory = () => {
    setIsEditingSubcategory(false);
    setCurrentSubcategory(null);
    resetSubcategoryForm();
  };

  // Submeter formulário de subcategoria
  const handleSubmitSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subcategoryName.trim()) {
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
        name: subcategoryName,
        description: subcategoryDescription || undefined,
        categoryId,
        active: subcategoryActive
      };
      
      if (currentSubcategory) {
        // Atualizar subcategoria existente (simulado para frontend)
        const updatedSubcategories = subcategories.map(s => 
          s.id === currentSubcategory.id ? { ...s, ...subcategoryData, id: s.id } : s
        );
        setSubcategories(updatedSubcategories);
        showToast(`Subcategoria "${subcategoryName}" atualizada com sucesso!`, 'success');
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
        showToast(`Subcategoria "${subcategoryName}" adicionada com sucesso!`, 'success');
      }
      
      setIsEditingSubcategory(false);
      setCurrentSubcategory(null);
      resetSubcategoryForm();
    } catch (error) {
      console.error('Erro ao salvar subcategoria:', error);
      showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Configuração das colunas da tabela de categorias
  const categoryColumns = [
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
      header: 'Subcategorias',
      key: 'id',
      render: (value: string) => {
        const count = subcategories.filter(sub => sub.categoryId === value).length;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {count}
          </span>
        );
      }
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
  
  // Configuração das colunas da tabela de subcategorias
  const subcategoryColumns = [
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
      title="Taxonomia de Produtos"
      actionButton={{
        label: activeTab === 'categories' 
          ? "Adicionar Nova Categoria" 
          : "Adicionar Nova Subcategoria",
        onClick: activeTab === 'categories' 
          ? handleAddCategory 
          : handleAddSubcategory,
        show: !(isEditingCategory || isEditingSubcategory)
      }}
      breadcrumb={{ 
        path: '/admin', 
        label: 'Dashboard' 
      }}
    >
      {/* Links rápidos */}
      {!(isEditingCategory || isEditingSubcategory) && (
        <AdminQuickLinks
          links={[
            { href: '/admin/products', label: 'Gerenciar Produtos' },
            { href: '/admin/categories', label: 'Página de Categorias' },
            { href: '/admin/subcategories', label: 'Página de Subcategorias' },
          ]}
        />
      )}
      
      {/* Tabs para alternar entre Categorias e Subcategorias */}
      {!(isEditingCategory || isEditingSubcategory) && (
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Taxonomia">
            <button
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-1 border-b-2 font-medium text-lg flex items-center`}
              onClick={() => setActiveTab('categories')}
            >
              <Tags className="mr-2 h-5 w-5" />
              Categorias
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {categories.length}
              </span>
            </button>
            
            <button
              className={`${
                activeTab === 'subcategories'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } py-4 px-1 border-b-2 font-medium text-lg flex items-center`}
              onClick={() => setActiveTab('subcategories')}
            >
              <Tag className="mr-2 h-5 w-5" />
              Subcategorias
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {subcategories.length}
              </span>
            </button>
          </nav>
        </div>
      )}
      
      {/* Conteúdo de Categorias */}
      {activeTab === 'categories' && (
        <>
          {isEditingCategory ? (
            <AdminFormContainer
              title={currentCategory ? 'Editar Categoria' : 'Nova Categoria'}
              onCancel={handleCancelCategory}
              onSubmit={handleSubmitCategory}
              submitLabel={currentCategory ? 'Atualizar' : 'Salvar'}
              isSubmitting={submitting}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  type="text"
                  id="name"
                  label="Nome da Categoria"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                
                <FormField
                  type="checkbox"
                  id="active"
                  label="Categoria Ativa"
                  checked={categoryActive}
                  onChange={() => setCategoryActive(!categoryActive)}
                />
                
                <div className="col-span-full">
                  <FormField
                    type="textarea"
                    id="description"
                    label="Descrição"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </AdminFormContainer>
          ) : (
            <>
              {/* Exibição em tabela para desktop */}
              <AdminTable
                columns={categoryColumns}
                data={categories}
                actions={{
                  onEdit: (category) => handleEditCategory(category),
                  onDelete: (category) => handleDeleteCategory(category.id)
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
                      <>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {category.description || 'Sem descrição.'}
                        </p>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">Subcategorias:</span>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {subcategories.filter(sub => sub.categoryId === category.id).length}
                          </span>
                        </div>
                      </>
                    }
                    status={{
                      label: category.active !== false ? 'Ativo' : 'Inativo',
                      isActive: category.active !== false
                    }}
                    onEdit={() => handleEditCategory(category)}
                    onDelete={() => handleDeleteCategory(category.id)}
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
        </>
      )}
      
      {/* Conteúdo de Subcategorias */}
      {activeTab === 'subcategories' && (
        <>
          {isEditingSubcategory ? (
            <AdminFormContainer
              title={currentSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
              onCancel={handleCancelSubcategory}
              onSubmit={handleSubmitSubcategory}
              submitLabel={currentSubcategory ? 'Atualizar' : 'Salvar'}
              isSubmitting={submitting}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <FormField
                  type="text"
                  id="name"
                  label="Nome da Subcategoria"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
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
                  checked={subcategoryActive}
                  onChange={() => setSubcategoryActive(!subcategoryActive)}
                />
                
                <div className="col-span-full">
                  <FormField
                    type="textarea"
                    id="description"
                    label="Descrição"
                    value={subcategoryDescription}
                    onChange={(e) => setSubcategoryDescription(e.target.value)}
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
                columns={subcategoryColumns}
                data={filteredSubcategories}
                actions={{
                  onEdit: (subcategory) => handleEditSubcategory(subcategory),
                  onDelete: (subcategory) => handleDeleteSubcategory(subcategory.id)
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
                    onEdit={() => handleEditSubcategory(subcategory)}
                    onDelete={() => handleDeleteSubcategory(subcategory.id)}
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
        </>
      )}
    </AdminPageLayout>
  );
} 