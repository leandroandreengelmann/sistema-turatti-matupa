import React from 'react';
import { Home, Briefcase, Palette } from 'lucide-react';

interface SuggestionCardProps {
  title: string;
  description: string;
  color: string;
  icon?: React.ReactNode;
}

export default function SuggestionCard({ title, description, color, icon }: SuggestionCardProps) {
  // Determina o ícone com base no título se nenhum for fornecido
  const getDefaultIcon = () => {
    if (title.toLowerCase().includes('parede') || title.toLowerCase().includes('interna')) {
      return <Home className="w-6 h-6" />;
    } else if (title.toLowerCase().includes('corporativo') || title.toLowerCase().includes('escritório')) {
      return <Briefcase className="w-6 h-6" />;
    } else {
      return <Palette className="w-6 h-6" />;
    }
  };

  const displayIcon = icon || getDefaultIcon();

  // Calcular uma cor mais clara para o fundo, mantendo a mesma tonalidade
  const getBgColor = (hexColor: string) => {
    // Converter hex para rgb e adicionar transparência
    return `${hexColor}15`; // 15 = 15% de opacidade
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div 
        className="h-4" 
        style={{ backgroundColor: color }}
      />
      <div className="p-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: getBgColor(color) }}
        >
          <div style={{ color }}>{displayIcon}</div>
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
} 