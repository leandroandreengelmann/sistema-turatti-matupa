import { NextRequest, NextResponse } from 'next/server';
import { bannerService } from '@/services/bannerService';
import { Banner } from '@/data/types';

// Função para normalizar URLs de imagens
function normalizeImageUrls(banners: Banner[]): Banner[] {
  return banners.map(banner => {
    if (!banner.imageUrl) return banner;
    
    let imageUrl = banner.imageUrl.trim();
    
    // Se a URL não começar com http(s) ou /, adicione https://
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = `https://${imageUrl}`;
    }
    
    // Retorna o banner com a URL normalizada
    return {
      ...banner,
      imageUrl
    };
  });
}

export async function GET(request: NextRequest) {
  // Adicionar cabeçalhos CORS e cache
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
  });

  // Resposta para requisições OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers });
  }
  
  try {
    // Buscar banners ativos
    const banners = await bannerService.getActive();
    
    // Log para debug
    console.log('Banners do serviço:', JSON.stringify(banners));
    
    // Garantir que banners é um array
    if (!Array.isArray(banners)) {
      console.error('Erro: banners não é um array', banners);
      return NextResponse.json([], { headers });
    }
    
    // Normalizar URLs de imagens (garantir que são https:// absolutos)
    const normalizedBanners = normalizeImageUrls(banners);
    
    // Log dos banners normalizados
    console.log('Banners normalizados:', JSON.stringify(normalizedBanners));
    
    // Adicionar cabeçalhos à resposta
    return NextResponse.json(normalizedBanners, { headers });
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar banners' },
      { status: 500, headers }
    );
  }
} 