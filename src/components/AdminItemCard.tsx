import React, { ReactNode } from 'react';

interface AdminItemCardProps {
  title: string;
  subtitle?: string;
  content: ReactNode;
  status?: {
    label: string;
    isActive: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
  customContent?: ReactNode;
}

export default function AdminItemCard({
  title,
  subtitle,
  content,
  status,
  onEdit,
  onDelete,
  customContent,
}: AdminItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        
        {subtitle && (
          <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
        )}
        
        <div className="mt-3">
          {content}
        </div>
        
        {status && (
          <div className="mt-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium ${
              status.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {status.label}
            </span>
          </div>
        )}
        
        {customContent && (
          <div className="mt-3">
            {customContent}
          </div>
        )}
        
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-100 focus:outline-none"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          
          <button
            onClick={onDelete}
            className="inline-flex items-center px-3 py-1.5 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
} 