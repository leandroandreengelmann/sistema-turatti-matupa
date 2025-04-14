'use client';

import { Product } from '@/data/types';
import { formatCurrency } from '@/utils/format';

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount && product.originalPrice 
    ? product.originalPrice 
    : product.price;
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
      
      <div className="flex flex-col gap-1">
        {hasDiscount && product.originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-base text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
              Economia de {product.discountPercentage}%
            </span>
          </div>
        )}
        
        <div className="text-3xl font-bold text-blue-600">
          {formatCurrency(product.price)}
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Descrição do Produto</h2>
        <p className="text-gray-700">{product.description}</p>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors">
          Ver outros produtos
        </button>
        
        <button className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
          </svg>
          Falar com vendedor
        </button>
      </div>
      
      {product.features && product.features.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Características</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 