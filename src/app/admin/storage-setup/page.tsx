'use client';

import { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';

export default function StorageSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setupStorage = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch('/api/create-storage-policy');
      const data = await response.json();
      
      if (response.ok) {
        setResult(data.message || 'Configuração concluída com sucesso!');
      } else {
        setError(data.error || 'Erro desconhecido ao configurar armazenamento');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminPageLayout title="Configuração de Armazenamento">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Configuração do Armazenamento Supabase
        </h2>
        
        <p className="mb-6 text-gray-600">
          Esta página permite configurar o bucket de armazenamento &quot;images&quot; e suas políticas
          de acesso para permitir o upload de imagens de produtos.
        </p>
        
        <div className="mb-6">
          <button
            onClick={setupStorage}
            disabled={isLoading}
            className={`px-4 py-2 rounded 
              ${isLoading
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'} 
              text-white`}
          >
            {isLoading ? 'Configurando...' : 'Configurar Armazenamento'}
          </button>
        </div>
        
        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {result}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Erro:</strong> {error}
          </div>
        )}
        
        <div className="mt-8 border-t pt-4">
          <h3 className="text-md font-medium mb-2">Detalhes Técnicos:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Cria um bucket público chamado &quot;images&quot; no Supabase Storage</li>
            <li>Configura políticas para permitir leitura e gravação de arquivos</li>
            <li>Utiliza a chave de serviço para bypass das restrições de RLS</li>
          </ul>
        </div>
      </div>
    </AdminPageLayout>
  );
} 