'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ProductImage } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { productService } from '@/services/localDataService';
import AdminForm, { FormField, Input, Textarea, FormSection } from '@/components/AdminForm';
import { ImagePlus, X } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dados do formulário
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [isPromotion, setIsPromotion] = useState(false);
  const [description, setDescription] = useState('');
  
  // Estado do formulário
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Manipular seleção de arquivos
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const filesArray = Array.from(files);
    setSelectedFiles(prev => [...prev, ...filesArray]);
    
    // Criar URLs para preview
    const newPreviews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };
  
  // Remover imagem
  const handleRemoveImage = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    
    const newPreviews = [...previewUrls];
    newPreviews.splice(index, 1);
    setPreviewUrls(newPreviews);
  };
  
  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !description) {
      showToast('Preencha todos os campos obrigatórios', 'error');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Criar array de imagens
      let productImages: ProductImage[] = [];
      
      // Se há arquivos selecionados, criar imagens a partir deles
      if (selectedFiles.length > 0) {
        productImages = selectedFiles.map((file, index) => {
          const url = URL.createObjectURL(file);
          return {
            highResolution: url,
            standard: url,
            thumbnail: url,
            isMain: index === 0 // A primeira imagem é a principal
          };
        });
      } else {
        // Se não houver imagens, definir uma imagem padrão
        productImages.push({
          highResolution: 'https://picsum.photos/800/600',
          standard: 'https://picsum.photos/400/300',
          thumbnail: 'https://picsum.photos/200/150',
          isMain: true
        });
      }
      
      // Criar novo produto
      const newProduct = await productService.add({
        name,
        price: parseFloat(price),
        promoPrice: isPromotion && promoPrice ? parseFloat(promoPrice) : undefined,
        isPromotion,
        description,
        images: productImages
      });
      
      if (newProduct) {
        showToast('Produto adicionado com sucesso!', 'success');
        router.push('/admin/products');
      } else {
        showToast('Erro ao adicionar produto', 'error');
      }
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      showToast('Erro ao adicionar produto', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <AdminForm
      title="Adicionar Novo Produto"
      backLink="/admin/products"
      onSubmit={handleSubmit}
      isLoading={submitting}
    >
      {/* Seção de imagens */}
      <FormSection
        title="Imagens do Produto"
        description="Adicione uma ou mais imagens do produto. A primeira imagem será usada como principal."
      >
        <div className="col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                <Image
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                  <X className="w-4 h-4" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs py-1 px-2 text-center">
                    Principal
                  </div>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-500">Adicionar</span>
            </button>
          </div>
          
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      </FormSection>
      
      {/* Informações básicas */}
      <FormSection
        title="Informações Básicas"
        description="Preencha as informações essenciais do produto."
      >
        <FormField label="Nome do Produto*">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
            required
          />
        </FormField>
        
        <FormField label="Preço (R$)*">
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0,00"
            step="0.01"
            min="0"
            required
          />
        </FormField>
        
        <div className="col-span-2">
          <FormField label="Descrição*">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o produto..."
              rows={4}
              required
            />
          </FormField>
        </div>
      </FormSection>
      
      {/* Promoção */}
      <FormSection
        title="Informações de Promoção"
        description="Configure se o produto está em promoção e seu preço promocional."
      >
        <div className="col-span-2 flex items-start space-x-3">
          <input
            type="checkbox"
            id="isPromotion"
            checked={isPromotion}
            onChange={(e) => setIsPromotion(e.target.checked)}
            className="mt-1.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <label htmlFor="isPromotion" className="font-medium text-gray-700">
              Produto em Promoção
            </label>
            <p className="text-sm text-gray-500">
              Marque esta opção se o produto estiver em promoção
            </p>
          </div>
        </div>
        
        {isPromotion && (
          <div className="col-span-2">
            <FormField label="Preço Promocional (R$)*">
              <Input
                type="number"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                placeholder="0,00"
                step="0.01"
                min="0"
                required={isPromotion}
              />
            </FormField>
          </div>
        )}
      </FormSection>
    </AdminForm>
  );
} 