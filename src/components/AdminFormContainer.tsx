import React, { ReactNode } from 'react';

interface AdminFormContainerProps {
  title: string;
  children: ReactNode;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export default function AdminFormContainer({
  title,
  children,
  onCancel,
  onSubmit,
  submitLabel = 'Salvar',
  isSubmitting = false,
}: AdminFormContainerProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      
      <form onSubmit={onSubmit}>
        {children}
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300 text-lg"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md transition duration-300 text-lg disabled:opacity-70"
          >
            {isSubmitting ? 'Processando...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
} 