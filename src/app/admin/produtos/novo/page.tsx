'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageLayout from '@/components/AdminPageLayout';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Plus, X, Image as ImageIcon, Eye } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import ProductCard from '@/components/ProductCard';

// Função para gerar slug a partir do nome do produto
const generateSlug = (text: string): string => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// Interface para o formulário de produto
interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price: string;
  originalPrice: string;
  isPromotional: boolean;
  categoryId: string;
  subcategoryId: string;
  images: (string | File)[];
  isNew: boolean;
  isMonthPromotion: boolean;
  isPaint: boolean;
  isFeatured: boolean;
  active: boolean;
}

// Interface para os erros do formulário
interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  originalPrice?: string;
  categoryId?: string;
  images?: string;
  [key: string]: string | undefined;
}

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  name: string;
  categoryid: string;
};

export default function NovoProdutoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    originalPrice: '',
    isPromotional: false,
    categoryId: '',
    subcategoryId: '',
    images: [],
    isNew: false,
    isMonthPromotion: false,
    isPaint: false,
    isFeatured: false,
    active: true,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  // Buscar categorias e subcategorias
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      setIsLoading(true);
      
      try {
        // Buscar categorias
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoryError) throw categoryError;
        
        // Buscar subcategorias
        const { data: subcategoryData, error: subcategoryError } = await supabase
          .from('subcategories')
          .select('*')
          .order('name');
          
        if (subcategoryError) throw subcategoryError;
        
        setCategories(categoryData || []);
        setSubcategories(subcategoryData || []);
        
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoriesAndSubcategories();
  }, []);
  
  // Filtrar subcategorias baseado na categoria selecionada
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryid === formData.categoryId
      );
      setFilteredSubcategories(filtered);
      
      // Limpar subcategoria selecionada se ela não pertencer à categoria atual
      if (formData.subcategoryId && !filtered.some(sub => sub.id === formData.subcategoryId)) {
        setFormData(prev => ({ ...prev, subcategoryId: '' }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
  }, [formData.categoryId, subcategories]);
  
  // Gerar slug automaticamente quando o nome muda
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const newSlug = generateSlug(formData.name);
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  }, [formData.name]);
  
  // Função de atualização do formulário que limpa os erros correspondentes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Atualiza o estado do formulário
    setFormData({ ...formData, [name]: value });
    
    // Gera o slug automaticamente se o campo de nome for alterado
    if (name === 'name') {
      setFormData(prev => ({ ...prev, slug: generateSlug(value) }));
    }
    
    // Remove o erro específico quando o campo é corrigido
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  // Função para lidar com alterações em checkboxes
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  // Manipular recebimento de imagens do componente ImageUploader
  const handleImagesChange = (urls: string[]) => {
    setImageUrls(urls);
    // Atualizar o formData com as URLs
    setFormData(prev => ({ ...prev, images: urls }));
  };
  
  // Validar formulário
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do produto é obrigatório';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug do produto é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição do produto é obrigatória';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um número válido maior que zero';
    }
    
    if (formData.originalPrice.trim() && (isNaN(parseFloat(formData.originalPrice)) || parseFloat(formData.originalPrice) <= 0)) {
      newErrors.originalPrice = 'Preço original deve ser um número válido maior que zero';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }
    
    if (formData.isPromotional && (!formData.originalPrice || parseFloat(formData.originalPrice) <= parseFloat(formData.price))) {
      newErrors.originalPrice = 'Preço original deve ser maior que o preço promocional';
    }
    
    if (formData.images.length === 0) {
      newErrors.images = 'Pelo menos uma imagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Lidar com envio do formulário
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // Verificar se o slug já existe
      let slugToUse = formData.slug;
      let slugExists = true;
      let counter = 1;
      
      while (slugExists) {
        const { data: existingProduct, error, status } = await supabase
          .from('products')
          .select('slug')
          .eq('slug', slugToUse)
          .maybeSingle(); // Usar maybeSingle em vez de single para evitar erros
        
        if (error && error.code !== 'PGRST116') {
          console.error('Erro ao verificar slug:', error);
          throw error;
        }
        
        if (!existingProduct) {
          // Slug não existe, podemos usar
          slugExists = false;
        } else {
          // Slug existe, adicionar sufixo numérico
          slugToUse = `${formData.slug}-${counter}`;
          counter++;
        }
      }
      
      // Criar produto no banco de dados com o slug único
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          slug: slugToUse,
          description: formData.description,
          price: parseFloat(formData.price),
          originalprice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          ispromotion: formData.isPromotional,
          categoryid: formData.categoryId,
          subcategoryid: formData.subcategoryId || null,
          images: imageUrls, // Usar as URLs que já foram enviadas pelo ImageUploader
          isnew: formData.isNew,
          ismonthpromotion: formData.isMonthPromotion,
          ispaint: formData.isPaint,
          isfeatured: formData.isFeatured,
          active: formData.active
        }])
        .select();
        
      if (productError) {
        console.error('Erro ao salvar produto:', productError);
        
        if (productError.message?.includes('row-level security policy')) {
          alert('Erro de permissão: Você precisa ter acesso admin para essa operação. Confirme que está autenticado e tente novamente.');
        } else {
          alert(`Erro ao salvar produto: ${productError.message}`);
        }
        throw productError;
      }
      
      // Informar sobre modificação no slug, se ocorreu
      if (slugToUse !== formData.slug) {
        alert(`Produto criado com sucesso!\nO slug foi modificado para evitar duplicidade: ${slugToUse}`);
      } else {
        alert('Produto criado com sucesso!');
      }
      
      router.push('/admin/produtos');
      
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      
      // Exibir mensagem mais específica
      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.message) {
          alert(`Erro: ${err.message}`);
        } else {
          alert('Ocorreu um erro ao salvar o produto. Por favor, tente novamente.');
        }
      } else {
        alert('Ocorreu um erro ao salvar o produto. Por favor, tente novamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para gerar o objeto de produto para o preview
  const getPreviewProduct = () => {
    return {
      id: 'preview',
      name: formData.name || 'Nome do Produto',
      slug: formData.slug || 'slug-do-produto',
      description: formData.description || 'Descrição do produto',
      price: formData.isPromotional ? parseFloat(formData.originalPrice) || 0 : parseFloat(formData.price) || 0,
      promoPrice: formData.isPromotional ? parseFloat(formData.price) || 0 : undefined,
      images: imageUrls.length > 0 ? imageUrls : ['/placeholder-product.jpg'],
      isPromotion: formData.isPromotional,
      ispromotion: formData.isPromotional,
      active: formData.active,
      isnew: formData.isNew,
      sellerName: 'Loja',
      categoryId: formData.categoryId,
      subcategoryId: formData.subcategoryId,
      isPaint: formData.isPaint
    };
  };
  
  return (
    <AdminPageLayout title="Novo Produto">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do produto */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Produto*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome do produto"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL)*
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="slug-do-produto"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>
              </div>
              
              {/* Descrição */}
              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descreva o produto de forma detalhada"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
            
            {/* Preços */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Preços</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Preço */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$)*
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0,00"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
                
                {/* Preço original */}
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Preço Original (R$) {formData.isPromotional && '*'}
                  </label>
                  <input
                    type="text"
                    id="originalPrice"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0,00"
                  />
                  {errors.originalPrice && (
                    <p className="text-red-500 text-sm mt-1">{errors.originalPrice}</p>
                  )}
                </div>
                
                {/* É promocional */}
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    id="isPromotional"
                    name="isPromotional"
                    checked={formData.isPromotional}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPromotional" className="ml-2 text-sm text-gray-700">
                    Produto em promoção
                  </label>
                </div>
              </div>
            </div>
            
            {/* Categorias */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Categoria</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Categoria */}
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria*
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.categoryId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>
                
                {/* Subcategoria */}
                <div>
                  <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoria
                  </label>
                  <select
                    id="subcategoryId"
                    name="subcategoryId"
                    value={formData.subcategoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled={!formData.categoryId || filteredSubcategories.length === 0}
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Status do Produto */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Status do Produto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                    Produto Ativo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isNew"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isNew" className="ml-2 text-sm text-gray-700">
                    Produto Novidade
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMonthPromotion"
                    name="isMonthPromotion"
                    checked={formData.isMonthPromotion}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isMonthPromotion" className="ml-2 text-sm text-gray-700">
                    Promoção do Mês
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700">
                    Produto em Destaque
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPaint"
                    name="isPaint"
                    checked={formData.isPaint}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPaint" className="ml-2 text-sm text-gray-700">
                    Produto tipo Tinta
                  </label>
                </div>
              </div>
            </div>
            
            {/* Imagens */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Imagens</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagens do Produto* (máximo 5 imagens)
                </label>
                
                <ImageUploader 
                  maxImages={5}
                  onImagesChange={handleImagesChange}
                  initialImages={[]}
                />
                
                {errors.images && (
                  <p className="text-red-500 text-sm mt-2">{errors.images}</p>
                )}
              </div>
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
            
            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 border-t pt-4">
              <button
                type="button"
                onClick={() => router.push('/admin/produtos')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isSaving && <Loader2 size={18} className="animate-spin mr-2" />}
                {isSaving ? 'Salvando...' : 'Salvar Produto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageLayout>
  );
} 