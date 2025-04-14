'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';

export default function ResetarSenhaPage() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);
  const [resetConcluido, setResetConcluido] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  // Simulação de verificação de token
  useEffect(() => {
    async function verificarToken() {
      try {
        // Em uma aplicação real, verificaríamos o token na URL
        // Nesta versão sem banco de dados, vamos apenas simular
        
        // Simulação de um pequeno delay para dar feedback ao usuário
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulamos que o token é válido para demonstração
        setTokenValido(true);
        
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        setTokenValido(false);
        showToast('Erro ao verificar o link de redefinição.', 'error');
      }
    }
    
    verificarToken();
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (senha.length < 8) {
      showToast('A senha deve ter pelo menos 8 caracteres.', 'warning');
      return;
    }
    
    if (senha !== confirmarSenha) {
      showToast('As senhas não coincidem.', 'warning');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Em uma aplicação real, enviaríamos a nova senha para o servidor
      // Nesta versão sem banco de dados, vamos apenas simular
      
      // Simulação de um pequeno delay para dar feedback ao usuário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResetConcluido(true);
      showToast('Senha redefinida com sucesso! (simulação)', 'success');
      
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      showToast('Ocorreu um erro. Tente novamente mais tarde.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderização com base no estado do token
  if (tokenValido === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto p-6 text-center">
          <p className="text-gray-600 font-inter">Verificando link de redefinição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <div className="flex items-center">
              <Image 
                src="/logo_turatti.svg" 
                alt="Logo Turatti" 
                width={200} 
                height={60} 
                priority 
              />
            </div>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!tokenValido ? (
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 mb-4 font-inter">Link Inválido ou Expirado</h1>
              <p className="text-gray-600 mb-6 font-inter">
                O link de redefinição de senha que você está tentando usar é inválido ou expirou.
              </p>
              <Link href="/recuperar-senha">
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-inter">
                  Solicitar novo link
                </button>
              </Link>
            </div>
          ) : resetConcluido ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-2 font-inter">Senha Redefinida</h1>
              <p className="text-gray-600 mb-6 font-inter">
                Sua senha foi redefinida com sucesso! Agora você pode fazer login com sua nova senha.
              </p>
              <p className="text-xs text-gray-500 mb-6 font-inter">
                Nota: Esta é uma demonstração sem banco de dados. A senha não foi realmente alterada.
              </p>
              <Link href="/">
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-inter">
                  Ir para a página inicial
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 font-inter">Redefinir Senha</h1>
                <p className="text-lg text-gray-600 font-inter">
                  Digite sua nova senha abaixo
                </p>
                <p className="text-lg text-gray-500 mt-2 font-inter">
                  Nota: Esta é uma demonstração sem banco de dados.
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="senha" className="block text-gray-700 text-lg font-medium mb-2 font-inter">
                    Nova Senha
                  </label>
                  <input
                    id="senha"
                    type="password"
                    className="w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors font-inter"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={isLoading}
                    required
                    minLength={8}
                  />
                  <p className="text-lg text-gray-500 mt-1 font-inter">
                    Mínimo de 8 caracteres
                  </p>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirmarSenha" className="block text-gray-700 text-lg font-medium mb-2 font-inter">
                    Confirmar Nova Senha
                  </label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    className="w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors font-inter"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-md transition duration-300 font-inter text-lg ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processando...' : 'Redefinir Senha'}
                  </button>
                </div>
              </form>
            </>
          )}
          
          <div className="mt-6 text-center">
            <Link href="/" className="text-blue-700 hover:text-blue-900 text-lg font-inter">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 