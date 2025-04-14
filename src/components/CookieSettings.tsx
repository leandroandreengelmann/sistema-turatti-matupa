import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
}

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieSettings({ isOpen, onClose, onSave }: CookieSettingsProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Sempre ativo
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Carregar preferências salvas, se existirem
    const savedPreferences = localStorage.getItem('cookie-preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({
          ...preferences,
          ...parsed,
          necessary: true, // Cookies necessários sempre ativos
        });
      } catch (error) {
        console.error('Erro ao analisar preferências de cookies:', error);
      }
    }
  }, []);

  const handleToggle = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Não permitir mudança nos cookies necessários
    
    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = () => {
    localStorage.setItem('cookie-consent', 'customized');
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    onSave(preferences);
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify(allAccepted));
    onSave(allAccepted);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-blue-200">
        {/* Cabeçalho com gradiente */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Ícone de cookie */}
            <div className="bg-yellow-300/90 p-2 rounded-xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A2.938 2.938 0 0 1 20 11c-1.654 0-3-1.346-3-3 0-.217.031-.444.099-.7a1.003 1.003 0 0 0-1.098-1.296C15.33 6.116 14.677 6.5 14 6.5c-1.103 0-2-.897-2-2 0-.334.084-.667.25-1a1 1 0 0 0-1.145-1.373A4.947 4.947 0 0 0 10 2c-2.757 0-5 2.243-5 5 0 .351.035.7.102 1.033a1 1 0 0 0-.102 1.967 4.95 4.95 0 0 0 1.598 8.003 1 1 0 0 0 .994-.89 3.026 3.026 0 0 1 3.001-2.67 2.99 2.99 0 0 1 2.857 2.113 1.001 1.001 0 0 0 1.31.631 5.014 5.014 0 0 0 2.838.813 5.006 5.006 0 0 0 4.9-4.05 1 1 0 0 0-.5-1.886zm-9.707 1.151c-.692-.001-1.248-.578-1.248-1.283a1.25 1.25 0 0 1 1.25-1.25c.691.001 1.248.578 1.248 1.282a1.247 1.247 0 0 1-1.25 1.251zm5.844-2.653a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Configurações de Cookies</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <p className="text-gray-600 mb-6 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-xl">
            Personalize suas preferências de privacidade abaixo. Os cookies necessários são essenciais para o funcionamento básico do site e não podem ser desativados.
            Para mais detalhes, consulte nossa <Link href="/politica-de-cookies" className="text-blue-600 hover:text-blue-800 font-medium">Política de Cookies</Link>.
          </p>

          <div className="space-y-5 mb-6">
            <div className="border border-blue-100 rounded-3xl p-5 bg-blue-50 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Cookies Necessários
                  </h3>
                  <p className="text-blue-700 mt-1">Essenciais para o funcionamento básico do site</p>
                </div>
                <div className="bg-blue-700 px-3 py-1 rounded-full text-xs font-bold text-white">Sempre ativo</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl p-5 hover:border-blue-200 transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Cookies Analíticos
                  </h3>
                  <p className="text-gray-600 mt-1">Nos ajudam a entender como você utiliza o site</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences.analytics} 
                    onChange={() => handleToggle('analytics')}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl p-5 hover:border-blue-200 transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                    Cookies de Marketing
                  </h3>
                  <p className="text-gray-600 mt-1">Utilizados para direcionar anúncios relevantes para você</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences.marketing} 
                    onChange={() => handleToggle('marketing')}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded-3xl p-5 hover:border-blue-200 transition-colors shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Cookies de Preferências
                  </h3>
                  <p className="text-gray-600 mt-1">Permitem que o site lembre suas preferências</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={preferences.preferences} 
                    onChange={() => handleToggle('preferences')}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 border-t border-gray-200 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 font-medium transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Salvar preferências
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-medium transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 