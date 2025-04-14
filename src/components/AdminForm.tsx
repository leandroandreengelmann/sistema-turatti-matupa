import React from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface AdminFormProps {
  title: string;
  backLink: string;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function AdminForm({ title, backLink, onSubmit, isLoading = false, children }: AdminFormProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href={backLink}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 space-y-6">
          {children}
        </div>
        
        {/* Rodapé do formulário */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Componentes auxiliares para campos de formulário
export const FormField = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <label className="block text-lg font-medium text-gray-700">{label}</label>
    {children}
    {error && <p className="text-lg text-red-600 mt-1">{error}</p>}
  </div>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`mt-1 block w-full h-[47px] rounded-lg border border-gray-300 shadow-sm px-4 focus:border-blue-500 focus:ring-blue-500 text-gray-700 transition-colors ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`mt-1 block w-full h-[47px] rounded-lg border border-gray-300 shadow-sm px-4 focus:border-blue-500 focus:ring-blue-500 text-gray-700 transition-colors appearance-none bg-white bg-no-repeat bg-right ${className}`}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`mt-1 block w-full min-h-[47px] rounded-lg border border-gray-300 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-blue-500 text-gray-700 transition-colors ${className}`}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export const FormSection = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <div className="border-b border-gray-200 pb-6">
    <div className="mb-4">
      <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-lg text-gray-500">{description}</p>}
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">{children}</div>
  </div>
); 