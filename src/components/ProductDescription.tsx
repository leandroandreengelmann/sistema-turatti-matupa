'use client';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="mt-4 md:mt-8 bg-white p-4 md:p-6 rounded-xl shadow-sm">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 border-b border-gray-100 pb-2">
        Descrição do Produto
      </h2>
      <div className="prose prose-blue max-w-none">
        <p className="text-sm md:text-base text-gray-700 whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
} 