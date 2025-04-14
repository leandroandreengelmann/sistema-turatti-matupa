'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, MapPin, Clock, 
  BarChart3, Smartphone, Layers, Eye
} from 'lucide-react';
import { analyticsService } from '@/services/localDataService';
import { cn } from '@/lib/utils';

// Tipo para dados de cidade
type CityData = {
  city: string;
  count: number;
  percentage: number;
};

// Componente para exibir as estatísticas de uma cidade selecionada
function CityDetail({
  selectedCity,
  startDate,
  endDate,
  onBack
}: {
  selectedCity: string;
  startDate: string;
  endDate: string;
  onBack: () => void;
}) {
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [pageViewsData, setPageViewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCityDetails = async () => {
      setLoading(true);
      try {
        const devices = await analyticsService.getDevicesByMatoGrossoCity(selectedCity, startDate, endDate);
        const pageViews = await analyticsService.getPageViewsByMatoGrossoCity(selectedCity, startDate, endDate);
        
        setDeviceData(devices);
        setPageViewsData(pageViews);
      } catch (error) {
        console.error('Erro ao carregar detalhes da cidade:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCityDetails();
  }, [selectedCity, startDate, endDate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-56"></div>
        <div className="h-64 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onBack}
          className="p-2 rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">Detalhes: {selectedCity}</h2>
      </div>

      {/* Dispositivos usados na cidade */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-md font-medium text-slate-700 mb-4 flex items-center">
          <Smartphone className="w-4 h-4 mr-2 text-slate-500" />
          Dispositivos utilizados em {selectedCity}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deviceData.map((device, index) => (
            <div key={index} className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-slate-700 capitalize">{device.device}</span>
                <span className="text-lg font-semibold text-sky-600">{device.percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  className="bg-sky-500 h-2.5 rounded-full" 
                  style={{ width: `${device.percentage}%` }} 
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{device.count} visitantes</p>
            </div>
          ))}
        </div>
      </div>

      {/* Páginas mais visitadas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-md font-medium text-slate-700 mb-4 flex items-center">
          <Layers className="w-4 h-4 mr-2 text-slate-500" />
          Páginas mais visitadas por usuários de {selectedCity}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Página
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Visualizações
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Taxa de Rejeição
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {pageViewsData.map((page, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {page.page}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {page.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {Math.floor(page.avgTimeOnPage / 60)}m {Math.floor(page.avgTimeOnPage % 60)}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <span className={page.bounceRate > 50 ? 'text-rose-600' : 'text-emerald-600'}>
                      {page.bounceRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente para o mapa simples do Mato Grosso com cidades
function MatoGrossoMap({ 
  cityData, 
  onCitySelect 
}: { 
  cityData: CityData[];
  onCitySelect: (city: string) => void;
}) {
  // Simular posições relativas das cidades principais no mapa do Mato Grosso
  // Estas são posições aproximadas para um mapa estilizado
  const cityPositions: {[key: string]: {x: number, y: number}} = {
    'Cuiabá': {x: 50, y: 60},
    'Várzea Grande': {x: 48, y: 60},
    'Rondonópolis': {x: 65, y: 75},
    'Sinop': {x: 50, y: 20},
    'Tangará da Serra': {x: 30, y: 45},
    'Cáceres': {x: 20, y: 65},
    'Sorriso': {x: 45, y: 25},
    'Lucas do Rio Verde': {x: 42, y: 30},
    'Primavera do Leste': {x: 70, y: 65},
    'Barra do Garças': {x: 85, y: 55},
    'Alta Floresta': {x: 35, y: 5},
    'Nova Mutum': {x: 45, y: 40},
    'Campo Verde': {x: 65, y: 60},
    'Pontes e Lacerda': {x: 10, y: 55},
    'Juína': {x: 15, y: 20},
    'Colíder': {x: 45, y: 15},
    'Guarantã do Norte': {x: 48, y: 8},
    'Juara': {x: 25, y: 25},
    'Peixoto de Azevedo': {x: 55, y: 10},
    'Poconé': {x: 40, y: 70}
  };
  
  // Função para determinar o tamanho do círculo com base na porcentagem
  const getCircleSize = (percentage: number) => {
    const minSize = 8;
    const maxSize = 20;
    return minSize + (percentage / 100) * (maxSize - minSize);
  };
  
  // Função para determinar a cor do círculo com base na porcentagem
  const getCircleColor = (percentage: number) => {
    if (percentage > 15) return 'bg-emerald-600';
    if (percentage > 10) return 'bg-emerald-500';
    if (percentage > 5) return 'bg-emerald-400';
    return 'bg-emerald-300';
  };

  return (
    <div className="relative bg-slate-100 rounded-xl overflow-hidden h-[500px] w-full">
      {/* Contorno simplificado do Mato Grosso */}
      <svg 
        viewBox="0 0 100 100" 
        className="absolute inset-0 w-full h-full text-slate-200 stroke-slate-300 fill-slate-200"
      >
        <path d="M10,20 Q25,5 45,15 Q65,15 80,25 Q90,35 85,55 Q80,75 70,85 Q50,90 30,80 Q15,70 10,50 Q5,35 10,20" 
          strokeWidth="0.5"
        />
      </svg>
      
      {/* Pontos das cidades */}
      {cityData.map((city, index) => {
        const position = cityPositions[city.city];
        if (!position) return null; // Skip if position is not defined
        
        const size = getCircleSize(city.percentage);
        const colorClass = getCircleColor(city.percentage);
        
        return (
          <div 
            key={index}
            className={cn(
              "absolute rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",
              colorClass
            )}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              width: `${size}px`,
              height: `${size}px`,
              transition: 'all 0.3s ease'
            }}
            onClick={() => onCitySelect(city.city)}
            title={`${city.city}: ${city.percentage.toFixed(1)}% dos visitantes`}
          >
            <span className="sr-only">{city.city}</span>
          </div>
        );
      })}
      
      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg shadow-sm">
        <div className="text-xs font-medium text-slate-700 mb-2">Legenda</div>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-300 mr-2"></div>
            <span className="text-xs text-slate-600">{'< 5%'} dos visitantes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div>
            <span className="text-xs text-slate-600">5-10% dos visitantes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className="text-xs text-slate-600">10-15% dos visitantes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-600 mr-2"></div>
            <span className="text-xs text-slate-600">{'>15%'} dos visitantes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para o filtro de datas
function DateFilter({
  startDate, 
  setStartDate, 
  endDate, 
  setEndDate, 
  onFilterChange
}: {
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onFilterChange: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="flex flex-col">
        <label htmlFor="start-date" className="text-sm font-medium text-slate-700 mb-1">Data inicial</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      
      <div className="flex flex-col">
        <label htmlFor="end-date" className="text-sm font-medium text-slate-700 mb-1">Data final</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
      
      <button
        onClick={onFilterChange}
        className="px-4 py-2 bg-sky-500 text-white font-medium rounded-md shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 flex items-center"
      >
        <BarChart3 className="w-4 h-4 mr-2" />
        Atualizar
      </button>
    </div>
  );
}

// Componente principal da página
export default function MatoGrossoCityAnalyticsPage() {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  // Estados para filtro de data
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  // Função para carregar os dados
  const loadCityData = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getMatoGrossoCityData(startDate, endDate);
      setCityData(data);
      setSelectedCity(null); // Limpar seleção quando filtros mudam
    } catch (error) {
      console.error('Erro ao carregar dados de cidades:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem inicial
  useEffect(() => {
    loadCityData();
  }, []);
  
  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div>
        <div className="flex items-center mb-2">
          <Link
            href="/admin/analytics"
            className="text-slate-600 hover:text-slate-800 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Análise por Cidades do Mato Grosso</h1>
        </div>
        <p className="text-slate-500">Visualize métricas detalhadas por cidade do estado de Mato Grosso</p>
      </div>
      
      {/* Filtro de datas */}
      <DateFilter 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onFilterChange={loadCityData}
      />
      
      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-[500px] bg-slate-200 rounded-xl"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      ) : (
        <>
          {!selectedCity ? (
            <>
              {/* Visualização do mapa e dados gerais */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Distribuição de visitantes por cidade em Mato Grosso</h2>
                
                <div className="mb-6">
                  <MatoGrossoMap 
                    cityData={cityData} 
                    onCitySelect={(city) => setSelectedCity(city)} 
                  />
                </div>
                
                <p className="text-sm text-slate-500 italic">
                  Clique em uma cidade no mapa para ver detalhes.
                </p>
              </div>
              
              {/* Tabela de todas as cidades */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Ranking de cidades do Mato Grosso</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Cidade
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Visitantes
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Percentual
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {cityData.map((city, index) => (
                        <tr key={index} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-slate-400 mr-2" />
                              {city.city}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {city.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {city.percentage.toFixed(1)}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <button
                              onClick={() => setSelectedCity(city.city)}
                              className="text-sky-600 hover:text-sky-800 font-medium"
                            >
                              Ver detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <CityDetail 
              selectedCity={selectedCity} 
              startDate={startDate}
              endDate={endDate}
              onBack={() => setSelectedCity(null)}
            />
          )}
        </>
      )}
    </div>
  );
} 