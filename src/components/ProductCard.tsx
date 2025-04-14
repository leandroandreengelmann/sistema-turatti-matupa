'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, ProductImage, Subcategory } from '@/data/types';

interface ProductCardProps {
  product: Product & {
    isPromotion?: boolean;
    promoPrice?: number;
    size?: string;
    stock?: number;
    subcategory?: {
      name: string;
    };
    details?: {
      [key: string]: string;
    };
    rating?: number;
    reviewCount?: number;
    discountPercentage?: number;
    isfeatured?: boolean;
    isnew?: boolean;
    ismonthpromotion?: boolean;
    originalprice?: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Verificar se o dispositivo é mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar no carregamento inicial
    checkIfMobile();
    
    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkIfMobile);
    
    // Remover listener quando o componente for desmontado
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Processar as imagens do produto
  const processedImages = product.images && product.images.length > 0
    ? product.images.map(img => 
        typeof img === 'string' 
          ? img 
          : (img as ProductImage).standard
      )
    : ['/placeholder-product.jpg'];
  
  // Avançar para a próxima imagem
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === processedImages.length - 1 ? 0 : prev + 1
    );
  };
  
  // Voltar para a imagem anterior
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? processedImages.length - 1 : prev - 1
    );
  };
  
  // Formatar preço para exibição
  const formatPrice = (price?: number) => {
    if (!price && price !== 0) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };
  
  // Calcular desconto percentual (se aplicável)
  const calculateDiscount = () => {
    // Verificar todas as flags possíveis de promoção
    const isOnPromotion = product.isPromotion || product.ispromotion;
    
    if (!isOnPromotion) return 0;
    
    // Se o desconto já estiver calculado, usá-lo
    if (product.discountPercentage) return product.discountPercentage;
    
    // Verificar qual preço usar para o cálculo
    const originalPrice = product.originalprice || product.price;
    const discountedPrice = product.promoPrice || product.price;
    
    // Apenas calcular se tivermos preços válidos
    if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) return 0;
    
    // Calcular o desconto como porcentagem
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };
  
  // Calcular e armazenar o desconto
  const discountPercentage = calculateDiscount();
  
  // Navegar para a página do produto
  const handleClick = () => {
    // Normalizar as propriedades antes de salvar
    const normalizedProduct = {
      ...product,
      // Garantir consistência nos campos que podem ter variações de nome
      isPromotion: product.isPromotion || product.ispromotion || false,
      ispromotion: product.isPromotion || product.ispromotion || false,
      discountPercentage: discountPercentage,
      // Se tiver preço original, garante que seja usado
      price: product.originalprice || product.price,
      promoPrice: product.promoPrice || (product.ispromotion ? product.price : undefined),
      // Outros campos que possam precisar de normalização
      isfeatured: product.isfeatured || false,
      isnew: product.isnew || false,
      ismonthpromotion: product.ismonthpromotion || false
    };
    
    // Salvar os dados normalizados no localStorage antes de navegar
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedProduct', JSON.stringify(normalizedProduct));
    }
    router.push(`/products/${product.id}`);
  };
  
  // Obter a imagem a ser exibida
  const displayImage = isMobile 
    ? processedImages[currentImageIndex]
    : isHovered && processedImages.length > 1 
      ? processedImages[1] 
      : processedImages[0];
      
  // Renderizar estrelas de avaliação
  const renderRatingStars = () => {
    if (!product.rating) return null;
    
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center mt-1">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {product.reviewCount && (
          <span className="ml-1 text-xs text-gray-500">
            ({product.reviewCount})
          </span>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-opacity-17 border-gray-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="aspect-square overflow-hidden relative cursor-pointer"
        onClick={handleClick}
      >
        {(product.isPromotion || product.ispromotion) && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Grupo de badges no lado direito - organizados em coluna */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          {/* Badge de destaque */}
          {product.isfeatured && (
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Destaque</span>
            </div>
          )}

          {/* Badge de Novidade */}
          {product.isnew && (
            <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Novo</span>
            </div>
          )}

          {/* Badge de Promoção do Mês */}
          {product.ismonthpromotion && (
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Promo do Mês</span>
            </div>
          )}
        </div>
        
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-300 group-hover:scale-105"
        />
        
        {/* Carrossel Mobile - Botões de navegação */}
        {isMobile && processedImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -mt-5 bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 shadow-md z-20"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -mt-5 bg-white bg-opacity-70 rounded-full w-10 h-10 flex items-center justify-center text-gray-800 shadow-md z-20"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Indicadores de progresso do carrossel */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-20">
              {processedImages.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full ${idx === currentImageIndex ? 'w-4 bg-blue-600' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
          </>
        )}
        
        {/* Botão Ver produto no hover (apenas desktop) */}
        {!isMobile && (
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`}>
            <button 
              onClick={handleClick}
              className="bg-white text-gray-900 font-medium px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Ver produto
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        {/* Informação de marca */}
        {product.brand && (
          <span className="text-xs text-gray-600 uppercase font-medium mb-1">
            {product.brand}
          </span>
        )}
        
        <h3 className="text-sm text-gray-700 font-medium line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={handleClick}>
          {product.name}
        </h3>
        
        {/* Avaliações */}
        {renderRatingStars()}
        
        {/* Categoria e tamanho do produto */}
        <div className="mt-1 mb-2">
          {product.subcategory && (
            <span className="text-xs text-gray-500 block truncate">
              {product.subcategory.name}
            </span>
          )}
          
          {product.size && (
            <span className="text-xs text-gray-500">
              Tamanho: {product.size}
            </span>
          )}
        </div>
        
        {/* Preços */}
        <div className="mt-auto">
          <div className="flex items-end">
            {(product.isPromotion || product.ispromotion) ? (
              <>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.promoPrice || product.price)}
                </span>
                <span className="text-xs line-through text-gray-500 ml-2">
                  {formatPrice(product.originalprice || product.price * (100 / (100 - discountPercentage)))}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
        
        {/* Status de estoque */}
        {product.stock !== undefined && (
          <div className="mt-2">
            {product.stock > 10 ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-green-700">Em estoque</span>
              </div>
            ) : product.stock > 0 ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div>
                <span className="text-xs text-orange-700">Estoque baixo - {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <span className="text-xs text-red-700">Sem estoque</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
