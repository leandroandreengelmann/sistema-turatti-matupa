'use client';

import { useState } from 'react';
import ColorCatalog from '@/components/ColorCatalog';
import ColorForm from '@/components/ColorForm';
import type { Color } from '@/types/Color';

export default function ColorsPage() {
  const [showForm, setShowForm] = useState(false);
  const [colors, setColors] = useState<Color[]>([
    {
      name: 'Doce de Figo',
      ncsCode: '6917-G81Y',
      colorCode: 'R727',
      rgbCode: '85,79,49',
      hexColor: '#554F31',
      category: 'Amarelos'
    }
  ]);

  const handleAddColor = (newColor: Color) => {
    setColors(prev => [...prev, newColor]);
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Cores do Ano</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Voltar ao Catálogo' : 'Adicionar Nova Cor'}
          </button>
        </div>

        {showForm ? (
          <ColorForm onSubmit={handleAddColor} />
        ) : (
          <ColorCatalog colors={colors} />
        )}
      </div>
    </main>
  );
} 