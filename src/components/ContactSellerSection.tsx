"use client";

import ContactStoreSellersButton from './ContactStoreSellersButton';

interface ContactSellerSectionProps {
  className?: string;
  buttonClassName?: string;
  buttonText?: string;
  productId?: string; // Opcional: ID do produto quando usado em páginas de produto
}

export default function ContactSellerSection({ 
  className = "", 
  buttonClassName = "", 
  buttonText = "Falar com um vendedor",
  productId
}: ContactSellerSectionProps) {
  return (
    <div className={`w-full py-6 md:py-8 ${className}`}>
      <div className="container mx-auto px-4 flex justify-center">
        <ContactStoreSellersButton 
          buttonText={buttonText}
          className={`px-8 py-3.5 text-lg font-medium ${buttonClassName}`}
          productId={productId}
        />
      </div>
    </div>
  );
} 