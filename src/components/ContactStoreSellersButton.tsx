"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaTimes, FaArrowLeft, FaStore } from 'react-icons/fa';
import { RiMapPinLine, RiPhoneLine } from 'react-icons/ri';
import { Store, Seller } from '@/data/types';
import { storeService } from '@/services/storeService';
import { sellerService } from '@/services/sellerService';

interface ContactStoreSellersButtonProps {
  buttonText?: string;
  className?: string;
  productId?: string;
}

export default function ContactStoreSellersButton({
  buttonText = 'Fale com um Vendedor',
  className = '',
  productId
}: ContactStoreSellersButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'stores' | 'sellers'>('stores');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar no carregamento
    checkIfMobile();
    
    // Adicionar listener para resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Abrir modal e carregar lojas
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setStep('stores');
    setSelectedStore(null);
    setSellers([]);
    await loadStores();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const loadStores = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allStores = await storeService.getAll();
      
      // Filtra apenas lojas ativas
      const activeStores = allStores.filter(store => store.isactive !== false);
      setStores(activeStores);
    } catch (err) {
      console.error('Erro ao carregar lojas:', err);
      setError('Erro ao carregar lojas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSellers = async (storeId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const storeSellers = await sellerService.getByStoreId(storeId);
      
      // Filtra apenas vendedores ativos
      const activeSellers = storeSellers.filter(seller => seller.isactive !== false);
      setSellers(activeSellers);
    } catch (err) {
      console.error(`Erro ao carregar vendedores da loja ${storeId}:`, err);
      setError('Erro ao carregar vendedores. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectStore = async (store: Store) => {
    setSelectedStore(store);
    await loadSellers(store.id);
    setStep('sellers');
    
    // Vibração no mobile se API disponível
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleBack = () => {
    setStep('stores');
    setSellers([]);
    
    // Vibração no mobile se API disponível
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const formatWhatsAppUrl = (phoneNumber: string) => {
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.replace(/\D/g, '') 
      : `55${phoneNumber.replace(/\D/g, '')}`;
    
    return `https://wa.me/${formattedPhone}`;
  };

  // Variantes de animação para o container modal
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: isMobile ? 1 : 0.9
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      scale: isMobile ? 1.1 : 0.95,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Variantes para a transição entre etapas
  const pageVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }
      };
    }
  };

  // Variantes para itens em lista
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  // Define a direção para animações
  const direction = step === 'stores' ? -1 : 1;

  return (
    <>
      <motion.button
        onClick={handleOpenModal}
        className={`flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">{buttonText}</span>
          <FaWhatsapp className="text-xl" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-xl border border-slate-100 transition-all duration-300 overflow-hidden
                ${isMobile ? 'fixed inset-x-0 inset-y-0 rounded-none' : 'w-full max-w-md'}`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
                <motion.h3 
                  className="text-xl font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {step === 'stores' ? 'Selecione uma Loja' : 'Selecione um Vendedor'}
                </motion.h3>
                <motion.button 
                  onClick={handleCloseModal}
                  className="text-white hover:text-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 rounded-full p-1"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaTimes size={18} />
                </motion.button>
              </div>
              
              {/* Body with animated page transitions */}
              <div className={`${isMobile ? 'h-[calc(100%-112px)] overflow-y-auto' : ''}`}>
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className={`p-6 ${isMobile ? 'min-h-full' : ''}`}
                  >
                    {error && (
                      <motion.div 
                        className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <span>{error}</span>
                      </motion.div>
                    )}
                    
                    {isLoading ? (
                      <div className="flex flex-col justify-center items-center py-12">
                        <motion.div 
                          className="h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1,
                            ease: "linear"
                          }}
                          style={{ borderRadius: "50%" }}
                        />
                        <p className="text-slate-500">
                          {step === 'stores' ? 'Carregando lojas...' : 'Carregando vendedores...'}
                        </p>
                      </div>
                    ) : (
                      <>
                        {step === 'stores' ? (
                          <>
                            {stores.length === 0 ? (
                              <div className="text-center py-8 px-4">
                                <motion.svg 
                                  className="w-12 h-12 mx-auto text-slate-300 mb-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24" 
                                  xmlns="http://www.w3.org/2000/svg"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", damping: 10 }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                </motion.svg>
                                <p className="text-slate-500 text-lg">
                                  Nenhuma loja disponível no momento.
                                </p>
                              </div>
                            ) : (
                              <motion.ul 
                                className="space-y-3 transition-all duration-300"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  visible: {
                                    transition: {
                                      staggerChildren: 0.05
                                    }
                                  }
                                }}
                              >
                                {stores.map((store, index) => (
                                  <motion.li 
                                    key={store.id} 
                                    className="transform transition-all duration-300"
                                    custom={index}
                                    variants={listItemVariants}
                                  >
                                    <motion.button
                                      onClick={() => handleSelectStore(store)}
                                      className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow"
                                      whileHover={{ 
                                        scale: 1.02, 
                                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" 
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-inner">
                                        <FaStore className="text-white" size={20} />
                                      </div>
                                      <div className="ml-4 text-left flex-1">
                                        <h4 className="font-medium text-slate-800 text-lg">{store.name}</h4>
                                        <div className="flex items-center text-slate-500 mt-1">
                                          <RiMapPinLine className="mr-1 text-blue-500" />
                                          <p>{store.city}</p>
                                        </div>
                                        {store.phone && (
                                          <div className="flex items-center text-slate-500 mt-1">
                                            <RiPhoneLine className="mr-1 text-blue-500" />
                                            <p>{store.phone}</p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.button>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </>
                        ) : (
                          <>
                            {sellers.length === 0 ? (
                              <div className="text-center py-8 px-4">
                                <motion.svg 
                                  className="w-12 h-12 mx-auto text-slate-300 mb-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24" 
                                  xmlns="http://www.w3.org/2000/svg"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", damping: 10 }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </motion.svg>
                                <p className="text-slate-500 text-lg">
                                  Nenhum vendedor disponível nesta loja.
                                </p>
                              </div>
                            ) : (
                              <motion.ul 
                                className="space-y-3 transition-all duration-300"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  visible: {
                                    transition: {
                                      staggerChildren: 0.05
                                    }
                                  }
                                }}
                              >
                                {sellers.map((seller, index) => (
                                  <motion.li 
                                    key={seller.id} 
                                    className="transform transition-all duration-300"
                                    custom={index}
                                    variants={listItemVariants}
                                  >
                                    <motion.a
                                      href={formatWhatsAppUrl(seller.whatsapp)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow group"
                                      whileHover={{ 
                                        scale: 1.02, 
                                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)" 
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-inner">
                                        <FaWhatsapp className="text-white" size={20} />
                                      </div>
                                      <div className="ml-4 text-left flex-1">
                                        <h4 className="font-medium text-slate-800 text-lg group-hover:text-green-700 transition-colors">{seller.name}</h4>
                                        <p className="text-slate-500 group-hover:text-green-600 transition-colors">{seller.whatsapp}</p>
                                      </div>
                                      <motion.div 
                                        className="bg-green-100 text-green-700 rounded-lg py-1 px-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                        initial={{ x: -10, opacity: 0 }}
                                        whileHover={{ x: 0, opacity: 1 }}
                                      >
                                        Conversar
                                      </motion.div>
                                    </motion.a>
                                  </motion.li>
                                ))}
                              </motion.ul>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Footer */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between">
                {step === 'sellers' ? (
                  <motion.button
                    onClick={handleBack}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaArrowLeft className="mr-2" />
                    Voltar para Lojas
                  </motion.button>
                ) : (
                  <div></div>
                )}
                <motion.button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-slate-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Fechar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 