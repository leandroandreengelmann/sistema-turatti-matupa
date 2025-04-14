'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store } from '@/data/types';
import { storeService } from '@/services/storeService';
import { categoryService } from '@/services/categoryService';
import CookieSettings, { CookiePreferences } from './CookieSettings';
import { logoService, Logo } from '@/services/logoService';

export default function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [secondaryLogo, setSecondaryLogo] = useState<Logo | null>(null);
  const [isLoadingLogo, setIsLoadingLogo] = useState(true);

  useEffect(() => {
    async function loadStores() {
      setIsLoadingStores(true);
      try {
        const storeData = await storeService.getAll();
        // Filtrar apenas lojas ativas
        setStores(storeData.filter(store => store.isactive !== false));
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
      } finally {
        setIsLoadingStores(false);
      }
    }
    
    async function loadCategories() {
      setIsLoadingCategories(true);
      try {
        // Carregar todas as categorias ativas, não apenas as do menu principal
        const categoriesData = await categoryService.getActiveCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    
    async function loadSecondaryLogo() {
      setIsLoadingLogo(true);
      try {
        // Carregar o logo secundário pelo tipo
        const logo = await logoService.getByType('secondary');
        setSecondaryLogo(logo);
      } catch (error) {
        console.error('Erro ao carregar logo secundário:', error);
      } finally {
        setIsLoadingLogo(false);
      }
    }
    
    loadStores();
    loadCategories();
    loadSecondaryLogo();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    
    try {
      // Validar inputs
      if (!username || !password) {
        setLoginError('Usuário e senha são obrigatórios');
        setIsLoading(false);
        return;
      }
      
      // Simulação de login para demonstração
      if (username === 'admin' && password === 'admin123') {
        console.log('Login bem-sucedido');
        window.location.href = '/admin';
      } else {
        setLoginError('Credenciais inválidas. Verifique seu usuário e senha.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setLoginError('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCookiePreferences = (preferences: CookiePreferences) => {
    // Esta função é chamada quando o usuário salva as preferências de cookies
    console.log('Preferências de cookies salvas:', preferences);
  };

  // Variantes para animação dos itens
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Information */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Nossas Lojas
            </motion.h3>
            
            {isLoadingStores ? (
              <div className="flex justify-center py-4">
                <motion.div 
                  className="w-8 h-8 border-t-2 border-b-2 border-blue-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1,
                    ease: "linear"
                  }}
                />
              </div>
            ) : (
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {stores.length === 0 ? (
                  <p className="text-gray-400 italic">Não há lojas disponíveis no momento.</p>
                ) : (
                  stores.map((store, index) => (
                    <motion.div 
                      key={store.id} 
                      className="mb-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                      whileHover={{ scale: 1.03 }}
                    >
                      <h4 className="font-semibold text-blue-300">{store.name}</h4>
                      <p className="text-gray-300">{store.city}</p>
                      <p className="text-gray-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {store.phone}
                      </p>
                      <p className="text-gray-300 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {store.hours}
                      </p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </div>

          {/* Categories */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Categorias
            </motion.h3>
            
            {isLoadingCategories ? (
              <div className="flex justify-center py-4">
                <motion.div 
                  className="w-8 h-8 border-t-2 border-b-2 border-blue-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1,
                    ease: "linear"
                  }}
                />
              </div>
            ) : (
              <motion.ul 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {categories.length === 0 ? (
                  <p className="text-gray-400 italic">Não há categorias disponíveis no momento.</p>
                ) : (
                  <>
                    <motion.li
                      custom={0}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Link href="/" className="text-lg hover:text-blue-300 flex items-center group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Início
                      </Link>
                    </motion.li>
                    
                    {categories.map((category, index) => (
                      <motion.li 
                        key={category.id}
                        custom={index + 1}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                      >
                        <Link href={`/categorias/${category.name.toLowerCase().replace(/ /g, '-')}`} className="text-lg hover:text-blue-300 flex items-center group">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {category.name}
                        </Link>
                      </motion.li>
                    ))}
                    
                    <motion.li
                      custom={categories.length + 1}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Link href="/politica-de-cookies" className="text-lg hover:text-blue-300 flex items-center group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Política de Cookies
                      </Link>
                    </motion.li>
                    
                    <motion.li
                      custom={categories.length + 2}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <button 
                        onClick={() => setShowCookieSettings(true)}
                        className="text-lg text-blue-300 hover:text-blue-500 bg-transparent border-none p-0 cursor-pointer flex items-center group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Preferências de Cookies
                      </button>
                    </motion.li>
                  </>
                )}
              </motion.ul>
            )}
          </div>

          {/* Admin Login */}
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Redes Sociais
            </motion.h3>
            <motion.div
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full transition duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
              
              {/* Logo Secundária */}
              <motion.div 
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {isLoadingLogo ? (
                  <div className="w-[150px] h-[60px] bg-gray-700 animate-pulse rounded"></div>
                ) : secondaryLogo ? (
                  <img 
                    src={secondaryLogo.imageurl} 
                    alt={secondaryLogo.alttext || "Logo Secundária"} 
                    className="max-w-[150px] h-auto"
                  />
                ) : (
                  <div className="text-white font-bold text-xl">
                    TURATTI
                    <span className="block text-blue-300 text-sm mt-1">Materiais para Construção</span>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="border-t border-gray-700 mt-8 pt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p>&copy; {new Date().getFullYear()} Turatti Materiais para Construção. Todos os direitos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/admin" className="text-gray-400 hover:underline hover:text-gray-300 transition-colors text-sm">
              Área Administrativa
            </Link>
            <Link href="/politica-de-cookies" className="text-blue-300 hover:underline hover:text-blue-200 transition-colors">
              Política de Cookies
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowLoginModal(false);
              setLoginError('');
              setUsername('');
              setPassword('');
            }}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Login Administrativo</h3>
                <motion.button
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError('');
                    setUsername('');
                    setPassword('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
              {loginError && (
                <motion.div 
                  className="mb-4 p-2 bg-red-100 text-red-700 rounded border border-red-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {loginError}
                </motion.div>
              )}
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-lg text-gray-700 mb-2">
                    Usuário
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-lg text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[47px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-colors"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-4">
                  <Link 
                    href="/recuperar-senha" 
                    className="text-lg text-blue-600 hover:text-blue-800"
                    onClick={() => setShowLoginModal(false)}
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    className={`bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition duration-300 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={isLoading}
                    whileHover={!isLoading ? { scale: 1.05 } : {}}
                    whileTap={!isLoading ? { scale: 0.95 } : {}}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <CookieSettings 
        isOpen={showCookieSettings} 
        onClose={() => setShowCookieSettings(false)} 
        onSave={handleSaveCookiePreferences} 
      />
    </footer>
  );
}
