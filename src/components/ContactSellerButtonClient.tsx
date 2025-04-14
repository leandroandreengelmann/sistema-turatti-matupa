"use client";

import { useState, useEffect } from "react";
import { Product } from "@/data/types";
import { productService } from "@/services/localDataService";
import { MessageSquare } from "lucide-react";
import StoreSellerModal from "./StoreSellerModal";

interface ContactSellerButtonClientProps {
  productId: string;
}

// Interface estendida para incluir os campos do vendedor
interface ProductWithSellerInfo extends Omit<Product, 'sellerName'> {
  sellerName?: string;
  sellerPhone?: string;
}

export default function ContactSellerButtonClient({ productId }: ContactSellerButtonClientProps) {
  const [product, setProduct] = useState<ProductWithSellerInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await productService.getById(productId);
        setProduct(fetchedProduct);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produto:', err);
        setError('Não foi possível carregar as informações do produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-12 rounded-md w-full"></div>;
  }

  if (error || !product) {
    return (
      <div className="text-sm text-red-500">
        {error || 'Informações de contato indisponíveis'}
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <button 
        onClick={handleOpenModal}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
      >
        <MessageSquare size={18} />
        Falar com vendedor
      </button>
      
      <StoreSellerModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        productId={productId}
      />
    </div>
  );
} 