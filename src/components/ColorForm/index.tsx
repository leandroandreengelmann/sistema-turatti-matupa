import { useState } from 'react';
import type { Color } from '@/types/Color';

interface ColorFormProps {
  onSubmit: (color: Color) => void;
}

const ColorForm = ({ onSubmit }: ColorFormProps) => {
  const [formData, setFormData] = useState<Omit<Color, 'hexColor'>>({
    name: '',
    ncsCode: '',
    colorCode: '',
    rgbCode: '',
    category: 'Amarelos'
  });

  const categories = [
    'Amarelos',
    'Laranjas',
    'Vermelhos',
    'Violetas',
    'Azuis e Verdes',
    'Verdes-amarelados',
    'Neutros'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Converter RGB para Hex
    const [r, g, b] = formData.rgbCode.split(',').map(Number);
    const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    onSubmit({
      ...formData,
      hexColor
    });

    // Limpar formulário
    setFormData({
      name: '',
      ncsCode: '',
      colorCode: '',
      rgbCode: '',
      category: 'Amarelos'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Cadastrar Nova Cor</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Cor
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="ncsCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código NCS
          </label>
          <input
            type="text"
            id="ncsCode"
            name="ncsCode"
            value={formData.ncsCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código Cor
          </label>
          <input
            type="text"
            id="colorCode"
            name="colorCode"
            value={formData.colorCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="rgbCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código RGB (formato: r,g,b)
          </label>
          <input
            type="text"
            id="rgbCode"
            name="rgbCode"
            value={formData.rgbCode}
            onChange={handleChange}
            placeholder="85,79,49"
            required
            pattern="^\d{1,3},\d{1,3},\d{1,3}$"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-6"
        >
          Cadastrar Cor
        </button>
      </div>
    </form>
  );
};

export default ColorForm; 