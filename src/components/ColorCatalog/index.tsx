'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Color } from '@/types/Color';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftCircle, Info, FingerprintIcon, CopyIcon, PaintBucketIcon, X } from 'lucide-react';

interface ColorGroupProps {
  category: string;
  colors: Color[];
  onBuyClick: (color: Color) => void;
  isExpanded: boolean;
  onExpand: () => void;
  onClose: () => void;
}

// Descrições para cada categoria de cor
const categoryDescriptions: Record<string, { description: string, tags: string[] }> = {
  'Amarelos': {
    description: 'Tons amarelos terrosos inspirados em elementos naturais, perfeitos para criar ambientes acolhedores e revigorantes.',
    tags: ['Salas', 'Cozinhas', 'Móveis']
  },
  'Laranjas': {
    description: 'Tons quentes que transmitem energia e vitalidade, ideais para espaços que necessitam de mais dinamismo.',
    tags: ['Salas de Jantar', 'Áreas de Lazer', 'Detalhes']
  },
  'Vermelhos': {
    description: 'Cores intensas que adicionam personalidade e aconchego aos ambientes mais sofisticados.',
    tags: ['Quartos', 'Salas de Estar', 'Acentos']
  },
  'Verdes-amarelados': {
    description: 'Inspirados na natureza, estes tons trazem tranquilidade e conexão com o ambiente externo.',
    tags: ['Home Office', 'Varandas', 'Áreas de Convivência']
  },
  'Azuis e Verdes': {
    description: 'Combinação refrescante que evoca serenidade e leveza, perfeita para ambientes de descanso.',
    tags: ['Banheiros', 'Quartos', 'Espaços de Relaxamento']
  },
  // Fallback para categorias não mapeadas
  'default': {
    description: 'Cores cuidadosamente selecionadas para as tendências de 2025.',
    tags: ['Interiores', 'Decoração', 'Design']
  }
};

// Componente Modal de Detalhes da Cor
interface ColorDetailModalProps {
  color: Color | null;
  onClose: () => void;
}

const ColorDetailModal = ({ color, onClose }: ColorDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'info' | 'applications'>('info');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  
  if (!color) return null;
  
  // Converter hex para RGB
  const hex = color.hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  
  // Formatos de cores disponíveis
  const colorFormats = {
    HEX: color.hexColor,
    RGB: `rgb(${r}, ${g}, ${b})`,
    HSL: `hsl(${Math.round(rgbToHsl(r, g, b)[0] * 360)}, ${Math.round(rgbToHsl(r, g, b)[1] * 100)}%, ${Math.round(rgbToHsl(r, g, b)[2] * 100)}%)`,
    CMYK: rgbToCmyk(r, g, b)
  };
  
  // Converter RGB para HSL
  function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    return [h, s, l];
  }
  
  // Converter RGB para CMYK
  function rgbToCmyk(r: number, g: number, b: number): string {
    r = r / 255;
    g = g / 255;
    b = b / 255;
    
    const k = 1 - Math.max(r, g, b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);
    
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  }
  
  // Copiar formato para a área de transferência
  const copyFormat = (format: string, value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    });
  };
  
  // Adicionar evento de tecla Escape para fechar o modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden"
      >
        {/* Cabeçalho */}
        <div className="relative" style={{ backgroundColor: color.hexColor }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
          <div className="relative p-6 pt-12 pb-16">
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 text-white bg-black/20 p-1 rounded-full hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white text-xl font-bold shadow-text">{color.name}</h3>
            <p className="text-white/80 text-sm">{color.colorCode} • {color.ncsCode}</p>
          </div>
        </div>
        
        {/* Abas de navegação */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('info')}
            >
              Informações da Cor
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${activeTab === 'applications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('applications')}
            >
              Aplicações
            </button>
          </div>
        </div>
        
        {/* Conteúdo das abas */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          {activeTab === 'info' ? (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Códigos da Cor</h4>
                <div className="space-y-2">
                  {Object.entries(colorFormats).map(([format, value]) => (
                    <div 
                      key={format}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100"
                    >
                      <div>
                        <span className="text-xs text-gray-500">{format}</span>
                        <p className="text-sm font-mono">{value}</p>
                      </div>
                      <button
                        onClick={() => copyFormat(format, value)}
                        className="p-1.5 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                      >
                        <CopyIcon className="w-3.5 h-3.5 text-gray-700" />
                      </button>
                      
                      {/* Indicador de cópia */}
                      {copiedFormat === format && (
                        <span className="absolute right-10 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Copiado!
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Variações Tonais</h4>
                <div className="grid grid-cols-5 gap-2">
                  {[0.2, 0.4, 0.6, 0.8, 1].map((opacity) => (
                    <div
                      key={opacity}
                      className="flex flex-col items-center"
                    >
                      <div 
                        className="w-full aspect-square rounded-md mb-1"
                        style={{ 
                          backgroundColor: color.hexColor,
                          opacity: opacity
                        }}
                      ></div>
                      <span className="text-xs text-gray-500">{opacity * 100}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Esta cor é ideal para as seguintes aplicações:</p>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PaintBucketIcon className="w-4 h-4 text-blue-600" />
                    <h5 className="text-sm font-medium">Paredes</h5>
                  </div>
                  <p className="text-xs text-gray-600">Perfeita para criar um ambiente acolhedor em salas de estar, quartos ou espaços de refeição.</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PaintBucketIcon className="w-4 h-4 text-blue-600" />
                    <h5 className="text-sm font-medium">Móveis</h5>
                  </div>
                  <p className="text-xs text-gray-600">Ideal para peças de destaque como mesas, cadeiras ou armários que deseja realçar no ambiente.</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PaintBucketIcon className="w-4 h-4 text-blue-600" />
                    <h5 className="text-sm font-medium">Detalhes Decorativos</h5>
                  </div>
                  <p className="text-xs text-gray-600">Perfeita para almofadas, quadros, vasos e outros elementos que trazem personalidade ao ambiente.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Botão de ação */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ColorGroup = ({ category, colors, onBuyClick, isExpanded, onExpand, onClose }: ColorGroupProps) => {
  const router = useRouter();
  const previewColors = colors.slice(0, 2);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  // Obter descrição e tags para a categoria atual
  const categoryInfo = categoryDescriptions[category] || categoryDescriptions.default;

  const handleColorClick = (color: Color) => {
    router.push(`/cores/${color.colorCode}`);
  };

  // Função para copiar código hex para área de transferência
  const copyHexCode = (e: React.MouseEvent, hexCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hexCode).then(() => {
      setCopiedColor(hexCode);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  // Adicionar listener para a tecla ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isExpanded) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded, onClose]);

  return (
    <>
      <motion.div 
        layout
        className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
          isExpanded ? 'col-span-full row-span-2' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          scale: isExpanded ? 1.02 : 1
        }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          {/* Cabeçalho com nome da categoria */}
          <div 
            className={`p-4 bg-gray-50 flex justify-between items-center ${!isExpanded ? 'cursor-pointer hover:bg-gray-100' : ''} transition-colors`}
            onClick={!isExpanded ? onExpand : undefined}
          >
            <h3 className="text-2xl font-bold text-gray-800">{category}</h3>
            {!isExpanded && (
              <div className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                {colors.length} cores
              </div>
            )}
          </div>

          {!isExpanded ? (
            // Preview de duas cores quando não expandido
            <div className="flex flex-col">
              <div 
                className="grid grid-cols-2 gap-2 p-4 cursor-pointer"
                onClick={onExpand}
              >
                {previewColors.map((color) => (
                  <div
                    key={color.colorCode}
                    className="relative aspect-square rounded-lg shadow-md overflow-hidden group"
                    style={{ backgroundColor: color.hexColor }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent text-white">
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-xs opacity-60">{color.hexColor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Breve descrição na visualização compacta */}
              <div className="px-4 pb-4 text-sm text-gray-600 cursor-pointer" onClick={onExpand}>
                <p className="line-clamp-2">{categoryInfo.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {categoryInfo.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Visualização expandida com todas as cores
            <div>
              {/* Descrição da categoria */}
              <div className="border-b border-gray-100 p-4 bg-gray-50">
                <p className="text-gray-700 mb-3">{categoryInfo.description}</p>
                <div className="flex flex-wrap gap-2">
                  {categoryInfo.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Dica de navegação */}
              <div className="text-center py-3 text-sm text-gray-500 border-b border-gray-100">
                Pressione ESC ou clique em "Voltar ao Catálogo" para retornar
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {colors.map((color) => (
                    <motion.div
                      key={color.colorCode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05, zIndex: 1 }}
                      className="relative rounded-xl shadow-lg overflow-hidden group"
                    >
                      <div 
                        className="aspect-square cursor-pointer"
                        style={{ backgroundColor: color.hexColor }}
                        onClick={() => handleColorClick(color)}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => copyHexCode(e, color.hexColor)}
                              className="bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                              title="Copiar código hexadecimal"
                            >
                              <CopyIcon className="w-3.5 h-3.5 text-gray-700" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Informações da cor */}
                      <div className="bg-white p-3 border-t border-gray-100">
                        <p className="font-medium text-sm text-gray-900 mb-1">{color.name}</p>
                        <p className="text-xs text-gray-500 mb-2">{color.hexColor}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{color.colorCode}</span>
                          </div>
                          <button
                            onClick={() => handleColorClick(color)}
                            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          >
                            <span>Detalhes</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Indicador de cópia bem-sucedida */}
                      {copiedColor === color.hexColor && (
                        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-xs text-center py-1">
                          Copiado!
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Modal de detalhes da cor - Não utilizado mais, mantido para referência futura
      <AnimatePresence>
        {selectedColor && (
          <ColorDetailModal 
            color={selectedColor} 
            onClose={() => setSelectedColor(null)} 
          />
        )}
      </AnimatePresence>
      */}
    </>
  );
};

const ColorCatalog = ({ colors }: { colors: Color[] }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Agrupar cores por categoria
  const colorsByCategory = colors.reduce((acc, color) => {
    if (!acc[color.category]) {
      acc[color.category] = [];
    }
    acc[color.category].push(color);
    return acc;
  }, {} as Record<string, Color[]>);

  const handleClose = () => setExpandedCategory(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-4">
        <span className="text-blue-600">
          Paletas de 2025
        </span>
      </h2>
      
      {/* Subtítulo explicativo */}
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
        Tendências cromáticas para design de interiores em 2025, cuidadosamente selecionadas 
        para criar ambientes harmoniosos e contemporâneos.
      </p>
      
      {/* Instrução para dispositivos móveis */}
      <div className="block sm:hidden mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-800 shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FingerprintIcon className="w-4 h-4" />
          <span className="font-medium">Dica:</span>
        </div>
        Toque nas cores para ver informações detalhadas e copiar códigos hexadecimais
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {Object.entries(colorsByCategory).map(([category, categoryColors]) => (
            expandedCategory === null || expandedCategory === category ? (
              <ColorGroup
                key={category}
                category={category}
                colors={categoryColors}
                onBuyClick={(color) => console.log('Comprar cor:', color)}
                isExpanded={expandedCategory === category}
                onExpand={() => setExpandedCategory(category)}
                onClose={handleClose}
              />
            ) : null
          ))}
        </AnimatePresence>
      </div>

      {/* Botão flutuante para voltar ao catálogo */}
      <AnimatePresence>
        {expandedCategory && (
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
            exit={{ opacity: 0, y: 50 }}
            onClick={handleClose}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 group z-50"
            style={{
              boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
            }}
          >
            <ArrowLeftCircle className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Voltar ao Catálogo</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorCatalog; 