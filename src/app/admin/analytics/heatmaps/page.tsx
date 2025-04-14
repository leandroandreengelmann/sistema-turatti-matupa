'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MousePointer, 
  Smartphone, 
  Monitor, 
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipo para os dados do heatmap
type HeatmapDataPoint = {
  x: number;
  y: number;
  value: number;
};

// Dados simulados para o heatmap
const generateMockHeatmapData = (device: string): HeatmapDataPoint[] => {
  const numPoints = device === 'desktop' ? 300 : 150;
  const width = device === 'desktop' ? 1920 : 375;
  const height = device === 'desktop' ? 1080 : 812;
  
  return Array.from({ length: numPoints }, () => {
    // Para desktop, concentrar mais cliques em menus e CTA
    let x, y;
    
    if (device === 'desktop') {
      // 40% dos cliques nos menus no topo
      if (Math.random() < 0.4) {
        x = Math.random() * width;
        y = Math.random() * 80;
      } 
      // 30% dos cliques em CTAs no meio
      else if (Math.random() < 0.7) {
        x = width / 2 + (Math.random() * 400 - 200);
        y = height / 2 + (Math.random() * 200 - 100);
      } 
      // Restante distribuído aleatoriamente
      else {
        x = Math.random() * width;
        y = Math.random() * height;
      }
    } else {
      // Para mobile, concentrar nos botões de menu e bottom nav
      if (Math.random() < 0.3) {
        // Menu superior
        x = Math.random() * width;
        y = Math.random() * 60;
      } 
      else if (Math.random() < 0.6) {
        // Navegação inferior
        x = Math.random() * width;
        y = height - (Math.random() * 60);
      } 
      else {
        // Resto da tela
        x = Math.random() * width;
        y = Math.random() * height;
      }
    }
    
    return {
      x: Math.round(x),
      y: Math.round(y),
      value: Math.floor(Math.random() * 10) + 1 // Intensidade de 1 a 10
    };
  });
};

// Componente do mapa de calor
function Heatmap({ 
  data, 
  width, 
  height 
}: { 
  data: HeatmapDataPoint[];
  width: number;
  height: number;
}) {
  return (
    <div className="relative bg-slate-900 rounded-lg overflow-hidden" style={{ width: '100%', height: '600px' }}>
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)`,
          backgroundSize: '100% 100%',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Pontos de calor */}
      {data.map((point, index) => {
        // Normalizar para o tamanho do container
        const x = (point.x / width) * 100;
        const y = (point.y / height) * 100;
        const size = point.value * 5; // Tamanho baseado no valor
        
        return (
          <div 
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(255,0,0,0.7) 0%, rgba(255,0,0,0) 70%)`,
              mixBlendMode: 'screen',
              opacity: point.value / 10
            }}
          />
        );
      })}
      
      {/* Wireframe do site */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="text-slate-500 text-opacity-30 w-full h-full flex flex-col">
          {/* Cabeçalho do site */}
          <div className="border border-slate-600 border-opacity-30 h-16 flex items-center px-4 mb-2">
            <div className="w-32 h-8 bg-slate-600 bg-opacity-30 rounded"></div>
            <div className="flex-1 flex justify-center space-x-4">
              <div className="w-20 h-4 bg-slate-600 bg-opacity-30 rounded"></div>
              <div className="w-20 h-4 bg-slate-600 bg-opacity-30 rounded"></div>
              <div className="w-20 h-4 bg-slate-600 bg-opacity-30 rounded"></div>
            </div>
            <div className="w-10 h-8 bg-slate-600 bg-opacity-30 rounded"></div>
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-1 flex flex-col">
            {/* Hero */}
            <div className="border border-slate-600 border-opacity-30 h-64 flex items-center justify-center mb-4">
              <div className="w-64 h-32 border border-slate-500 border-opacity-30 flex flex-col items-center justify-center">
                <div className="w-48 h-6 bg-slate-600 bg-opacity-30 rounded mb-4"></div>
                <div className="w-32 h-10 bg-slate-600 bg-opacity-30 rounded"></div>
              </div>
            </div>
            
            {/* Lista de produtos */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-slate-600 border-opacity-30 h-48 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-slate-600 bg-opacity-30 rounded-full mb-4"></div>
                  <div className="w-32 h-4 bg-slate-600 bg-opacity-30 rounded mb-2"></div>
                  <div className="w-20 h-4 bg-slate-600 bg-opacity-30 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border border-slate-600 border-opacity-30 h-32 flex items-center justify-center">
            <div className="w-full max-w-lg grid grid-cols-3 gap-4">
              <div>
                <div className="w-32 h-4 bg-slate-600 bg-opacity-30 rounded mb-2"></div>
                <div className="w-20 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-24 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-16 h-3 bg-slate-600 bg-opacity-30 rounded"></div>
              </div>
              <div>
                <div className="w-32 h-4 bg-slate-600 bg-opacity-30 rounded mb-2"></div>
                <div className="w-20 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-24 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-16 h-3 bg-slate-600 bg-opacity-30 rounded"></div>
              </div>
              <div>
                <div className="w-32 h-4 bg-slate-600 bg-opacity-30 rounded mb-2"></div>
                <div className="w-20 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-24 h-3 bg-slate-600 bg-opacity-30 rounded mb-1"></div>
                <div className="w-16 h-3 bg-slate-600 bg-opacity-30 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente seletor de dispositivo
function DeviceSelector({
  selectedDevice,
  onDeviceChange
}: {
  selectedDevice: string;
  onDeviceChange: (device: string) => void;
}) {
  return (
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => onDeviceChange('desktop')}
        className={cn(
          "flex items-center px-4 py-2 rounded-lg border",
          selectedDevice === 'desktop'
            ? "border-sky-500 bg-sky-50 text-sky-700"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        <Monitor className="w-5 h-5 mr-2" />
        Desktop
      </button>
      
      <button
        onClick={() => onDeviceChange('mobile')}
        className={cn(
          "flex items-center px-4 py-2 rounded-lg border",
          selectedDevice === 'mobile'
            ? "border-sky-500 bg-sky-50 text-sky-700"
            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        )}
      >
        <Smartphone className="w-5 h-5 mr-2" />
        Mobile
      </button>
    </div>
  );
}

// Componente seletor de página
function PageSelector({
  selectedPage,
  onPageChange
}: {
  selectedPage: string;
  onPageChange: (page: string) => void;
}) {
  const pages = [
    { value: 'home', label: 'Página Inicial' },
    { value: 'products', label: 'Lista de Produtos' },
    { value: 'collections', label: 'Coleções' },
    { value: 'product-detail', label: 'Detalhes do Produto' },
    { value: 'cart', label: 'Carrinho' }
  ];
  
  return (
    <div className="mb-6">
      <label htmlFor="page-select" className="block text-sm font-medium text-slate-700 mb-1">
        Página
      </label>
      <select
        id="page-select"
        value={selectedPage}
        onChange={e => onPageChange(e.target.value)}
        className="px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm w-full max-w-xs text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
      >
        {pages.map(page => (
          <option key={page.value} value={page.value}>
            {page.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function HeatmapsPage() {
  const [device, setDevice] = useState<string>('desktop');
  const [page, setPage] = useState<string>('home');
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Dimensões por dispositivo
  const dimensions = {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 375, height: 812 }
  };
  
  // Carregar dados do heatmap quando o dispositivo ou página mudar
  useEffect(() => {
    setLoading(true);
    
    // Simular carregamento
    const timer = setTimeout(() => {
      const newData = generateMockHeatmapData(device);
      setHeatmapData(newData);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [device, page]);

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center">
            <Link
              href="/admin/analytics"
              className="text-slate-600 hover:text-slate-800 mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Heatmaps</h1>
          </div>
          <p className="text-slate-500 mt-1">Visualização de cliques dos visitantes</p>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Configurações</h2>
        
        <DeviceSelector
          selectedDevice={device}
          onDeviceChange={setDevice}
        />
        
        <PageSelector
          selectedPage={page}
          onPageChange={setPage}
        />
        
        <div className="flex items-start space-x-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg mt-4">
          <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <p>
            Os dados exibidos são simulados para fins de demonstração. Em um ambiente de produção, os dados seriam coletados em tempo real a partir do comportamento real dos usuários no site.
          </p>
        </div>
      </div>
      
      {/* Visualização do heatmap */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          Heatmap para {page === 'home' ? 'Página Inicial' : page} ({device === 'desktop' ? 'Desktop' : 'Mobile'})
        </h2>
        
        {loading ? (
          <div className="animate-pulse h-96 bg-slate-200 rounded-lg"></div>
        ) : (
          <Heatmap 
            data={heatmapData} 
            width={dimensions[device as keyof typeof dimensions].width} 
            height={dimensions[device as keyof typeof dimensions].height}
          />
        )}
        
        <div className="mt-6 text-sm text-slate-500">
          <div className="flex items-center">
            <div className="h-4 w-16 bg-gradient-to-r from-blue-500 to-red-500 rounded mr-3"></div>
            <span>Menor intensidade para maior intensidade de cliques</span>
          </div>
        </div>
      </div>
      
      {/* Insights baseados nos dados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Insights</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-sky-50 rounded-lg border border-sky-100">
            <h3 className="font-medium text-sky-800 mb-2">Áreas de maior engajamento</h3>
            <p className="text-sky-700 text-sm">
              {device === 'desktop' 
                ? 'Os usuários de desktop estão clicando mais nos elementos de menu e nos botões de call-to-action centrais. Isso indica que a navegação está funcionando bem e os CTAs estão sendo eficazes.'
                : 'Os usuários mobile focam principalmente na navegação inferior e nos botões de menu. O conteúdo central recebe menos atenção comparado à versão desktop.'}
            </p>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h3 className="font-medium text-amber-800 mb-2">Oportunidades de melhoria</h3>
            <p className="text-amber-700 text-sm">
              {device === 'desktop'
                ? 'Há poucos cliques na seção inferior da página. Considere reavaliar o design ou conteúdo desta área para aumentar o engajamento.'
                : 'Os elementos no meio da tela recebem menos atenção em dispositivos móveis. Considere torná-los mais proeminentes ou reposicioná-los.'}
            </p>
          </div>
          
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <h3 className="font-medium text-emerald-800 mb-2">Recomendações</h3>
            <p className="text-emerald-700 text-sm">
              {device === 'desktop'
                ? 'Teste variações de layout que deem mais destaque às seções inferiores. Considere adicionar elementos visuais atrativos que incentivem a rolagem.'
                : 'Para mobile, priorize o conteúdo mais importante no topo da tela. Considere usar indicadores de rolagem para incentivar a exploração de todo o conteúdo.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 