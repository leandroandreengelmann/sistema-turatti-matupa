import { TrendingUp, UserCheck, BarChart4, ShoppingBag } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: any;
  period?: string;
}

function DashboardCard({ title, value, change, isPositive, icon: Icon, period = 'vs mês anterior' }: DashboardCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
      <div className="p-6">
        {/* Header com título e ícone */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">{title}</span>
          <div className="p-2 rounded-lg bg-opacity-10" 
               style={{ backgroundColor: isPositive ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)' }}>
            <Icon className={`w-5 h-5 ${isPositive ? 'text-emerald-500' : 'text-rose-400'}`} />
          </div>
        </div>

        {/* Valor principal */}
        <div className="space-y-2">
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center text-sm font-medium ${
              isPositive ? 'text-emerald-500' : 'text-rose-400'
            }`}>
              {isPositive ? '↑' : '↓'} {change}
            </span>
            <span className="text-xs text-slate-400">{period}</span>
          </div>
        </div>
      </div>
      
      {/* Barra decorativa inferior com gradiente */}
      <div className={`h-1 w-full ${
        isPositive 
          ? 'bg-gradient-to-r from-emerald-400 to-teal-300' 
          : 'bg-gradient-to-r from-rose-400 to-pink-300'
      }`} />
    </div>
  );
}

export default function AdminDashboardCards() {
  const cards = [
    {
      title: 'Visitas no Site',
      value: '2.458',
      change: '+22%',
      isPositive: true,
      icon: UserCheck,
    },
    {
      title: 'Taxa de Conversão',
      value: '3.6%',
      change: '+0.8%',
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 430',
      change: '-5%',
      isPositive: false,
      icon: ShoppingBag,
    },
    {
      title: 'Crescimento Mensal',
      value: '8.5%',
      change: '+2.3%',
      isPositive: true,
      icon: BarChart4,
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          {...card}
        />
      ))}
    </div>
  );
} 