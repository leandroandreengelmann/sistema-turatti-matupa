'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Palette, Copy } from 'lucide-react';

// Interface para o tipo de cor
interface Color {
  id: string;
  name: string;
  hexCode?: string;
  hexcode?: string;
  hex?: string;
  rgb?: string;
  ncs?: string;
  category?: string;
}

// Função para buscar a cor usando a API
const fetchColorFromAPI = async (colorCode: string): Promise<Color | null> => {
  try {
    const response = await fetch(`/api/colors/${colorCode}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log("Cor não encontrada na API");
        return null;
      }
      throw new Error(`Erro ao buscar cor: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Cor encontrada na API:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar cor da API:", error);
    return null;
  }
};

// Função para carregar os dados da cor
async function loadColorData(colorCode: string): Promise<Color | null> {
  try {
    // Tentar buscar da API primeiro
    const apiColor = await fetchColorFromAPI(colorCode);
    if (apiColor) {
      return apiColor;
    } else {
      // Usar os dados locais como fallback
      return await fetchColorLocally(colorCode);
    }
  } catch (error) {
    console.error("Erro ao carregar cor:", error);
    return null;
  }
}

// Componente de detalhes da cor
export default function ColorDetails({ params }: { params: { colorCode: string } }) {
  const router = useRouter();
  const colorCode = params.colorCode;
  const [color, setColor] = React.useState<Color | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchColor = async () => {
      try {
        const data = await loadColorData(colorCode);
        setColor(data);
      } catch (error) {
        console.error("Erro ao carregar cor:", error);
        setColor(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchColor();
  }, [colorCode]);

  const [copied, setCopied] = React.useState(false);
  
  // Copiar código hexadecimal para o clipboard
  const copyToClipboard = () => {
    if (!color) return;
    
    // Obter o código hex da cor, independente do formato armazenado
    const hexValue = color.hexCode || color.hexcode || color.hex || '';
    
    navigator.clipboard.writeText(hexValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <div className="text-xl text-gray-600 mb-4">Carregando...</div>
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!color) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
        <div className="text-xl text-gray-600 mb-4">Cor não encontrada</div>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar para a galeria
        </button>
      </div>
    );
  }
  
  // Obter o código hexadecimal da cor
  const hexColor = color.hexCode || color.hexcode || color.hex || '#CCCCCC';
  
  // Obter o código RGB
  const rgbCode = color.rgb || '';
  
  // Obter o código NCS
  const ncsCode = color.ncs || '';
  
  // Obter a categoria
  const category = color.category || 'Não categorizada';
  
  // Calcular uma cor mais clara para o fundo
  const bgColor = `${hexColor}10`; // 10% opacidade
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <div className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para a galeria
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-1/3">
              <div 
                className="aspect-square rounded-xl shadow-lg"
                style={{ backgroundColor: hexColor }}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">Código Hex:</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">{hexColor}</span>
                  <button 
                    onClick={copyToClipboard}
                    className="ml-2 p-1.5 rounded-full text-gray-500 hover:text-blue-500 hover:bg-gray-100 transition-colors"
                    title="Copiar código"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="ml-2 text-xs text-green-500">Copiado!</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {color.name}
              </h1>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {ncsCode && (
                  <div>
                    <p className="text-gray-500 text-sm">Código NCS</p>
                    <p className="font-medium">{ncsCode}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-500 text-sm">Código Ref.</p>
                  <p className="font-medium">{color.id}</p>
                </div>
                
                {rgbCode && (
                  <div>
                    <p className="text-gray-500 text-sm">RGB</p>
                    <p className="font-medium">{rgbCode}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-500 text-sm">Categoria</p>
                  <p className="font-medium">{category}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Sobre esta cor:</h3>
                <p className="text-gray-600">
                  {color.name} é uma cor {category.toLowerCase()} que combina elegância e sofisticação. 
                  Perfeita para ambientes que buscam transmitir personalidade e estilo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Função de fallback para buscar cor localmente
async function fetchColorLocally(colorCode: string): Promise<Color | null> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Cores disponíveis no catálogo
  const colors = [
    // Amarelos
    {
      id: 'R727',
      name: 'Doce de Figo',
      ncs: '6917-G81Y',
      rgb: '85,79,49',
      hex: '#554F31',
      category: 'Amarelos'
    },
    {
      id: 'R728',
      name: 'Granola Matinal',
      ncs: '5040-Y10R',
      rgb: '120,110,70',
      hex: '#786E46',
      category: 'Amarelos'
    },
    {
      id: 'R729',
      name: 'Despertar',
      ncs: '4030-Y20R',
      rgb: '180,160,100',
      hex: '#B4A064',
      category: 'Amarelos'
    },
    // Verdes-amarelados
    {
      id: 'R737',
      name: 'Verde-serra',
      ncs: '7020-G30Y',
      rgb: '65,85,55',
      hex: '#415537',
      category: 'Verdes-amarelados'
    },
    {
      id: 'R738',
      name: 'Semente de Cardamomo',
      ncs: '6030-G40Y',
      rgb: '85,105,65',
      hex: '#556941',
      category: 'Verdes-amarelados'
    },
    {
      id: 'R739',
      name: 'Mercado de Coimbra',
      ncs: '5040-G50Y',
      rgb: '105,125,75',
      hex: '#697D4B',
      category: 'Verdes-amarelados'
    },
    // Azuis e Verdes
    {
      id: 'R740',
      name: 'Azul-mineral',
      ncs: '5030-B10G',
      rgb: '75,115,125',
      hex: '#4B737D',
      category: 'Azuis e Verdes'
    },
    {
      id: 'R741',
      name: 'Sossego Noturno',
      ncs: '6020-B20G',
      rgb: '65,95,105',
      hex: '#415F69',
      category: 'Azuis e Verdes'
    },
    {
      id: 'R742',
      name: 'Verde-serra',
      ncs: '7010-B30G',
      rgb: '55,75,85',
      hex: '#374B55',
      category: 'Azuis e Verdes'
    },
    // Cores para demonstração
    {
      id: 'c3b75',
      name: 'Cor de Demonstração',
      ncs: 'DEMO-123',
      rgb: '80,100,120',
      hex: '#506478',
      category: 'Azuis e Verdes'
    },
    {
      id: '5b9b8',
      name: 'Cor de Exemplo',
      ncs: 'DEMO-456',
      rgb: '90,150,130',
      hex: '#5A9682',
      category: 'Verdes-amarelados'
    }
  ];
  
  const foundColor = colors.find(
    color => color.id.toLowerCase() === colorCode.toLowerCase()
  );
  
  return foundColor || null;
} 