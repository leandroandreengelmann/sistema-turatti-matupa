'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/data/types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  autoplaySpeed?: number; // Tempo em ms para mudar slides automaticamente
}

export default function ProductCarousel({ 
  products, 
  title, 
  autoplaySpeed = 5000 // Valor padrão de 5 segundos
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth < 1280) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(5);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calcular o número total de páginas com base nos produtos reais
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalPages - 1 : prevIndex - 1
    );
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [totalPages, isTransitioning]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === totalPages - 1 ? 0 : prevIndex + 1
    );
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [totalPages, isTransitioning]);

  // Configura o autoplay
  useEffect(() => {
    // Funções para iniciar e parar o autoplay
    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
      
      autoplayTimerRef.current = setInterval(() => {
        if (!isPaused) {
          handleNext();
        }
      }, autoplaySpeed);
    };

    const stopAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };

    // Somente iniciar autoplay se houver mais de uma página
    if (totalPages > 1) {
      startAutoplay();
    }

    // Limpar quando o componente for desmontado
    return () => stopAutoplay();
  }, [handleNext, autoplaySpeed, isPaused, totalPages]);

  // Mobile touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    // Pausa temporariamente o autoplay quando o usuário inicia o toque
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Prevent multiple transitions
    if (isTransitioning) return;
    
    // Swipe left (next)
    if (diff > 50) {
      handleNext();
    }
    // Swipe right (prev)
    else if (diff < -50) {
      handlePrev();
    }

    // Retoma o autoplay após o toque
    setIsPaused(false);
  };

  // Pausar o autoplay quando o cursor estiver sobre o carrossel
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  // Retomar o autoplay quando o cursor sair do carrossel
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Set up keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Calculate translateX value based on current index and items per page
  const translateValue = -currentIndex * (100 / totalPages);

  return (
    <div className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-blue-600 mr-3"></div>
            <h2 className="text-2xl font-bold text-blue-600">
              {title}
            </h2>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handlePrev}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition duration-300"
              aria-label="Anterior"
              disabled={isTransitioning || totalPages <= 1}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
            
            <button 
              onClick={handleNext}
              className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition duration-300"
              aria-label="Próximo"
              disabled={isTransitioning || totalPages <= 1}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden relative">
          <div 
            ref={carouselRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{ 
              transform: `translateX(${translateValue}%)`,
              width: `${totalPages * 100}%` 
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {totalPages > 0 && Array.from({ length: totalPages }).map((_, pageIndex) => {
              const startIdx = pageIndex * itemsPerPage;
              const pageProducts = products.slice(startIdx, startIdx + itemsPerPage);
              
              return (
                <div 
                  key={`page-${pageIndex}`}
                  className="flex"
                  style={{ width: `${100 / totalPages}%` }}
                >
                  {pageProducts.map(product => (
                    <div 
                      key={product.id}
                      className="px-3"
                      style={{ width: `${100 / itemsPerPage}%` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isTransitioning) {
                    setIsTransitioning(true);
                    setCurrentIndex(index);
                    setTimeout(() => {
                      setIsTransitioning(false);
                    }, 300);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para página ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
