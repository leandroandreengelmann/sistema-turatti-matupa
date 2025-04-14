'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyticsService } from '@/services/localDataService';
import { 
  Users, Calendar, MousePointer, Globe, Smartphone, 
  Monitor, ArrowUp, ArrowDown, RefreshCcw, BarChart3,
  Clock, ExternalLink, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Componente de card de estatísticas
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  color = 'sky' 
}: { 
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  trend?: { value: number; label: string; };
  color?: 'sky' | 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
  const colorClasses = {
    sky: {
      bg: 'bg-sky-50',
      icon: 'bg-sky-500',
      text: 'text-sky-700',
      trend: {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-rose-600 bg-rose-50'
      }
    },
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'bg-indigo-500',
      text: 'text-indigo-700',
      trend: {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-rose-600 bg-rose-50'
      }
    },
    emerald: {
      bg: 'bg-emerald-50',
      icon: 'bg-emerald-500',
      text: 'text-emerald-700',
      trend: {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-rose-600 bg-rose-50'
      }
    },
    amber: {
      bg: 'bg-amber-50',
      icon: 'bg-amber-500',
      text: 'text-amber-700',
      trend: {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-rose-600 bg-rose-50'
      }
    },
    rose: {
      bg: 'bg-rose-50',
      icon: 'bg-rose-500',
      text: 'text-rose-700',
      trend: {
        up: 'text-emerald-600 bg-emerald-50',
        down: 'text-rose-600 bg-rose-50'
      }
    }
  };

  return (
    <div className={cn("rounded-xl shadow-sm p-6 flex flex-col", colorClasses[color].bg)}>
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-lg", colorClasses[color].icon)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={cn(
            "px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1",
            trend.value >= 0 
              ? colorClasses[color].trend.up
              : colorClasses[color].trend.down
          )}>
            {trend.value >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </div>
      
      <div className="mt-4 flex flex-col">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <span className="text-2xl font-bold mt-1">{value}</span>
        {description && (
          <span className="text-xs text-slate-500 mt-1">{description}</span>
        )}
      </div>
    </div>
  );
}

// Componente para a seção de tráfego por página
function PageTrafficSection({ 
  data,
  isLoading
}: { 
  data: { page: string; views: number; uniqueVisitors: number; avgTimeOnPage: number; bounceRate: number; }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-56"></div>
        <div className="h-64 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Tráfego por Página</h3>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                  Visitantes Únicos
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
              {data.map((page, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                    {page.page}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {page.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {page.uniqueVisitors}
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

// Componente para a seção de dados demográficos
function DemographicsSection({
  deviceData,
  browserData,
  geoData,
  isLoading
}: {
  deviceData: { device: string; count: number; percentage: number }[];
  browserData: { browser: string; count: number; percentage: number }[];
  geoData: { country: string; count: number; percentage: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-56"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Dados Demográficos</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dispositivos */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-600">Dispositivos</h4>
            <Smartphone className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {deviceData.map((device, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600 capitalize">{device.device}</span>
                  <span className="text-sm font-medium text-slate-700">{device.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-sky-500 h-2 rounded-full" 
                    style={{ width: `${device.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Navegadores */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-600">Navegadores</h4>
            <Monitor className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {browserData.map((browser, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">{browser.browser}</span>
                  <span className="text-sm font-medium text-slate-700">{browser.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full" 
                    style={{ width: `${browser.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Países */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-slate-600">Países</h4>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {geoData.map((country, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-600">{country.country}</span>
                  <span className="text-sm font-medium text-slate-700">{country.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full" 
                    style={{ width: `${country.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para a seção de referenciadores
function ReferrersSection({
  data,
  isLoading
}: {
  data: { referrer: string; count: number; percentage: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded w-56"></div>
        <div className="h-64 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Origens de Tráfego</h3>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-4">
          {data.map((referrer, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <ExternalLink className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-sm font-medium text-slate-600">
                    {referrer.referrer === 'direct' ? 'Tráfego Direto' : referrer.referrer}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">{referrer.count} visitas</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full" 
                  style={{ width: `${referrer.percentage}%` }} 
                />
              </div>
              <div className="text-xs text-slate-500 mt-1 text-right">{referrer.percentage.toFixed(1)}%</div>
            </div>
          ))}
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
    <div className="flex flex-col sm:flex-row gap-4 items-end mb-8">
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
        <RefreshCcw className="w-4 h-4 mr-2" />
        Atualizar
      </button>
    </div>
  );
}

// Componente principal da página
export default function AnalyticsPage() {
  // Estados para os dados do analytics
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [browserData, setBrowserData] = useState<any[]>([]);
  const [geoData, setGeoData] = useState<any[]>([]);
  const [referrerData, setReferrerData] = useState<any[]>([]);
  
  // Estado para carregamento
  const [loading, setLoading] = useState(true);
  
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
  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Carregar todos os dados com os filtros de data
      const stats = await analyticsService.getStats(startDate, endDate);
      const pageViewsData = await analyticsService.getPageViews(startDate, endDate);
      const devices = await analyticsService.getDeviceData(startDate, endDate);
      const browsers = await analyticsService.getBrowserData(startDate, endDate);
      const geoStats = await analyticsService.getGeoData(startDate, endDate);
      const referrers = await analyticsService.getReferrerData(startDate, endDate);
      
      // Atualizar os estados
      setVisitorStats(stats);
      setPageViews(pageViewsData);
      setDeviceData(devices);
      setBrowserData(browsers);
      setGeoData(geoStats);
      setReferrerData(referrers);
    } catch (error) {
      console.error('Erro ao carregar dados de analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem inicial
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  // Renderização do estado de carregamento
  if (loading && !visitorStats) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-600"></div>
          <p className="text-slate-500">Carregando informações de analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-slate-500 mt-1">Insights e métricas de visitantes do site</p>
        </div>
      </div>
      
      {/* Filtro de datas */}
      <DateFilter 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onFilterChange={loadAnalyticsData}
      />
      
      {/* Ferramentas avançadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/analytics/heatmaps">
          <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-rose-500 group-hover:scale-110 transition-transform">
                <MousePointer className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Heatmaps</h3>
            <p className="text-sm text-slate-500 mb-4">Visualize onde os visitantes estão clicando com mapas de calor detalhados por página.</p>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                Analisar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/analytics/cities">
          <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-sky-500 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Cidades do Brasil</h3>
            <p className="text-sm text-slate-500 mb-4">Analise a distribuição de visitantes por cidades brasileiras e métricas regionais.</p>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                Analisar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/analytics/cities/mato-grosso">
          <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100">
            <div className="flex items-start mb-4">
              <div className="p-3 rounded-xl bg-green-500 group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Cidades do Mato Grosso</h3>
            <p className="text-sm text-slate-500 mb-4">Analise a distribuição de visitantes especificamente por cidades do Mato Grosso.</p>
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors flex items-center">
                Analisar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
        
        <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100 opacity-70">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-xl bg-violet-500 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Gravações de Sessão</h3>
          <p className="text-sm text-slate-500 mb-4">Veja como os visitantes interagem com seu site através de gravações de sessão.</p>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <span className="text-sm text-slate-500 flex items-center">
              Em breve
            </span>
          </div>
        </div>
        
        <div className="group bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all border border-slate-100 opacity-70">
          <div className="flex items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500 group-hover:scale-110 transition-transform">
              <RefreshCcw className="w-5 h-5 text-white" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Funis de Conversão</h3>
          <p className="text-sm text-slate-500 mb-4">Analise o caminho dos visitantes e identifique pontos de abandono.</p>
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <span className="text-sm text-slate-500 flex items-center">
              Em breve
            </span>
          </div>
        </div>
      </div>
      
      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Visitantes Únicos" 
          value={visitorStats?.uniqueVisitors || 0}
          icon={Users}
          trend={{ value: 12.4, label: 'vs mês anterior' }}
          color="sky"
        />
        
        <StatCard 
          title="Visualizações de Página" 
          value={visitorStats?.pageViews || 0}
          icon={MousePointer}
          trend={{ value: 8.2, label: 'vs mês anterior' }}
          color="indigo"
        />
        
        <StatCard 
          title="Tempo Médio na Página" 
          value={`${Math.floor((visitorStats?.averageSessionDuration || 0) / 60)}m ${Math.floor((visitorStats?.averageSessionDuration || 0) % 60)}s`}
          icon={Clock}
          trend={{ value: -2.3, label: 'vs mês anterior' }}
          color="emerald"
        />
        
        <StatCard 
          title="Taxa de Rejeição" 
          value={`${(visitorStats?.bounceRate || 0).toFixed(1)}%`}
          icon={BarChart3}
          trend={{ value: -5.1, label: 'vs mês anterior' }}
          color="rose"
          description="% de visitantes que saem após uma página"
        />
      </div>
      
      {/* Segunda linha: Stats secundárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard 
          title="Novos Visitantes" 
          value={visitorStats?.newVisitors || 0}
          icon={Users}
          color="sky"
          description={`${((visitorStats?.newVisitors / visitorStats?.uniqueVisitors) * 100 || 0).toFixed(1)}% do total`}
        />
        
        <StatCard 
          title="Visitantes Recorrentes" 
          value={visitorStats?.returningVisitors || 0}
          icon={RefreshCcw}
          color="amber"
          description={`${((visitorStats?.returningVisitors / visitorStats?.uniqueVisitors) * 100 || 0).toFixed(1)}% do total`}
        />
        
        <StatCard 
          title="Páginas por Sessão" 
          value={(visitorStats?.pagesPerSession || 0).toFixed(1)}
          icon={BarChart3}
          color="indigo"
        />
        
        <StatCard 
          title="Dispositivos Móveis" 
          value={`${((deviceData.find(d => d.device === 'mobile')?.percentage || 0)).toFixed(1)}%`}
          icon={Smartphone}
          color="emerald"
        />
      </div>
      
      {/* Seção de tráfego por página */}
      <div className="mt-12">
        <PageTrafficSection 
          data={pageViews} 
          isLoading={loading}
        />
      </div>
      
      {/* Seção de referenciadores */}
      <div className="mt-12">
        <ReferrersSection 
          data={referrerData} 
          isLoading={loading}
        />
      </div>
      
      {/* Seção de dados demográficos */}
      <div className="mt-12">
        <DemographicsSection 
          deviceData={deviceData}
          browserData={browserData}
          geoData={geoData}
          isLoading={loading}
        />
      </div>
    </div>
  );
} 