'use client';

import { useEffect, useState } from 'react';
import ColorCatalog from '@/components/ColorCatalog';
import type { Color as ColorCatalogType } from '@/types/Color';
import type { Color as SupabaseColorType, ColorCollection } from '@/data/types';

// Cores iniciais para fallback caso a API falhe
const fallbackColors: ColorCatalogType[] = [
  // Amarelos
  {
    id: '1',
    name: 'Doce de Figo',
    ncsCode: '6917-G81Y',
    colorCode: 'R727',
    rgbCode: '85,79,49',
    hexColor: '#554F31',
    category: 'Amarelos',
    collectionId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Granola Matinal',
    ncsCode: '5040-Y10R',
    colorCode: 'R728',
    rgbCode: '120,110,70',
    hexColor: '#786E46',
    category: 'Amarelos',
    collectionId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Despertar',
    ncsCode: '4030-Y20R',
    colorCode: 'R729',
    rgbCode: '180,160,100',
    hexColor: '#B4A064',
    category: 'Amarelos',
    collectionId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Selva de Cajueiro',
    ncsCode: '5020-Y30R',
    colorCode: 'R730',
    rgbCode: '150,130,80',
    hexColor: '#968250',
    category: 'Amarelos',
    collectionId: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Laranjas
  {
    id: '5',
    name: 'Folha de Tabaco',
    ncsCode: '6030-Y50R',
    colorCode: 'R731',
    rgbCode: '145,95,65',
    hexColor: '#915F41',
    category: 'Laranjas',
    collectionId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Lamparina',
    ncsCode: '4040-Y60R',
    colorCode: 'R732',
    rgbCode: '165,105,75',
    hexColor: '#A5694B',
    category: 'Laranjas',
    collectionId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Vira-lata Caramelo',
    ncsCode: '3050-Y70R',
    colorCode: 'R733',
    rgbCode: '185,115,85',
    hexColor: '#B97355',
    category: 'Laranjas',
    collectionId: '2',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Vermelhos
  {
    id: '8',
    name: 'Rosa-blush',
    ncsCode: '4030-R10B',
    colorCode: 'R734',
    rgbCode: '175,115,115',
    hexColor: '#AF7373',
    category: 'Vermelhos',
    collectionId: '3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'Telhado',
    ncsCode: '5040-R20B',
    colorCode: 'R735',
    rgbCode: '145,85,85',
    hexColor: '#915555',
    category: 'Vermelhos',
    collectionId: '3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    name: 'Marrom-luxo',
    ncsCode: '6050-R30B',
    colorCode: 'R736',
    rgbCode: '115,55,55',
    hexColor: '#733737',
    category: 'Vermelhos',
    collectionId: '3',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Verdes-amarelados
  {
    id: '11',
    name: 'Verde-serra',
    ncsCode: '7020-G30Y',
    colorCode: 'R737',
    rgbCode: '65,85,55',
    hexColor: '#415537',
    category: 'Verdes-amarelados',
    collectionId: '4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    name: 'Semente de Cardamomo',
    ncsCode: '6030-G40Y',
    colorCode: 'R738',
    rgbCode: '85,105,65',
    hexColor: '#556941',
    category: 'Verdes-amarelados',
    collectionId: '4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '13',
    name: 'Mercado de Coimbra',
    ncsCode: '5040-G50Y',
    colorCode: 'R739',
    rgbCode: '105,125,75',
    hexColor: '#697D4B',
    category: 'Verdes-amarelados',
    collectionId: '4',
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Azuis e Verdes
  {
    id: '14',
    name: 'Azul-mineral',
    ncsCode: '5030-B10G',
    colorCode: 'R740',
    rgbCode: '75,115,125',
    hexColor: '#4B737D',
    category: 'Azuis e Verdes',
    collectionId: '5',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '15',
    name: 'Sossego Noturno',
    ncsCode: '6020-B20G',
    colorCode: 'R741',
    rgbCode: '65,95,105',
    hexColor: '#415F69',
    category: 'Azuis e Verdes',
    collectionId: '5',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '16',
    name: 'Verde-serra',
    ncsCode: '7010-B30G',
    colorCode: 'R742',
    rgbCode: '55,75,85',
    hexColor: '#374B55',
    category: 'Azuis e Verdes',
    collectionId: '5',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Interface para os dados da API
interface ColorCollectionWithColors {
  collection: ColorCollection;
  colors: SupabaseColorType[];
}

export default function HomeColorSection() {
  const [colors, setColors] = useState<ColorCatalogType[]>(fallbackColors);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para buscar cores do banco de dados via API
    async function fetchColors() {
      try {
        setLoading(true);
        const response = await fetch('/api/colors');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar cores');
        }
        
        const collectionsData = await response.json() as ColorCollectionWithColors[];
        
        // Para cada coleção, converter suas cores para o formato esperado pelo ColorCatalog
        const allColors: ColorCatalogType[] = [];
        
        collectionsData.forEach(({ collection, colors }) => {
          // Para cada cor na coleção
          const formattedColors = colors.map(color => {
            // Obter o código hexadecimal do campo correto
            const hexcode = color.hexcode || '#CCCCCC';
            
            // Converter hex para RGB
            const hex = hexcode.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16) || 0;
            const g = parseInt(hex.substring(2, 4), 16) || 0;
            const b = parseInt(hex.substring(4, 6), 16) || 0;
            
            return {
              id: color.id,
              name: color.name,
              ncsCode: color.ncs || 'N/A',
              colorCode: color.id.substring(0, 5),
              rgbCode: `${r},${g},${b}`,
              hexColor: hexcode,
              category: collection.name,
              collectionId: collection.id,
              createdAt: new Date(),
              updatedAt: new Date()
            };
          });
          
          // Adicionar ao array principal
          allColors.push(...formattedColors);
        });
        
        if (allColors.length > 0) {
          setColors(allColors);
        }
      } catch (error) {
        console.error('Erro ao buscar cores:', error);
        // Manter as cores de fallback em caso de erro
      } finally {
        setLoading(false);
      }
    }
    
    fetchColors();
  }, []);

  // Mantém exatamente o mesmo componente visual
  return (
    <section className="py-12">
      <ColorCatalog colors={colors} />
    </section>
  );
} 