'use client';

import React, { useState } from 'react';
import AdminPageLayout from '@/components/AdminPageLayout';
import { ArrowLeft, Check, Database, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SetupLogosSocialLinksPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
    logosExists?: boolean;
    socialLinksExists?: boolean;
  } | null>(null);

  const setupTables = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      const response = await fetch('/api/create-logo-tables');
      const data = await response.json();
      
      setResult(data);
    } catch (error) {
      console.error('Erro na configuração das tabelas:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminPageLayout title="Configuração de Logos e Links Sociais">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Configuração das Tabelas</h2>
          <p className="text-gray-600 mb-4">
            Esta página configura as tabelas necessárias para armazenar logos e links sociais no Supabase.
            Clique no botão abaixo para criar ou verificar essas tabelas.
          </p>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <div className="flex items-start">
              <Database className="h-5 w-5 text-blue-700 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 font-medium">Tabelas que serão criadas:</h3>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 pl-5 list-disc">
                  <li><code className="bg-blue-100 px-1 py-0.5 rounded">logos</code> - Para armazenar todos os logos do site</li>
                  <li><code className="bg-blue-100 px-1 py-0.5 rounded">social_links</code> - Para armazenar links de redes sociais</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            onClick={setupTables}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Configurando...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Configurar Tabelas</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-4 border rounded-lg ${
            result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start">
              {result.success ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              )}
              
              <div>
                <h3 className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Configuração concluída' : 'Erro na configuração'}
                </h3>
                
                {result.message && (
                  <p className="mt-1 text-sm text-gray-700">{result.message}</p>
                )}
                
                {result.error && (
                  <p className="mt-1 text-sm text-red-600">{result.error}</p>
                )}
                
                {result.success && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        result.logosExists ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">
                        Tabela <code className="bg-gray-100 px-1 py-0.5 rounded">logos</code>: 
                        {result.logosExists ? ' Já existia' : ' Criada com sucesso'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        result.socialLinksExists ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-700">
                        Tabela <code className="bg-gray-100 px-1 py-0.5 rounded">social_links</code>: 
                        {result.socialLinksExists ? ' Já existia' : ' Criada com sucesso'}
                      </span>
                    </div>
                  </div>
                )}
                
                {result.success && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      Agora você pode gerenciar logos e links sociais no painel administrativo:
                    </p>
                    <div className="mt-2 space-x-2">
                      <Link href="/admin/logos" className="inline-block px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Ir para Logos
                      </Link>
                      <Link href="/admin/social-links" className="inline-block px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Ir para Links Sociais
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
} 