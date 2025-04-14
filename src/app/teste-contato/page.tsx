import { Metadata } from 'next';
import ContactStoreSellersButton from '@/components/ContactStoreSellersButton';

export const metadata: Metadata = {
  title: 'Teste do Botão de Contato com Vendedores',
  description: 'Página para testar o novo fluxo de contato com vendedores'
};

export default function TesteContatoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Teste do Botão de Contato</h1>
      
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Novo Fluxo de Contato</h2>
        <p className="text-gray-600 mb-6">
          Este botão implementa o fluxo correto: primeiro exibe as lojas e depois os vendedores da loja selecionada.
        </p>
        
        <div className="flex justify-center">
          <ContactStoreSellersButton 
            buttonText="Fale com um Vendedor" 
            className="px-6 py-4 text-lg"
          />
        </div>
      </div>
    </div>
  )
} 