import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookieConsentProps {
  onAccept: () => void;
  onCustomize?: () => void;
}

export default function CookieConsent({ onAccept, onCustomize }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já aceitou os cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Se não aceitou, mostrar o banner
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };

  const handleCustomize = () => {
    if (onCustomize) {
      onCustomize();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Overlay com sombra decorativa (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent -z-10 h-40 bottom-0"></div>
      
      {/* Banner de cookies com fundo azul degradê */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-xl rounded-3xl mx-4 mb-4 overflow-hidden border border-blue-500">
        <div className="container mx-auto p-5 md:py-6 relative">
          {/* Elementos decorativos (círculos/bolhas) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-20 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full opacity-20 -ml-10 -mb-10"></div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {/* Ícone de cookie */}
                <div className="bg-yellow-300/90 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7a1.003 1.003 0 0 0-1.098-1.296C15.33 6.116 14.677 6.5 14 6.5c-1.103 0-2-.897-2-2 0-.334.084-.667.25-1a1 1 0 0 0-1.145-1.373A4.947 4.947 0 0 0 10 2c-2.757 0-5 2.243-5 5 0 .351.035.7.102 1.033a1 1 0 0 0-.102 1.967 4.95 4.95 0 0 0 1.598 8.003 1 1 0 0 0 .994-.89 3.026 3.026 0 0 1 3.001-2.67 2.99 2.99 0 0 1 2.857 2.113 1.001 1.001 0 0 0 1.31.631 5.014 5.014 0 0 0 2.838.813 5.006 5.006 0 0 0 4.9-4.05 1 1 0 0 0-.5-1.886zm-9.707 1.151c-.692-.001-1.248-.578-1.248-1.283a1.25 1.25 0 0 1 1.25-1.25c.691.001 1.248.578 1.248 1.282a1.247 1.247 0 0 1-1.25 1.251zm5.844-2.653a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Nós utilizamos cookies</h3>
              </div>
              <p className="text-blue-100 my-3">
                Utilizamos cookies para melhorar sua experiência, personalizar conteúdo 
                e analisar nosso tráfego. Escolha suas preferências de privacidade abaixo.
              </p>
              <Link href="/politica-de-cookies" className="text-yellow-300 hover:text-yellow-100 font-medium inline-flex items-center gap-1 transition-colors">
                <span>Saiba mais sobre nossa política de cookies</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-2 md:mt-0">
              <button
                onClick={handleCustomize}
                className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-2xl transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Personalizar
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold rounded-2xl transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Aceitar todos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 