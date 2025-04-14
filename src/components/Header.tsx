'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ContactSellerButton from './ContactSellerButton';
import DynamicMegaMenu from './DynamicMegaMenu';
import MobileCategoryMenu from './MobileCategoryMenu';
import { Layers } from 'lucide-react';
import { logoService, Logo } from '@/services/logoService';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [primaryLogo, setPrimaryLogo] = useState<Logo | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);

  // Carregar logo principal
  useEffect(() => {
    async function loadPrimaryLogo() {
      setIsLoadingLogo(true);
      try {
        const logo = await logoService.getByType('primary');
        setPrimaryLogo(logo);
      } catch (error) {
        console.error('Erro ao carregar logo principal:', error);
      } finally {
        setIsLoadingLogo(false);
      }
    }
    
    loadPrimaryLogo();
  }, []);

  // Detectar rolagem da página
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Verificar na montagem do componente
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Impedir o scroll do body quando o menu móvel está aberto
  useEffect(() => {
    if (isMenuOpen || isCategoryMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isCategoryMenuOpen]);

  const headerHeight = scrolled ? '56px' : '64px';
  const menuHeight = '36px';
  const totalHeight = `calc(${headerHeight} + ${menuHeight})`;
  
  // Mensagem padrão para contato
  const prefilledText = "Olá, gostaria de informações sobre produtos da Turatti Materiais para Construção.";

  // Fecha menu de categorias
  const handleCloseCategoryMenu = () => {
    setIsCategoryMenuOpen(false);
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out flex flex-col"
      >
        <div 
          className={`
            bg-white shadow-sm transition-all duration-300 ease-in-out 
            ${scrolled ? 'py-2' : 'py-3 md:py-4'}
          `}
          style={{ height: headerHeight }}
        >
          <div className="container mx-auto px-3 md:px-4 flex justify-between items-center h-full">

            {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl md:text-3xl font-bold text-blue-800 transition-all duration-300 hover:opacity-80"
              aria-label="Turatti - Página Inicial"
            >
              {isLoadingLogo ? (
                <span>Turatti</span>
              ) : primaryLogo ? (
                <img 
                  src={primaryLogo.imageurl} 
                  alt={primaryLogo.alttext || "Turatti"} 
                  className={`h-auto ${scrolled ? 'max-h-10' : 'max-h-12'} transition-all duration-300`}
                />
              ) : (
                <span>Turatti</span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Alternar menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-7 h-7 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              <ContactSellerButton 
                buttonText="Fale com um vendedor"
                className="px-3 lg:px-4 py-2 text-sm lg:text-base"
                compact={true}
                prefilledText={prefilledText}
              />
            </nav>

            {/* Mobile Navigation */}
            <div 
              className={`
                fixed inset-0 bg-white md:hidden z-40 transition-transform duration-300 ease-in-out transform
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                pt-[calc(var(--header-height))]
                shadow-lg border-r border-gray-200
              `}
              style={{ '--header-height': headerHeight } as React.CSSProperties}
            >
              <nav className="flex flex-col p-6 space-y-4 bg-white">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-800 py-3 font-medium text-lg border-b border-gray-100 w-full text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCategoryMenuOpen(true);
                  }}
                >
                  <Layers className="mr-2 h-5 w-5" />
                  Categorias
                </button>
                <div onClick={() => setIsMenuOpen(false)} className="mt-4">
                  <ContactSellerButton 
                    buttonText="Fale com um vendedor"
                    className="px-4 py-3 w-full"
                    compact={false}
                    prefilledText={prefilledText}
                  />
                </div>
              </nav>
            </div>

            {/* Menu de Categorias Mobile */}
            <div 
              className={`
                fixed inset-0 bg-white md:hidden z-40 transition-transform duration-300 ease-in-out transform
                ${isCategoryMenuOpen ? 'translate-x-0' : 'translate-x-full'} 
                pt-[calc(var(--header-height))]
                shadow-lg border-l border-gray-200
              `}
              style={{ '--header-height': headerHeight } as React.CSSProperties}
            >
              <MobileCategoryMenu onClose={handleCloseCategoryMenu} isOpen={isCategoryMenuOpen} />
            </div>

            {/* Overlay para fechar o menu ao clicar fora */}
            {(isMenuOpen || isCategoryMenuOpen) && (
              <div 
                className="fixed inset-0 bg-black/30 z-30 md:hidden"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsCategoryMenuOpen(false);
                }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>
        
        {/* Mega Menu abaixo do header (apenas desktop) */}
        <div className="hidden md:block" style={{ height: menuHeight }}>
          <DynamicMegaMenu />
        </div>
      </header>
    </>
  );
}
