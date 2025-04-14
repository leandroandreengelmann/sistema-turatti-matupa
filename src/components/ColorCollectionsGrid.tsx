'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ColorCollection, Color } from '@/data/types';
import { ChevronRight } from 'lucide-react';

type CollectionWithColors = ColorCollection & {
  colors: Color[];
};

export default function ColorCollectionsGrid() {
  const [collections, setCollections] = useState<CollectionWithColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar coleções e cores
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar coleções ativas
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('color_collections')
          .select('*')
          .eq('active', true)
          .order('name');
          
        if (collectionsError) throw collectionsError;
        
        if (!collectionsData || collectionsData.length === 0) {
          setCollections([]);
          setLoading(false);
          return;
        }
        
        // Para cada coleção, buscar suas cores
        const collectionsWithColors = await Promise.all(
          collectionsData.map(async (collection) => {
            const { data: colorsData, error: colorsError } = await supabase
              .from('colors')
              .select('*')
              .eq('collectionid', collection.id)
              .order('name');
              
            if (colorsError) {
              console.error(`Erro ao buscar cores da coleção ${collection.id}:`, colorsError);
              return {
                ...collection,
                colors: []
              };
            }
            
            return {
              ...collection,
              colors: colorsData || []
            };
          })
        );
        
        setCollections(collectionsWithColors);
      } catch (err) {
        console.error('Erro ao carregar coleções de cores:', err);
        setError('Não foi possível carregar as coleções de cores.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Renderiza um único quadrado de cor com as informações
  const renderColorSquare = (color: Color) => {
    // Usar diretamente o campo hexcode do banco que é padronizado
    let colorValue = '';
    let rgbDisplay = '';
    
    if (color && (color.hexcode || color.hex || color.hexCode)) {
      // Verificar se o hexcode já tem o prefixo # (como visto no banco de dados)
      // e usá-lo diretamente sem alterações
      const rawHexcode = color.hexcode || color.hex || color.hexCode;
      
      if (typeof rawHexcode === 'string') {
        colorValue = rawHexcode.startsWith('#') ? rawHexcode : `#${rawHexcode}`;
        
        // Para exibição do RGB, converter de hex para rgb
        const hex = colorValue.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) || 0;
        const g = parseInt(hex.substring(2, 4), 16) || 0;
        const b = parseInt(hex.substring(4, 6), 16) || 0;
        
        rgbDisplay = `${r}, ${g}, ${b}`;
      } else {
        console.warn(`Cor ${color.name}: Valor de hexcode não é uma string: ${rawHexcode}`);
        colorValue = '#cccccc';
        rgbDisplay = '204, 204, 204';
      }
    } else {
      console.warn(`Cor ${color.name}: Nenhum campo de código hexadecimal encontrado!`);
      colorValue = '#cccccc'; // Cinza padrão
      rgbDisplay = '204, 204, 204';
    }
    
    // NCS code
    const ncsCode = color.ncs || 'N/A';
    
    return (
      <div key={color.id} className="flex flex-col items-center">
        <div 
          className="h-24 w-24 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          style={{ backgroundColor: colorValue }}
          title={`${color.name}: ${colorValue}`}
        />
        <h4 className="mt-2 font-medium text-gray-800 text-center">{color.name}</h4>
        <div className="text-xs text-gray-500 text-center mt-1">
          <p>HEX: {colorValue}</p>
          <p>RGB: {rgbDisplay}</p>
          {ncsCode !== 'N/A' && <p>NCS: {ncsCode}</p>}
        </div>
        <div className="mt-2">
          <button 
            onClick={() => alert(`Detalhes da cor:\nNome: ${color.name}\nHEX: ${colorValue}\nRGB: ${rgbDisplay}\nNCS: ${ncsCode}`)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors"
          >
            VER
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Erro</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 text-blue-700">Outras Coleções de Cores</h2>
      
      <div className="space-y-20">
        {collections.map((collection) => (
          <div key={collection.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div 
              className="h-64 relative bg-cover bg-center"
              style={{ backgroundColor: collection.representativeColor || '#f3f4f6' }}
            >
              {collection.imageUrl && (
                <img 
                  src={collection.imageUrl} 
                  alt={collection.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Gradiente de sobreposição */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Título da coleção */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h2 className="text-3xl font-bold text-white mb-2">{collection.name}</h2>
                <p className="text-lg text-white/80">{collection.description}</p>
              </div>
            </div>
            
            {/* Cores da coleção */}
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Cores da coleção</h3>
              
              {collection.colors && collection.colors.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-6">
                  {collection.colors.map(renderColorSquare)}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhuma cor disponível para esta coleção.
                </p>
              )}
            </div>
            
            {/* Botão para mais detalhes */}
            <div className="px-8 pb-8 flex justify-end">
              <Link 
                href={`/collections/${collection.id}`}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <span className="font-medium">Ver detalhes da coleção</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 