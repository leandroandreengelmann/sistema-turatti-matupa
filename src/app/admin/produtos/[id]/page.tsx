'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { Category, Subcategory, Product } from '@/data/types';
import { Trash2, AlertCircle, Eye, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import ProductCard from '@/components/ProductCard';

export default function EditarProdutoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [productNotFound, setProductNotFound] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    isPromotion: false,
    active: true,
    isNew: false,
    isMonthPromotion: false,
    isPaint: false,
    isFeatured: false,
    categoryId: '',
    subcategoryId: '',
    sku: '',
    images: [] as any[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Buscar dados do produto, categorias e subcategorias
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        // Buscar produto
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
          
        if (productError) {
          if (productError.code === 'PGRST116') {
            setProductNotFound(true);
          }
          throw productError;
        }
        
        // Buscar categorias
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        // Buscar subcategorias
        const { data: subcategoriesData, error: subcategoriesError } = await supabase
          .from('subcategories')
          .select('*')
          .order('name');
          
        if (subcategoriesError) throw subcategoriesError;
        setSubcategories(subcategoriesData || []);
        
        // Preencher formulário com dados do produto
        if (product) {
          setFormData({
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
            price: product.price ? product.price.toString() : '',
            originalPrice: product.originalprice ? product.originalprice.toString() : '',
            isPromotion: product.ispromotion || false,
            active: product.active !== false, // default true
            isNew: product.isnew || false,
            isMonthPromotion: product.ismonthpromotion || false,
            isPaint: product.ispaint || false,
            isFeatured: product.isfeatured || false,
            categoryId: product.categoryid || '',
            subcategoryId: product.subcategoryid || '',
            sku: product.sku || '',
            images: product.images || []
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        if (!productNotFound) {
          alert('Erro ao carregar produto. Tente novamente mais tarde.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);
  
  // Filtrar subcategorias quando a categoria for selecionada
  useEffect(() => {
    if (formData.categoryId) {
      setFilteredSubcategories(
        subcategories.filter(sub => sub.categoryid === formData.categoryId)
      );
    } else {
      setFilteredSubcategories([]);
    }
    
    // Limpar subcategoria selecionada se a categoria mudar
    if (formData.categoryId && formData.subcategoryId) {
      const subcatExists = subcategories.some(
        sub => sub.categoryid === formData.categoryId && sub.id === formData.subcategoryId
      );
      
      if (!subcatExists) {
        setFormData(prev => ({ ...prev, subcategoryId: '' }));
      }
    }
  }, [formData.categoryId, subcategories, formData.subcategoryId]);
  
  // Validar o formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do produto é obrigatório';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'O slug é obrigatório';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'O preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'O preço deve ser um número positivo';
    }
    
    if (formData.originalPrice.trim() && (isNaN(parseFloat(formData.originalPrice)) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'O preço original deve ser um número positivo';
    }
    
    if (formData.isPromotion && (!formData.originalPrice.trim() || parseFloat(formData.originalPrice) <= parseFloat(formData.price))) {
      newErrors.originalPrice = 'Para produtos em promoção, o preço original deve ser maior que o preço atual';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Selecione uma categoria';
    }
    
    // Verificar se há pelo menos uma imagem
    if (formData.images.length === 0) {
      newErrors.images = 'Adicione pelo menos uma imagem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Gerar slug a partir do nome (se o usuário editar o nome)
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };
  
  // Manipular alterações no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Se o usuário estiver editando o nome, oferecer a opção de atualizar o slug
    if (name === 'name') {
      const newSlug = generateSlug(value);
      if (newSlug !== formData.slug && confirm('Deseja atualizar o slug automaticamente?')) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          slug: newSlug
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };
  
  // Manipular mudanças nas imagens
  const handleImagesChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: urls
    }));
  };
  
  // Enviar formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {      
      // Preparar dados para envio
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: parseFloat(formData.price),
        originalprice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        ispromotion: formData.isPromotion,
        active: formData.active,
        isnew: formData.isNew,
        ismonthpromotion: formData.isMonthPromotion,
        ispaint: formData.isPaint,
        isfeatured: formData.isFeatured,
        categoryid: formData.categoryId || null,
        subcategoryid: formData.subcategoryId || null,
        sku: formData.sku || null,
        images: formData.images
      };
      
      // Atualizar produto no banco de dados
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      
      alert('Produto atualizado com sucesso!');
      
      // Redirecionar para a lista de produtos
      router.push('/admin/produtos');
      
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Ocorreu um erro ao atualizar o produto. Tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Função para gerar o objeto de produto para o preview
  const getPreviewProduct = () => {
    return {
      id: id,
      name: formData.name || 'Nome do Produto',
      slug: formData.slug || 'slug-do-produto',
      description: formData.description || 'Descrição do produto',
      price: formData.isPromotion ? parseFloat(formData.originalPrice) || 0 : parseFloat(formData.price) || 0,
      promoPrice: formData.isPromotion ? parseFloat(formData.price) || 0 : undefined,
      images: formData.images.length > 0 ? formData.images : ['/placeholder-product.jpg'],
      isPromotion: formData.isPromotion,
      ispromotion: formData.isPromotion,
      active: formData.active,
      isnew: formData.isNew,
      sellerName: 'Loja',
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      isPaint: formData.isPaint,
      ismonthpromotion: formData.isMonthPromotion,
      isfeatured: formData.isFeatured
    };
  };
  
  // Se o produto não for encontrado
  if (productNotFound) {
    return (
      <AdminPageLayout title="Produto não encontrado">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-medium text-gray-800 mb-2">Produto não encontrado</h2>
          <p className="text-gray-600 mb-6">O produto que você está tentando editar não existe ou foi removido.</p>
          <button
            onClick={() => router.push('/admin/produtos')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para lista de produtos
          </button>
        </div>
      </AdminPageLayout>
    );
  }
  
  // Mostrar carregamento
  if (isLoading) {
    return (
      <AdminPageLayout title="Editando Produto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminPageLayout>
    );
  }
  
  return (
    <AdminPageLayout 
      title={`Editar Produto: ${formData.name}`}
      backLink="/admin/produtos"
      hasBackButton={true}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : productNotFound ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-start">
          <AlertCircle className="text-yellow-500 mr-3 mt-0.5" />
          <div>
            <h3 className="text-yellow-800 font-medium">Produto não encontrado</h3>
            <p className="text-yellow-700 mt-1">O produto que você está procurando não existe ou foi removido.</p>
            <button 
              onClick={() => router.push('/admin/produtos')}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Voltar para lista de produtos
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Botão de preview fixo */}
            <div className="fixed bottom-6 right-6 z-50">
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="mr-2" size={18} />
                Visualizar Card
              </button>
            </div>

            {/* Informações básicas */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-800">Informações Básicas</h2>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Eye className="mr-1" size={16} /> Visualizar Card
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do produto"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="slug-do-produto"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                  )}
                </div>
                
                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Código de identificação (opcional)"
                  />
                </div>
              </div>
              
              {/* Descrição */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Descrição detalhada do produto"
                />
              </div>
            </div>
            
            {/* Preços */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Preços</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço *
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      R$
                    </span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full p-2 pl-8 border rounded-md ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0,00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                  )}
                </div>
                
                {/* Preço Original */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Original
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      R$
                    </span>
                    <input
                      type="text"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      className={`w-full p-2 pl-8 border rounded-md ${
                        errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0,00"
                    />
                  </div>
                  {errors.originalPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>
                  )}
                </div>
                
                {/* Status */}
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="active"
                      id="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Produto Ativo
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPromotion"
                      id="isPromotion"
                      checked={formData.isPromotion}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isPromotion" className="ml-2 text-sm text-gray-700">
                      Em Promoção
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isNew"
                      id="isNew"
                      checked={formData.isNew}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
                      Produto Novo
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isMonthPromotion"
                      id="isMonthPromotion"
                      checked={formData.isMonthPromotion}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isMonthPromotion" className="ml-2 text-sm text-gray-700">
                      Promoção do Mês
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                      Produto em Destaque
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPaint"
                      id="isPaint"
                      checked={formData.isPaint}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="isPaint" className="ml-2 text-sm text-gray-700">
                      Produto tipo Tinta
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Categorização */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Categorização</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria *
                  </label>
                  <select
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
                
                {/* Subcategoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoria
                  </label>
                  <select
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={!formData.categoryId || filteredSubcategories.length === 0}
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {filteredSubcategories.map(subcategory => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Imagens */}
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Imagens *</h2>
              
              <ImageUploader 
                onImagesChange={handleImagesChange} 
                initialImages={formData.images}
                maxImages={5}
              />
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>
            
            {/* Preview Modal */}
            {showPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Preview do Card do Produto</h3>
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="max-w-sm mx-auto">
                      <ProductCard product={getPreviewProduct()} />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Fechar Preview
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Form actions */}
            <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/admin/produtos')}
                className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </>
                ) : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageLayout>
  );
} 