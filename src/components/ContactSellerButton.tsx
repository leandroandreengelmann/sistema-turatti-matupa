"use client";

import { FaWhatsapp } from 'react-icons/fa';
import ContactStoreSellersButton from './ContactStoreSellersButton';

interface ContactSellerButtonProps {
  buttonText?: string;
  className?: string;
  prefilledText?: string;
  compact?: boolean;
  productId?: string; // Opcional: permite passar o ID do produto quando usado em páginas de produto
}

/**
 * Componente para contato direto com vendedores da Turatti via modal de seleção
 */
export default function ContactSellerButton({ 
  buttonText = 'Fale com um Vendedor', 
  className = '',
  prefilledText = 'Olá, gostaria de informações sobre produtos da Turatti Materiais para Construção.',
  compact = false,
  productId
}: ContactSellerButtonProps) {
  // Gera a classe baseada nas props compact para ajustar o tamanho
  const buttonClassName = `${compact ? '' : 'px-4 py-3'} ${className}`;
  
  return (
    <ContactStoreSellersButton 
      buttonText={buttonText}
      className={buttonClassName}
      productId={productId}
    />
  );
} 