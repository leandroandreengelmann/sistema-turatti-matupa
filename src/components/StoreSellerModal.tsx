'use client';

import React, { useState, useEffect } from 'react';
import { FaStore, FaWhatsapp, FaArrowLeft, FaTimes, FaSearch } from 'react-icons/fa';
import { RiMapPinLine, RiPhoneLine } from 'react-icons/ri';
import { Store, Seller } from '@/data/types';
import { storeService } from '@/services/storeService';
import { sellerService } from '@/services/sellerService';

// Função para rastrear eventos (pode ser integrada com Google Analytics, etc.)
const trackEvent = (eventName: string, eventData: Record<string, any>) => {
  // Em ambiente de produção, você pode integrar com seu sistema de analytics
  console.log('Track Event:', eventName, eventData);
  
  // Exemplo de integração com Google Analytics 4
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', eventName, eventData);
  // }
};

interface StoreSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
}

export default function StoreSellerModal({ isOpen, onClose, productId }: StoreSellerModalProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'stores' | 'sellers'>('stores');
  
  // Adicionando estados para busca e mensagem personalizada
  const [searchTerm, setSearchTerm] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  // Carregar lojas quando o modal é aberto
  useEffect(() => {
    if (isOpen) {
      loadStores();
      setSelectedStore(null);
      setStep('stores');
      setSearchTerm('');
      setCustomMessage('');
      
      // Rastrear evento de abertura do modal
      trackEvent('contact_modal_opened', { 
        productId: productId || 'none',
        timestamp: new Date().toISOString()
      });
    }
  }, [isOpen, productId]);
  
  // Carregar vendedores quando uma loja é selecionada
  useEffect(() => {
    if (selectedStore) {
      loadSellers(selectedStore.id);
      // Prepara mensagem padrão baseada na loja selecionada
      setCustomMessage(`Olá, gostaria de informações sobre produtos da ${selectedStore.name}.`);
    }
  }, [selectedStore]);
  
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
  
  const formatWhatsAppUrl = (phoneNumber: string, message: string) => {
    // Garantir que o número esteja no formato internacional
    const formattedPhone = phoneNumber.startsWith('+') 
      ? phoneNumber.replace(/\D/g, '') 
      : `55${phoneNumber.replace(/\D/g, '')}`;
    
    const encodedMessage = encodeURIComponent(message || customMessage);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };
  
  const handleSelectStore = (store: Store) => {
    setSelectedStore(store);
    setStep('sellers');
    setSearchTerm(''); // Limpa a busca ao mudar de etapa
    
    // Rastrear evento de seleção de loja
    trackEvent('store_selected', {
      storeId: store.id,
      storeName: store.name,
      storeCity: store.city,
      productId: productId || 'none',
      timestamp: new Date().toISOString()
    });
  };
  
  const handleBack = () => {
    setStep('stores');
    setSellers([]);
    setSearchTerm(''); // Limpa a busca ao voltar
    
    // Rastrear evento de retorno para lista de lojas
    trackEvent('returned_to_stores', {
      fromStoreId: selectedStore?.id,
      fromStoreName: selectedStore?.name,
      timestamp: new Date().toISOString()
    });
  };
  
  const handleContactSeller = (seller: Seller) => {
    // Rastrear evento de contato com vendedor
    trackEvent('seller_contacted', {
      sellerId: seller.id,
      sellerName: seller.name,
      storeId: selectedStore?.id,
      storeName: selectedStore?.name,
      productId: productId || 'none',
      hasCustomMessage: customMessage !== `Olá, gostaria de informações sobre produtos da ${selectedStore?.name}.`,
      timestamp: new Date().toISOString()
    });
  };
  
  // Filtrar lojas com base no termo de busca
  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.city.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filtrar vendedores com base no termo de busca
  const filteredSellers = sellers.filter(seller => 
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    seller.whatsapp.includes(searchTerm)
  );
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 transition-all duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-medium">
            {step === 'stores' ? 'Selecione uma Loja' : 'Selecione um Vendedor'}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 rounded-full p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={step === 'stores' ? "Buscar loja ou cidade..." : "Buscar vendedor..."}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        
        {/* Body */}
        <div className="p-6 pt-2">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500">
                {step === 'stores' ? 'Carregando lojas...' : 'Carregando vendedores...'}
              </p>
            </div>
          ) : (
            <>
              {step === 'stores' ? (
                <>
                  {filteredStores.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <p className="text-slate-500 text-lg">
                        {searchTerm 
                          ? `Nenhuma loja encontrada para "${searchTerm}"`
                          : "Nenhuma loja disponível no momento."}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3 transition-all duration-300">
                      {filteredStores.map((store) => (
                        <li key={store.id} className="transform transition-all duration-300 hover:scale-102">
                          <button
                            onClick={() => handleSelectStore(store)}
                            className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow"
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
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <>
                  {selectedStore && (
                    <div className="mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 text-md mb-1">
                        {selectedStore.name}
                      </h4>
                      <p className="text-blue-600 text-sm">{selectedStore.city}</p>
                    </div>
                  )}
                  
                  {/* Campo de mensagem personalizada */}
                  <div className="mb-4">
                    <label htmlFor="customMessage" className="block text-sm font-medium text-slate-700 mb-1">
                      Mensagem personalizada:
                    </label>
                    <textarea
                      id="customMessage"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Digite sua mensagem para o vendedor..."
                    />
                  </div>
                  
                  {filteredSellers.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <p className="text-slate-500 text-lg">
                        {searchTerm 
                          ? `Nenhum vendedor encontrado para "${searchTerm}"`
                          : "Nenhum vendedor disponível nesta loja."}
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3 transition-all duration-300">
                      {filteredSellers.map((seller) => (
                        <li key={seller.id} className="transform transition-all duration-300 hover:scale-102">
                          <a
                            href={formatWhatsAppUrl(seller.whatsapp, customMessage)}
                            onClick={() => handleContactSeller(seller)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow group"
                          >
                            <div className="flex-shrink-0 bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-inner">
                              <FaWhatsapp className="text-white" size={20} />
                            </div>
                            <div className="ml-4 text-left flex-1">
                              <h4 className="font-medium text-slate-800 text-lg group-hover:text-green-700 transition-colors">{seller.name}</h4>
                              <p className="text-slate-500 group-hover:text-green-600 transition-colors">{seller.whatsapp}</p>
                            </div>
                            <div className="bg-green-100 text-green-700 rounded-lg py-1 px-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              Conversar
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between">
          {step === 'sellers' ? (
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <FaArrowLeft className="mr-2" />
              Voltar para Lojas
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors text-slate-700 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 