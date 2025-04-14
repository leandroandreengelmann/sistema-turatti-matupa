'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
}

export default function ImageUploader({
  maxImages = 5,
  onImagesChange,
  initialImages = []
}: ImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploadMultipleImages, 
    isUploading, 
    progress, 
    error 
  } = useImageUpload();

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Validar número máximo de imagens
    if (imageUrls.length + files.length > maxImages) {
      alert(`Você pode enviar no máximo ${maxImages} imagens`);
      return;
    }
    
    // Criar previews temporárias
    const filePreviews = Array.from(files).map(file => URL.createObjectURL(file));
    
    // Adicionar as previews temporárias
    setPreviewUrls([...previewUrls, ...filePreviews]);
    
    // Fazer upload das imagens
    const uploadedUrls = await uploadMultipleImages(Array.from(files));
    
    // Se houver erro, mostrar alerta
    if (error) {
      alert(`Erro no upload: ${error}`);
      // Remover as últimas previews adicionadas
      setPreviewUrls(prev => prev.slice(0, prev.length - files.length));
      return;
    }
    
    // Atualizar URLs das imagens salvas
    const newImageUrls = [...imageUrls, ...uploadedUrls];
    setImageUrls(newImageUrls);
    
    // Revogar URLs temporárias
    filePreviews.forEach(url => URL.revokeObjectURL(url));
    
    // Atualizar previews com URLs definitivas
    setPreviewUrls(newImageUrls);
    
    // Notificar o componente pai
    onImagesChange(newImageUrls);
    
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Remover URL de preview
    if (previewUrls[index]) {
      // Se for uma URL temporária (blob:), revogar
      if (previewUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(previewUrls[index]);
      }
    }
    
    // Remover dos arrays
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    setImageUrls(newImageUrls);
    
    // Notificar o componente pai
    onImagesChange(newImageUrls);
  };

  return (
    <div className="w-full">
      {/* Previews de imagens */}
      <div className="flex flex-wrap gap-4 mb-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden">
            <img 
              src={url} 
              alt={`Imagem ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              disabled={isUploading}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {/* Botão de adicionar imagem */}
        {previewUrls.length < maxImages && (
          <label className={`flex items-center justify-center w-24 h-24 border-2 border-dashed 
            ${isUploading ? 'border-blue-300 bg-blue-50 cursor-wait' : 'border-gray-300 hover:bg-gray-50 cursor-pointer'}`}
            style={{ borderRadius: '0.375rem' }}
          >
            <div className="flex flex-col items-center">
              {isUploading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-t-blue-500 animate-spin"></div>
                  <span className="text-xs text-gray-500 mt-1">{progress}%</span>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Adicionar</span>
                </>
              )}
            </div>
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      
      {/* Mensagens de erro */}
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      
      {/* Texto de ajuda */}
      <p className="text-sm text-gray-500">
        Adicione até {maxImages} imagens do produto. A primeira imagem será usada como destaque.
        {isUploading && ' Fazendo upload...'}
      </p>
    </div>
  );
} 