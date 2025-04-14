'use client';

import { LineChart, BarChart2, TrendingUp, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: any;
  trendIsPositive: boolean;
}

function MetricCard({ title, value, trend, icon: Icon, trendIsPositive }: MetricCardProps) {
  return (
    <div className="group relative">
      {/* Card Principal */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm transition-all duration-500 hover:shadow-md">
        {/* Ícone Grande de Fundo */}
        <div className="absolute -right-8 -top-8 opacity-5">
          <Icon className="h-32 w-32" strokeWidth={0.5} />
        </div>

        {/* Conteúdo */}
        <div className="relative z-20">
          {/* Cabeçalho */}
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl p-2.5" 
                 style={{ backgroundColor: trendIsPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}>
              <Icon className={`h-5 w-5 ${trendIsPositive ? 'text-emerald-500' : 'text-rose-400'}`} strokeWidth={2} />
            </div>
            <h3 className="text-lg font-medium text-slate-700">{title}</h3>
          </div>

          {/* Valor Principal */}
          <div className="mb-4">
            <div className="text-3xl font-bold tracking-tight text-slate-800">
              {value}
            </div>
          </div>

          {/* Tendência */}
          <div className="flex items-center gap-2">
            <div className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
              trendIsPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
            }`}>
              {trend}
            </div>
          </div>
        </div>
      </div>

      {/* Efeito de Sombra Colorida no Hover */}
      <div className={`absolute -inset-1 rounded-[2.5rem] opacity-0 blur transition-all duration-500 group-hover:opacity-30 ${
        trendIsPositive 
          ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
          : 'bg-gradient-to-r from-rose-400 to-pink-300'
      }`} />
    </div>
  );
}

export default function DashboardOverview() {
  const metrics = [
    {
      title: 'Taxa de Conversão',
      value: '3.6%',
      trend: '↗ +0.8%',
      trendIsPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Usuários Ativos',
      value: '1.245',
      trend: '↗ +12%',
      trendIsPositive: true,
      icon: Users,
    },
    {
      title: 'Performance Mensal',
      value: '86%',
      trend: '↗ +6%',
      trendIsPositive: true,
      icon: BarChart2,
    },
    {
      title: 'Crescimento Geral',
      value: '28%',
      trend: '↘ -2%',
      trendIsPositive: false,
      icon: LineChart,
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-800">
            Dashboard
          </h1>
          <p className="text-lg text-slate-500">
            Acompanhe os principais indicadores do seu negócio
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </div>
  );
} 