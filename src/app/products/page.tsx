'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/data/types';
import { productService } from '@/services/productService';
import ProductsGrid from '@/components/ProductsGrid';

// Função para normalizar produtos em promoção
function normalizePromotionProduct(product: Product) {
  // Se já tiver campos de promoção definidos e originalprice for maior que price,
  // assumimos que os valores já estão corretos
  if (
    product.ispromotion && 
    product.originalprice && 
    product.originalprice > product.price
  ) {
    // Apenas garantir que temos as propriedades em camelCase também
    return {
      ...product,
      isPromotion: true,
      promoPrice: product.price,
      // Calcular o desconto com base nos preços atuais
      discountPercentage: Math.round(
        ((product.originalprice - product.price) / product.originalprice) * 100
      )
    };
  }
  
  // Caso esteja marcado como promoção mas não tenha os preços configurados corretamente
  if (product.ispromotion || product.ismonthpromotion) {
    // Guardar o preço original
    const originalPrice = product.originalprice || product.price;
    
    // Calcular preço promocional (20% de desconto como padrão)
    // A menos que já tenha sido especificado um desconto
    const discountPercentage = product.discountPercentage || 20;
    const discountMultiplier = (100 - discountPercentage) / 100;
    const promoPrice = Math.round(originalPrice * discountMultiplier);
    
    return {
      ...product,
      isPromotion: true,
      ispromotion: true,
      price: originalPrice,
      promoPrice: promoPrice,
      originalprice: originalPrice,
      discountPercentage: discountPercentage
    };
  }
  
  // Se não for promoção, apenas retornar o produto como está
  return product;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Verificar se devemos mostrar apenas promoções
  const promotionsOnly = searchParams?.promo === 'true';
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        let fetchedProducts;
        
        if (promotionsOnly) {
          fetchedProducts = await productService.getPromotions();
        } else {
          fetchedProducts = await productService.getAll();
        }
        
        // Processar produtos para normalizar dados de promoção
        const processedProducts = fetchedProducts.map(product => {
          if (product.ispromotion) {
            return normalizePromotionProduct(product);
          }
          return product;
        });
        
        setProducts(processedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [promotionsOnly]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {promotionsOnly ? 'Promoções' : 'Nossos Produtos'}
      </h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          {promotionsOnly
            ? 'Confira nossos produtos em promoção com preços imperdíveis!'
            : 'Explore nossa ampla seleção de materiais para construção de alta qualidade.'}
        </p>
      </div>
      
      <ProductsGrid products={products} />
    </div>
  );
}
