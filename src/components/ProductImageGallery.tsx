'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/data/types';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ProductImageGalleryProps {
  images: (ProductImage | string)[];
  productName: string;
  discount?: number;
}

export default function ProductImageGallery({ 
  images, 
  productName,
  discount = 0
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar dispositivos móveis
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkIfMobile();
    
    // Adicionar listener para redimensionamento
    window.addEventListener('resize', checkIfMobile);
    
    // Limpeza
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Processar todas as imagens do produto
  const getProcessedImages = () => {
    if (!images || images.length === 0) {
      return ['/placeholder-product.png'];
    }
    
    // Converter todas as imagens para um formato uniforme
    return images.map(image => {
      if (typeof image === 'string') {
        return image;
      }
      return (image as ProductImage).highResolution || 
             (image as ProductImage).standard || 
             '/placeholder-product.png';
    });
  };
  
  const productImages = getProcessedImages();
  
  // Funções de navegação do carrossel
  const goToPrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };
  
  const goToNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full">
      {/* Miniaturas verticais - só exibidas em desktop */}
      <div className="hidden md:flex md:flex-col gap-2 order-1 md:overflow-y-auto md:w-20 md:max-h-[450px] py-2">
        {productImages.map((image, index) => (
          <div 
            key={index}
            className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
              selectedImageIndex === index 
                ? 'border-blue-600 opacity-100' 
                : 'border-gray-200 opacity-80 hover:opacity-100 hover:border-blue-400'
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <div className="aspect-square relative">
              <Image
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 10vw"
                className="object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Imagem principal com botões de navegação */}
      <div className="order-1 md:order-2 flex-1 relative w-full aspect-square md:aspect-auto md:h-[450px] lg:h-[500px] bg-white rounded-lg overflow-hidden shadow-sm mb-4">
        {/* Badge de desconto */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 z-20 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-bold shadow-sm">
            {discount}% OFF
          </div>
        )}
        
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        )}
        
        {/* Wrapper para a imagem - sem padding para ocupar todo o espaço */}
        <div className="w-full h-full rounded-lg overflow-hidden">
          <Image
            src={productImages[selectedImageIndex]}
            alt={`${productName} - Imagem ${selectedImageIndex + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 70vw"
            className="object-cover rounded-lg"
            style={{ 
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            priority
            onLoadingComplete={() => setImageLoading(false)}
          />
        </div>
        
        {/* Botões de navegação para mobile (sempre visíveis em telas pequenas) */}
        {productImages.length > 1 && (
          <div className="md:hidden">
            <button 
              onClick={goToPrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2.5 z-10 focus:outline-none"
              aria-label="Imagem anterior"
            >
              <FiChevronLeft size={22} className="text-gray-800" />
            </button>
            <button 
              onClick={goToNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-2.5 z-10 focus:outline-none"
              aria-label="Próxima imagem"
            >
              <FiChevronRight size={22} className="text-gray-800" />
            </button>
          </div>
        )}
        
        {/* Indicadores de posição (pontos) - apenas em mobile */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 md:hidden">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  selectedImageIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 