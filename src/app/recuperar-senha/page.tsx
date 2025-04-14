'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ToastProvider';
import Image from 'next/image';

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailEnviado, setEmailEnviado] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validar email
      if (!email || !email.includes('@')) {
        showToast('Por favor, informe um e-mail válido.', 'warning');
        setIsLoading(false);
        return;
      }
      
      // Em uma aplicação real, aqui enviaríamos o e-mail de recuperação
      // Nesta versão sem banco de dados, vamos apenas simular o envio
      
      // Simulação de um pequeno delay para dar feedback ao usuário
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      setEmailEnviado(true);
      showToast('Um link de recuperação foi enviado para seu e-mail! (simulação)', 'success');
      
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao solicitar redefinição de senha:', error);
      showToast('Ocorreu um erro. Tente novamente mais tarde.', 'error');
    }
  };

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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 font-inter">Recuperação de Senha</h1>
            {!emailEnviado ? (
              <p className="text-lg text-gray-600 font-inter">
                Informe seu e-mail para receber um link de recuperação de senha
              </p>
            ) : (
              <p className="text-lg text-gray-600 font-inter">
                Um email foi enviado para <strong>{email}</strong> com instruções para redefinir sua senha.
              </p>
            )}
          </div>
          
          {!emailEnviado ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-lg font-medium mb-2 font-inter">
                  Seu e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors font-inter"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="mb-6">
                <button
                  type="submit"
                  className={`w-full py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-md transition duration-300 font-inter ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processando...' : 'Enviar link de recuperação'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-lg text-green-800 font-inter">
                  Verifique sua caixa de entrada e siga as instruções enviadas para redefinir sua senha.
                </p>
                <p className="text-lg text-gray-600 mt-2 font-inter">
                  Nota: Esta é uma demonstração sem banco de dados. Nenhum e-mail será enviado.
                </p>
              </div>
              
              <button
                onClick={() => setEmailEnviado(false)}
                className="text-blue-700 hover:text-blue-900 font-medium transition duration-300 font-inter"
              >
                Tentar com outro e-mail
              </button>
            </div>
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