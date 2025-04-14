import Banner from '@/components/Banner';
import ProductCarousel from '@/components/ProductCarousel';
import HomeColorSection from '@/components/HomeColorSection';
import { productService } from '@/services/productService';
import { bannerService } from '@/services/bannerService';
import { TruckIcon, ShieldCheckIcon, HeadphonesIcon } from 'lucide-react';
import ContactSellerSection from '@/components/ContactSellerSection';
import { Product } from '@/data/types';

// Função para normalizar e preparar produtos promocionais
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

async function getData() {
  try {
    // Buscar dados em paralelo para melhor performance e tolerância a falhas
    const [
      monthPromotionsPromise,
      featuredProductsPromise, 
      bannersPromise,
      novidadesPromise
    ] = await Promise.allSettled([
      productService.getMonthPromotions(),
      productService.getFeatured(),
      fetchBanners().catch(error => {
        console.error('Erro ao buscar banners:', error);
        return [];
      }),
      productService.getNovidades()
    ]);
    
    // Extrair resultados com fallbacks para evitar quebras
    const monthPromotions = monthPromotionsPromise.status === 'fulfilled' 
      ? monthPromotionsPromise.value 
      : [];
      
    const featuredProducts = featuredProductsPromise.status === 'fulfilled' 
      ? featuredProductsPromise.value 
      : [];
      
    const banners = bannersPromise.status === 'fulfilled'
      ? bannersPromise.value
      : [];
      
    const novidades = novidadesPromise.status === 'fulfilled'
      ? novidadesPromise.value
      : [];
    
    return {
      monthPromotions,
      featuredProducts,
      banners,
      novidades
    };
  } catch (error) {
    console.error('Erro ao buscar dados da página inicial:', error);
    // Retornar valores padrão para evitar quebrar a página
    return {
      monthPromotions: [],
      featuredProducts: [],
      banners: [],
      novidades: []
    };
  }
}

// Função helper para buscar banners com tratamento de erros e timeout
async function fetchBanners() {
  try {
    // Implementar timeout para evitar que a página fique esperando indefinidamente
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const result = await bannerService.getActive();
    clearTimeout(timeoutId);
    
    return result;
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return []; // Retorna array vazio em caso de erro
  }
}

export default async function Home() {
  // Buscar dados do Supabase
  const { monthPromotions, featuredProducts, banners, novidades } = await getData();
  
  // Processar promoções do mês 
  const processedMonthPromotions = monthPromotions.map(product => 
    normalizePromotionProduct({
      ...product,
      ismonthpromotion: true // Garantir que esteja marcado como promoção do mês
    })
  );
  
  // Processar produtos em destaque
  const processedFeaturedProducts = featuredProducts.map(product => {
    // Se o produto estiver em promoção, normalizar os dados de promoção
    if (product.ispromotion) {
      return normalizePromotionProduct(product);
    }
    // Caso contrário, manter dados originais
    return product;
  });
  
  // Processar produtos novidades
  const processedNovidades = novidades.map(product => {
    // Se o produto estiver em promoção, normalizar os dados de promoção
    if (product.ispromotion) {
      return normalizePromotionProduct(product);
    }
    // Adicionar flag de novo produto
    return {
      ...product,
      isnew: true // Garantir que esteja marcado como novo
    };
  });
  
  return (
    <div className="min-h-screen">
      {/* Banner Carousel com todos os banners ativos */}
      <Banner banners={banners} height={480} />
      
      {/* Botão de contato com vendedor */}
      <ContactSellerSection />
      
      {/* Month Promotions Carousel - mostrar primeiro */}
      {processedMonthPromotions.length > 0 && (
        <ProductCarousel 
          products={processedMonthPromotions} 
          title="Promoções do Mês" 
          autoplaySpeed={6000}
        />
      )}

      {/* Catálogo de Cores 2025 */}
      <HomeColorSection />
      
      {/* Featured Products Carousel */}
      {processedFeaturedProducts.length > 0 && (
        <ProductCarousel 
          products={processedFeaturedProducts} 
          title="Produtos em Destaque" 
          autoplaySpeed={8000}
        />
      )}
      
      {/* Novidades Products Carousel */}
      {processedNovidades.length > 0 && (
        <ProductCarousel 
          products={processedNovidades} 
          title="Novidades" 
          autoplaySpeed={7000}
        />
      )}

      {/* Informações adicionais */}
      <section className="bg-gray-50 py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <TruckIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Envio Rápido</h3>
              <p className="text-gray-600 text-sm">Entregamos para todo o Brasil com rapidez e segurança.</p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <ShieldCheckIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Qualidade Garantida</h3>
              <p className="text-gray-600 text-sm">Produtos de alta qualidade com garantia de satisfação.</p>
            </div>
            
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
              <HeadphonesIcon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Suporte ao Cliente</h3>
              <p className="text-gray-600 text-sm">Atendimento personalizado para melhor atender suas necessidades.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
