'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/data/types';

// Intervalo de tempo para mudar o banner automaticamente (em ms)
const AUTO_CHANGE_INTERVAL = 5000;

// Dados fallback para quando a API não estiver disponível
const FALLBACK_BANNERS: Banner[] = [
  {
    id: 'fallback-1',
    imageUrl: '/images/banners/banner-fallback-1.jpg',
    isactive: true,
    order: 1
  },
  {
    id: 'fallback-2',
    imageUrl: '/images/banners/banner-fallback-2.jpg',
    isactive: true,
    order: 2
  }
];

interface BannerCarouselProps {
  banners?: Banner[];
  height?: number;
}

export default function BannerCarousel({ banners = [], height = 400 }: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedBanners, setLoadedBanners] = useState<Banner[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  
  // Verificar o estado da conexão
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Definir estado inicial
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Buscar banners da API se não foram fornecidos como props
  useEffect(() => {
    if (banners.length > 0) {
      // Processar os banners para garantir URLs válidas
      const processedBanners = banners.map(banner => {
        if (!banner || !banner.imageUrl) return null;
        
        // Normalizar a URL da imagem
        let imageUrl = banner.imageUrl.trim();
        if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
          imageUrl = `https://${imageUrl}`;
        }
        
        return {
          ...banner,
          imageUrl
        };
      }).filter(Boolean) as Banner[];
      
      if (processedBanners.length > 0) {
        setLoadedBanners(processedBanners);
      } else {
        setLoadedBanners(FALLBACK_BANNERS);
      }
      setIsLoading(false);
      return;
    }

    async function fetchBanners() {
      try {
        // Se estiver offline, use os dados de fallback
        if (isOffline) {
          setLoadedBanners(FALLBACK_BANNERS);
          setIsLoading(false);
          return;
        }

        // Implementação de timeout para a requisição
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('/api/banners', {
          signal: controller.signal,
          next: { revalidate: 60 }, // Revalidar a cada 60 segundos
          cache: 'no-store'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar banners: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filtra banners para garantir que imageUrl não seja vazia e seja uma URL válida
        const validBanners = Array.isArray(data) ? data.filter(
          (banner: Banner) => 
            banner && 
            banner.imageUrl && 
            banner.imageUrl.trim() !== ''
        ) : [];
        
        if (validBanners.length > 0) {
          setLoadedBanners(validBanners);
        } else {
          setLoadedBanners(FALLBACK_BANNERS);
        }
      } catch (error) {
        // Em caso de erro, use os dados de fallback
        setLoadedBanners(FALLBACK_BANNERS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBanners();
  }, [banners, isOffline]);

  // Alternar para o próximo banner automaticamente
  useEffect(() => {
    if (loadedBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % loadedBanners.length);
    }, AUTO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [loadedBanners.length]);

  // Ir para o banner anterior
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? loadedBanners.length - 1 : prevIndex - 1
    );
  };

  // Ir para o próximo banner
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % loadedBanners.length
    );
  };

  // Ir diretamente para um banner específico
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div 
        className="bg-gray-200 animate-pulse rounded-lg w-full flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-400">Carregando banners...</p>
      </div>
    );
  }

  if (loadedBanners.length === 0) {
    return (
      <div 
        className="bg-gray-100 rounded-lg w-full flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500">Nenhum banner disponível</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
      {isOffline && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs z-10 rounded-bl">
          Modo offline
        </div>
      )}
      
      {/* Carrossel */}
      <div 
        className="w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)`, display: 'flex' }}
      >
        {loadedBanners.map((banner, index) => (
          <div 
            key={banner.id} 
            className="min-w-full h-full relative"
          >
            {banner.imageUrl && banner.imageUrl.trim() !== '' ? (
              <Image
                src={banner.imageUrl}
                alt={`Banner ${index + 1}`}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
                onError={(e) => {
                  // Fallback para imagem com erro
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/banners/banner-error.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Imagem não disponível</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Controles (apenas se houver mais de 1 banner) */}
      {loadedBanners.length > 1 && (
        <>
          {/* Botão anterior */}
          <button 
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Banner anterior"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          {/* Botão próximo */}
          <button 
            onClick={goToNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Próximo banner"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          
          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {loadedBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir para o banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}