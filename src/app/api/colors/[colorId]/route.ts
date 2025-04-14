import { NextRequest, NextResponse } from 'next/server';
import { colorService } from '@/services/colorService';
import { Color } from '@/data/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { colorId: string } }
) {
  try {
    const colorId = params.colorId;
    
    // Se o ID for um código hexadecimal, buscar por código
    if (colorId.startsWith('#')) {
      const colorsByHex = await colorService.getAll();
      const color = colorsByHex.find(c => c.hexcode?.toLowerCase() === colorId.toLowerCase() || 
                                      c.hex?.toLowerCase() === colorId.toLowerCase());
      
      if (color) {
        return NextResponse.json(color);
      }
    }
    
    // Buscar por ID primeiro
    let color: Color | null = await colorService.getById(colorId);
    
    // Se não encontrar, buscar todas as cores e filtrar
    if (!color) {
      const allColors = await colorService.getAll();
      
      // Tentar encontrar por correspondência exata em qualquer campo
      const exactMatch = allColors.find(c => 
        c.id === colorId || 
        c.hexcode === colorId || 
        c.hex === colorId || 
        c.rgb === colorId ||
        c.ncs === colorId
      );
      
      if (exactMatch) {
        color = exactMatch;
      } else {
        // Tentar correspondência parcial
        const partialMatch = allColors.find(c => 
          (c.id && c.id.includes(colorId)) || 
          (c.hexcode && c.hexcode.includes(colorId)) || 
          (c.hex && c.hex.includes(colorId)) || 
          (c.rgb && c.rgb.includes(colorId)) ||
          (c.ncs && c.ncs.includes(colorId))
        );
        
        if (partialMatch) {
          color = partialMatch;
        }
      }
    }
    
    if (color) {
      return NextResponse.json(color);
    }
    
    return NextResponse.json(
      { error: 'Cor não encontrada' },
      { status: 404 }
    );
  } catch (error) {
    console.error(`Erro ao buscar cor ${params.colorId}:`, error);
    return NextResponse.json(
      { error: 'Erro ao buscar cor' },
      { status: 500 }
    );
  }
} 