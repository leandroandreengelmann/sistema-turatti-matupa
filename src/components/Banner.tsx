'use client';

import { useEffect, useState } from 'react';
import { Banner as BannerType } from '@/data/types';
import BannerCarousel from './BannerCarousel';

interface BannerProps {
  banners?: BannerType[];
  height?: number;
}

export default function Banner({ banners = [], height = 420 }: BannerProps) {
  const [loadedBanners, setLoadedBanners] = useState<BannerType[]>([]);
  const [isLoading, setIsLoading] = useState(banners.length === 0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Se os banners já foram fornecidos via props, verificamos e filtramos os inválidos
    if (banners.length > 0) {
      try {
        // Processar os banners para garantir URLs válidas
        const processedBanners = banners
          .filter(banner => banner && banner.imageUrl)
          .map(banner => {
            // Normalizar a URL da imagem
            let imageUrl = banner.imageUrl?.trim() || '';
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `https://${imageUrl}`;
            }
            
            return {
              ...banner,
              imageUrl
            };
          });
        
        if (processedBanners.length > 0) {
          setLoadedBanners(processedBanners);
          setHasError(false);
        } else {
          // Se não há banners válidos, considerar como um erro
          setHasError(true);
        }
      } catch (error) {
        console.error('Erro ao processar banners:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    // Caso contrário, eles serão buscados pelo BannerCarousel
  }, [banners]);

  return (
    <div className="w-full overflow-hidden relative">
      {hasError && (
        <div className="absolute top-2 right-2 z-20 bg-red-100 text-red-800 text-xs px-2 py-1 rounded shadow-sm">
          Erro ao carregar banners
        </div>
      )}
      
      <BannerCarousel
        banners={loadedBanners.length > 0 ? loadedBanners : undefined}
        height={height}
      />
    </div>
  );
}
