"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product, Category, Subcategory, Color, ColorCollection } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import FormCheckbox from '@/components/FormCheckbox';
import { Package, X, Star } from 'lucide-react';
import { categoryService, subcategoryService } from '@/services/categoryService';
import { fetchColors, fetchColorCollections } from '@/services/colorService';

// Função simulada para buscar produto por ID
const fetchProductById = async (id: string): Promise<Product | null> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simula busca no banco de dados
  const products = [
    {
      id: "1",
      name: "Tinta Acrílica Premium",
      price: 159.90,
      originalPrice: 139.90,
      images: ["/images/produtos/tinta-premium.jpg"],
      description: "Tinta acrílica premium com alta cobertura e durabilidade",
      isPromotion: true,
      active: true,
      isNew: true,
      sellerName: "Loja Centro",
      slug: "tinta-acrilica-premium",
      isPaint: true,
      colorId: "c1",
      categoryId: "1",
      subcategoryId: "1"
    }
  ];
  
  return products.find(p => p.id === id) || null;
};

export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const errorRef = useRef<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const productId = searchParams.get('id');
  
  // Estados do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  const [active, setActive] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [isPaint, setIsPaint] = useState(false);
  const [colorId, setColorId] = useState('');
  
  // Estados para dados externos
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorCollections, setColorCollections] = useState<ColorCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  
  // Estado para imagens
  const [productImages, setProductImages] = useState<{
    file: File | null;
    preview: string;
    isMain: boolean;
  }[]>([
    { file: null, preview: '', isMain: true },
    { file: null, preview: '', isMain: false },
    { file: null, preview: '', isMain: false },
    { file: null, preview: '', isMain: false }
  ]);

  // Carregar dados necessários
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, subcategoriesData, colorsData, collectionsData] = await Promise.all([
          categoryService.getActive(),
          subcategoryService.getActive(),
          fetchColors(),
          fetchColorCollections()
        ]);
        
        setCategories(categoriesData);
        setAllSubcategories(subcategoriesData);
        setColors(colorsData);
        setColorCollections(collectionsData);

        // Se tiver ID, carregar dados do produto
        if (productId) {
          const product = await fetchProductById(productId);
          if (product) {
            setCurrentProduct(product);
            setName(product.name);
            setPrice(product.price);
            setOriginalPrice(product.originalPrice || 0);
            setDescription(product.description);
            setIsPromotion(product.isPromotion);
            setActive(product.active);
            setIsNew(product.isNew);
            setCategoryId(product.categoryId || '');
            setSubcategoryId(product.subcategoryId || '');
            setIsPaint(product.isPaint || false);
            setColorId(product.colorId || '');

            // Configurar imagens
            if (product.images?.length) {
              const imageUrls = product.images.filter((img): img is string => typeof img === 'string');
              setProductImages(prev => {
                const newImages = [...prev];
                imageUrls.forEach((url, index) => {
                  if (index < newImages.length) {
                    newImages[index] = {
                      file: null,
                      preview: url,
                      isMain: index === 0
                    };
                  }
                });
                return newImages;
              });
            }

            // Configurar coleção se for tinta
            if (product.isPaint && product.colorId) {
              const color = colorsData.find((c: Color) => c.id === product.colorId);
              if (color) {
                setSelectedCollectionId(color.collectionId);
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        errorRef.current = error as Error;
      }
    };

    loadData();
  }, []); // Remover showToast das dependências

  // Mostrar erro se houver
  useEffect(() => {
    if (errorRef.current) {
      showToast('Erro ao carregar dados', 'error');
      errorRef.current = null;
    }
  }, [showToast]);

  // Atualizar subcategorias quando categoria mudar
  useEffect(() => {
    if (categoryId) {
      const filtered = allSubcategories.filter(
        subcategory => subcategory.categoryId === categoryId
      );
      setAvailableSubcategories(filtered);
      
      if (!filtered.some(sub => sub.id === subcategoryId)) {
        setSubcategoryId('');
      }
    } else {
      setAvailableSubcategories([]);
      setSubcategoryId('');
    }
  }, [categoryId, allSubcategories, subcategoryId]);

  // Gerenciar upload de imagem
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showToast('Por favor, selecione uma imagem válida', 'error');
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    
    setProductImages(prev => {
      const newImagesState = [...prev];
      newImagesState[index] = {
        file,
        preview: previewUrl,
        isMain: prev[index].isMain
      };
      return newImagesState;
    });
  };
  
  // Definir imagem principal
  const handleSetMainImage = (index: number) => {
    setProductImages(prev => {
      return prev.map((img, i) => ({
        ...img,
        isMain: i === index
      }));
    });
  };
  
  // Remover imagem
  const handleRemoveImage = (index: number) => {
    setProductImages(prev => {
      const newImagesState = [...prev];
      newImagesState[index] = { file: null, preview: '', isMain: false };
      
      if (prev[index].isMain) {
        const firstValidImageIndex = newImagesState.findIndex(img => img.preview !== '');
        if (firstValidImageIndex >= 0) {
          newImagesState[firstValidImageIndex].isMain = true;
        }
      }
      
      return newImagesState;
    });
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (!name || !price || !description || !categoryId) {
        showToast('Por favor, preencha todos os campos obrigatórios', 'error');
        return;
      }

      if (isPaint && !colorId) {
        showToast('Por favor, selecione uma cor para a tinta', 'error');
        return;
      }
      
      // Preparar dados do produto
      const productData: Partial<Product> = {
        name,
        price,
        originalPrice: isPromotion ? originalPrice : undefined,
        description,
        isPromotion,
        active,
        isNew,
        categoryId,
        subcategoryId: subcategoryId || undefined,
        isPaint,
        colorId: isPaint ? colorId : undefined,
        sellerName: currentProduct?.sellerName || "Loja Centro",
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      };
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('Produto salvo com sucesso!', 'success');
      router.push('/admin/products');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      showToast('Erro ao salvar produto', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminPageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {currentProduct ? 'Editar Produto' : 'Novo Produto'}
          </h1>
          <div className="text-sm">
            <Link href="/admin/products" className="text-blue-600 hover:text-blue-800">
              ← Voltar para Produtos
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos do formulário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                id="product-name"
                label="Nome do Produto"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <FormInput
                id="product-price"
                label="Preço"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                step={0.01}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isPromotion && (
                <FormInput
                  id="product-original-price"
                  label="Preço Original"
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  step={0.01}
                />
              )}
              <div className="flex flex-wrap gap-4">
                <FormCheckbox
                  id="is-promotion"
                  label="Em Promoção"
                  checked={isPromotion}
                  onChange={(e) => setIsPromotion(e.target.checked)}
                />
                <FormCheckbox
                  id="is-active"
                  label="Ativo"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                />
                <FormCheckbox
                  id="is-new"
                  label="Novidade"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
              </div>
            </div>

            <FormInput
              id="product-description"
              label="Descrição"
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormSelect
                id="category"
                label="Categoria"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={categories.map(cat => ({ id: cat.id, name: cat.name }))}
                placeholder="Selecione uma categoria"
                required
              />

              <FormSelect
                id="subcategory"
                label="Subcategoria"
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                options={availableSubcategories.map(sub => ({ id: sub.id, name: sub.name }))}
                placeholder="Selecione uma subcategoria"
                disabled={!categoryId}
              />
            </div>

            <div className="space-y-4">
              <FormCheckbox
                id="is-paint"
                label="Este produto é uma tinta"
                checked={isPaint}
                onChange={(e) => setIsPaint(e.target.checked)}
              />

              {isPaint && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormSelect
                    id="color-collection"
                    label="Coleção de Cores"
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    options={colorCollections.map(col => ({ id: col.id, name: col.name }))}
                    placeholder="Selecione uma coleção"
                  />

                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                      Cor
                      {isPaint && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <div className="relative flex items-center">
                      {colorId && (
                        <div 
                          className="absolute left-3 w-6 h-6 rounded-full border border-gray-300" 
                          style={{ 
                            backgroundColor: colors.find(c => c.id === colorId)?.hex || 'transparent' 
                          }}
                        />
                      )}
                      <select
                        id="color"
                        value={colorId}
                        onChange={(e) => setColorId(e.target.value)}
                        disabled={!selectedCollectionId}
                        className={`px-3 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none ${colorId ? 'pl-12' : ''}`}
                      >
                        <option value="">Selecione uma cor</option>
                        {colors
                          .filter(color => color.collectionId === selectedCollectionId)
                          .map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.name}
                            </option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute right-0 flex items-center px-3">
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative">
                  <div className="aspect-w-1 aspect-h-1 w-full">
                    {image.preview ? (
                      <div className="relative h-40">
                        <Image
                          src={image.preview}
                          alt={`Imagem ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {!image.isMain && (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(index)}
                            className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-sm text-gray-600">
                            <label
                              htmlFor={`image-${index}`}
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload</span>
                              <input
                                id={`image-${index}`}
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                        </div>
                      </label>
                    )}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-2 -left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                      Principal
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href="/admin/products"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Salvando...</span>
                  </span>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminPageLayout>
  );
} 