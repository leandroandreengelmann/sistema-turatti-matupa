'use client';

import { useState, useEffect } from 'react';
import CookieConsent from './CookieConsent';
import CookieSettings, { CookiePreferences } from './CookieSettings';

export default function CookieManager() {
  const [showSettings, setShowSettings] = useState(false);
  const [hasConsent, setHasConsent] = useState(true); // Inicialmente oculto até verificar

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const cookieConsent = localStorage.getItem('cookie-consent');
    setHasConsent(!!cookieConsent);
  }, []);

  const handleAcceptCookies = () => {
    // Aceitar todos os cookies
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify(allPreferences));
    setHasConsent(true);
    
    // Aqui você poderia ativar os scripts de rastreamento, se necessário
    activateTracking(allPreferences);
  };

  const handleSavePreferences = (preferences: CookiePreferences) => {
    activateTracking(preferences);
    setHasConsent(true);
  };

  const activateTracking = (preferences: CookiePreferences) => {
    // Ativar scripts de rastreamento com base nas preferências
    // Exemplo: Se analytics estiver ativado, inicializar Google Analytics
    if (preferences.analytics) {
      // Inicializar scripts de analytics
      console.log('Analytics ativado');
    }
    
    // Exemplo: Se marketing estiver ativado, inicializar scripts de marketing
    if (preferences.marketing) {
      // Inicializar scripts de marketing
      console.log('Marketing ativado');
    }
  };

  return (
    <>
      {!hasConsent && (
        <CookieConsent 
          onAccept={handleAcceptCookies} 
          onCustomize={() => setShowSettings(true)} 
        />
      )}

      <CookieSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
} 