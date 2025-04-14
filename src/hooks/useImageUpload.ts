import { useState } from 'react';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Faz upload de um arquivo para o servidor
   * @param file O arquivo a ser enviado
   * @returns A URL da imagem após o upload ou null em caso de erro
   */
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    // Resetar estados
    setIsUploading(true);
    setProgress(0);
    setError(null);
    
    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('O arquivo deve ser uma imagem');
      setIsUploading(false);
      return null;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulação de progresso (já que fetch não tem suporte nativo a progresso)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 100);
      
      // Enviar requisição para a API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }
      
      const data: UploadResponse = await response.json();
      
      if (!data.success || !data.url) {
        throw new Error(data.error || 'Falha no upload');
      }
      
      setProgress(100);
      return data.url;
      
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido durante o upload');
      console.error('Erro no upload:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  /**
   * Faz upload de múltiplos arquivos
   * @param files Array de arquivos para upload
   * @returns Array com as URLs das imagens enviadas com sucesso
   */
  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    
    const uploadPromises = files.map(file => uploadImage(file));
    const results = await Promise.all(uploadPromises);
    
    // Filtrar resultados null (falhas)
    return results.filter(url => url !== null) as string[];
  };
  
  return {
    uploadImage,
    uploadMultipleImages,
    isUploading,
    progress,
    error
  };
}; 