import { NextResponse } from 'next/server';
import { colorService } from '@/services/colorService';
import { colorCollectionService } from '@/services/colorCollectionService';
import { Color, ColorCollection } from '@/data/types';

export async function GET() {
  try {
    // Buscar todas as coleções ativas
    const collections = await colorCollectionService.getActive();
    
    // Para cada coleção, buscar suas cores
    const result = await Promise.all(
      collections.map(async (collection) => {
        const colors = await colorService.getByCollectionId(collection.id);
        return {
          collection,
          colors
        };
      })
    );
    
    // Filtrar apenas coleções que têm cores
    const collectionsWithColors = result.filter(item => item.colors.length > 0);
    
    return NextResponse.json(collectionsWithColors);
  } catch (error) {
    console.error('Erro ao buscar coleções e cores:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar coleções e cores' },
      { status: 500 }
    );
  }
} 