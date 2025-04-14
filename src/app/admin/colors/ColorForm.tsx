'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Color } from '@/types/Color';

interface ColorFormProps {
  onSuccess: () => void;
}

export default function ColorForm({ onSuccess }: ColorFormProps) {
  const [formData, setFormData] = useState<Partial<Color>>({
    name: '',
    ncsCode: '',
    colorCode: '',
    rgbCode: '',
    hexColor: '#000000',
    category: ''
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Efeito para carregar categorias existentes
  useEffect(() => {
    // TODO: Substituir com chamada real à API
    const fetchCategories = async () => {
      // Simular chamada à API
      const mockCategories = ['Neutros', 'Tons Pastéis', 'Tons Terrosos', 'Tons Vibrantes'];
      setCategories(mockCategories);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      // TODO: Implementar chamada real à API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay da API
      
      // Simula sucesso
      setSubmitStatus('success');
      onSuccess();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Ocorreu um erro ao salvar a cor. Por favor, tente novamente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview da Cor */}
        <div className="md:col-span-2 flex items-center space-x-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div
            className="w-24 h-24 rounded-xl shadow-lg"
            style={{ backgroundColor: formData.hexColor }}
          />
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">
              Preview da Cor
            </h3>
            <p className="text-sm text-slate-500">
              Visualize como a cor ficará no catálogo
            </p>
          </div>
        </div>

        {/* Nome da Cor */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Nome da Cor
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            required
          />
        </div>

        {/* Código Hexadecimal */}
        <div>
          <label htmlFor="hexColor" className="block text-sm font-medium text-slate-700 mb-1">
            Código Hexadecimal
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-slate-500 sm:text-sm">#</span>
            </div>
            <input
              type="text"
              id="hexColor"
              name="hexColor"
              value={formData.hexColor?.replace('#', '')}
              onChange={e => setFormData(prev => ({ ...prev, hexColor: '#' + e.target.value }))}
              className="block w-full rounded-lg border-slate-200 pl-7 focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              pattern="^#?[0-9A-Fa-f]{6}$"
              required
            />
          </div>
        </div>

        {/* Código NCS */}
        <div>
          <label htmlFor="ncsCode" className="block text-sm font-medium text-slate-700 mb-1">
            Código NCS
          </label>
          <input
            type="text"
            id="ncsCode"
            name="ncsCode"
            value={formData.ncsCode}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            required
          />
        </div>

        {/* Código RGB */}
        <div>
          <label htmlFor="rgbCode" className="block text-sm font-medium text-slate-700 mb-1">
            Código RGB
          </label>
          <input
            type="text"
            id="rgbCode"
            name="rgbCode"
            value={formData.rgbCode}
            onChange={handleInputChange}
            className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
            required
          />
        </div>

        {/* Categoria */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Categoria
            </label>
            <div className="flex items-center space-x-4">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border-slate-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm ${
                  isNewCategory ? 'hidden' : ''
                }`}
                required={!isNewCategory}
                disabled={isNewCategory}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <input
                type="text"
                id="newCategory"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`block w-full rounded-lg border-slate-200 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm ${
                  !isNewCategory ? 'hidden' : ''
                }`}
                placeholder="Digite a nova categoria"
                required={isNewCategory}
                disabled={!isNewCategory}
              />
              <button
                type="button"
                onClick={() => {
                  setIsNewCategory(!isNewCategory);
                  setFormData(prev => ({ ...prev, category: '' }));
                }}
                className="inline-flex items-center px-3 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                {isNewCategory ? 'Usar Existente' : 'Nova Categoria'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex justify-end space-x-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 border border-slate-200 text-sm font-medium rounded-lg text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitStatus === 'loading'}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
            submitStatus === 'loading' ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {submitStatus === 'loading' ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Salvando...
            </>
          ) : (
            'Salvar Cor'
          )}
        </button>
      </div>
    </form>
  );
} 