'use client';

import { useEffect, useState } from 'react';
import { logoService, Logo } from '@/services/logoService';

export default function TesteLogosPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [secondaryLogo, setSecondaryLogo] = useState<Logo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogos() {
      try {
        setLoading(true);
        const allLogos = await logoService.getAll();
        setLogos(allLogos);
        
        const secondary = await logoService.getByType('secondary');
        setSecondaryLogo(secondary);
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar logos:', err);
        setError('Falha ao carregar logos do banco de dados.');
      } finally {
        setLoading(false);
      }
    }
    
    loadLogos();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Logos do Banco de Dados</h1>
      
      {loading ? (
        <div className="text-center p-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Carregando logos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Logo Secundário</h2>
            {secondaryLogo ? (
              <div className="border p-4 rounded-lg">
                <img 
                  src={secondaryLogo.imageurl} 
                  alt={secondaryLogo.alttext || "Logo Secundário"} 
                  className="max-w-[200px] h-auto mb-4" 
                />
                <div className="space-y-2">
                  <p><strong>ID:</strong> {secondaryLogo.id}</p>
                  <p><strong>Tipo:</strong> {secondaryLogo.type}</p>
                  <p><strong>URL da Imagem:</strong> {secondaryLogo.imageurl}</p>
                  <p><strong>Ativo:</strong> {secondaryLogo.isactive ? 'Sim' : 'Não'}</p>
                  {secondaryLogo.description && (
                    <p><strong>Descrição:</strong> {secondaryLogo.description}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-amber-600">
                Nenhum logo secundário encontrado na tabela 'logos'. 
                Cadastre um logo com type="secondary" para ser exibido no footer.
              </p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Todos os Logos ({logos.length})</h2>
            {logos.length === 0 ? (
              <p className="text-amber-600">
                Nenhum logo encontrado no banco de dados. A tabela 'logos' pode estar vazia ou não existir.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {logos.map(logo => (
                  <div key={logo.id} className="border p-4 rounded-lg">
                    <img 
                      src={logo.imageurl} 
                      alt={logo.alttext || logo.type} 
                      className="max-w-full h-auto mb-4" 
                    />
                    <div className="space-y-1 text-sm">
                      <p><strong>ID:</strong> {logo.id}</p>
                      <p><strong>Tipo:</strong> {logo.type}</p>
                      <p><strong>Ativo:</strong> {logo.isactive ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 