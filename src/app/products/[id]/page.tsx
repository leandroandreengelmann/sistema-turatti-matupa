'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductImage, Subcategory } from '@/data/types';
import { productService } from '@/services/productService';
import ContactSellerButtonClient from '@/components/ContactSellerButtonClient';
import { FaWhatsapp } from 'react-icons/fa';
import StoreSellerModal from '@/components/StoreSellerModal';
import ProductImageGallery from '@/components/ProductImageGallery';
import ProductDescription from '@/components/ProductDescription';

// Interface estendida para incluir campos adicionais
interface ExtendedProduct extends Omit<Product, 'ispromotion'> {
  stock?: number;
  details?: Record<string, string>;
  subcategory?: {
    name: string;
  };
  isPromotion?: boolean;
  ispromotion?: boolean;
  promoPrice?: number;
  originalprice?: number;
  discountPercentage?: number;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        
        // Tentar recuperar os dados do produto do localStorage primeiro
        if (typeof window !== 'undefined') {
          const storedProduct = localStorage.getItem('selectedProduct');
          if (storedProduct) {
            const parsedProduct = JSON.parse(storedProduct) as ExtendedProduct;
            // Verificar se o produto armazenado corresponde ao ID da URL
            if (parsedProduct.id === productId) {
              setProduct(parsedProduct);
              setError(null);
              setLoading(false);
              // Limpar o localStorage depois de usado para não interferir com futuras navegações
              localStorage.removeItem('selectedProduct');
              return;
            }
          }
        }
        
        // Se não conseguir recuperar do localStorage, buscar do banco
        const productData = await productService.getById(productId) as ExtendedProduct;
        
        // Normalizar os dados do produto
        if (productData) {
          const normalizedProduct = normalizeProductData(productData);
          setProduct(normalizedProduct);
          setError(null);
        } else {
          setError('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        setError('Não foi possível carregar o produto. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [productId]);
  
  // Função para normalizar os dados do produto
  const normalizeProductData = (productData: ExtendedProduct): ExtendedProduct => {
    // Verificar flags de promoção
    const isOnPromotion = productData.isPromotion || productData.ispromotion;
    
    // Calcular desconto se estiver em promoção e não tiver sido calculado
    let discountPercentage = productData.discountPercentage;
    
    if (isOnPromotion && !discountPercentage) {
      const originalPrice = productData.originalprice || productData.price;
      const promoPrice = productData.promoPrice || productData.price;
      
      if (originalPrice > promoPrice) {
        discountPercentage = Math.round(((originalPrice - promoPrice) / originalPrice) * 100);
      }
    }
    
    return {
      ...productData,
      // Garantir consistência nos campos que podem ter variações de nome
      isPromotion: isOnPromotion,
      ispromotion: isOnPromotion, 
      // Se tiver preço original e estiver em promoção, garantir que price e promoPrice estejam corretos
      price: isOnPromotion ? (productData.originalprice || productData.price) : productData.price,
      promoPrice: isOnPromotion ? (productData.promoPrice || productData.price) : undefined,
      originalprice: isOnPromotion ? (productData.originalprice || productData.price) : undefined,
      discountPercentage: discountPercentage
    };
  };
  
  // Função para formatar preço
  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Verifica se o produto está em promoção
  const isOnPromotion = product?.isPromotion || product?.ispromotion;
  
  // Obter o preço de exibição correto
  const displayPrice = isOnPromotion && product?.promoPrice 
    ? product.promoPrice 
    : product?.price;
  
  // Obter o preço original para exibição
  const originalPrice = isOnPromotion 
    ? (product?.originalprice || product?.price) 
    : undefined;
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro ao carregar produto</h2>
          <p className="text-red-700">{error || 'Produto não encontrado'}</p>
          <button 
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Voltar para produtos
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-4 md:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-6 flex items-center text-xs md:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-blue-600">
            Produtos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {product.name}
          </span>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Product Images - Left Side */}
            <div className="lg:col-span-7 p-3 md:p-6 md:border-r border-gray-100">
              {/* Usando nosso novo componente de galeria de imagens */}
              <ProductImageGallery 
                images={product.images} 
                productName={product.name} 
                discount={product.discountPercentage || 0}
              />
            </div>
            
            {/* Product Details - Right Side */}
            <div className="lg:col-span-5 p-4 md:p-6 border-t lg:border-t-0 border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
                
                {/* Badge de destaque */}
                {product.isfeatured && (
                  <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Destaque
                  </div>
                )}
              </div>
              
              {/* Marca do produto */}
              {product.brand && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Marca: </span>
                  <span className="text-sm font-medium text-gray-800">{product.brand}</span>
                </div>
              )}
              
              {/* Categoria/Subcategoria */}
              {product.subcategory && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Categoria: </span>
                  <span className="text-sm font-medium text-gray-800">{product.subcategory.name}</span>
                </div>
              )}
              
              {/* Código/SKU */}
              {product.sku && (
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Código: </span>
                  <span className="text-sm font-medium text-gray-800">{product.sku}</span>
                </div>
              )}
              
              <div className="mb-6 flex items-center">
                {/* Price display */}
                <div className="flex flex-col">
                  {/* Show promotional price if available */}
                  {isOnPromotion && originalPrice ? (
                    <>
                      <span className="text-blue-600 text-2xl md:text-3xl font-bold">
                        {formatPrice(displayPrice)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="line-through text-sm text-gray-500">
                          {formatPrice(originalPrice)}
                        </span>
                        {product.discountPercentage && product.discountPercentage > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg">
                            {product.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="text-blue-600 text-2xl md:text-3xl font-bold">
                        {formatPrice(displayPrice)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Detalhes técnicos */}
              {product.details && Object.keys(product.details).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 uppercase mb-2">Detalhes técnicos</h3>
                  <ul className="space-y-2">
                    {Object.entries(product.details).map(([key, value]) => (
                      <li key={key} className="flex">
                        <span className="text-sm text-gray-600 min-w-[120px]">{key}:</span>
                        <span className="text-sm font-medium text-gray-800">{value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Status de estoque */}
              {product.stock !== undefined && (
                <div className="mb-6">
                  {product.stock > 10 ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Em estoque
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      Restam apenas {product.stock} unidades
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      Fora de estoque
                    </span>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Precisa de ajuda?</h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-3 rounded-lg text-center transition duration-300 flex items-center justify-center flex-1 shadow-sm"
                  >
                    <FaWhatsapp className="mr-2 text-xl" />
                    Falar com vendedor
                  </button>
                  
                  <button 
                    onClick={() => router.push('/products')}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-3 rounded-lg text-center transition duration-300 flex items-center justify-center flex-1 shadow-sm"
                  >
                    Ver outros produtos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Description */}
        <ProductDescription 
          description={product.description || ''}
        />
        
        {/* Modal para contato via WhatsApp */}
        <StoreSellerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    </div>
  );
}
