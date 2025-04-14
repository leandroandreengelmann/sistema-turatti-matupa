'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FooterImage } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { footerImageService } from '@/services/localDataService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

export default function AdminFooterImagesPage() {
  const [footerImages, setFooterImages] = useState<FooterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<FooterImage | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar imagens ao iniciar
  useEffect(() => {
    loadFooterImages();
  }, []);

  // Carregar imagens do serviço
  const loadFooterImages = async () => {
    try {
      setLoading(true);
      const data = await footerImageService.getAll();
      setFooterImages(data);
    } catch (error) {
      console.error('Erro ao carregar imagens de rodapé:', error);
      showToast('Erro ao carregar imagens de rodapé', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar nova imagem
  const handleAddNew = () => {
    setCurrentImage(null);
    setIsActive(true);
    setAltText('');
    setDescription('');
    setImageUrl('');
    setOrder(footerImages.length + 1);
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditing(true);
  };

  // Limpar formulário
  const resetForm = () => {
    setCurrentImage(null);
    setIsActive(true);
    setAltText('');
    setDescription('');
    setImageUrl('');
    setOrder(1);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  // Editar imagem existente
  const handleEdit = (image: FooterImage) => {
    setCurrentImage(image);
    setIsActive(image.isActive);
    setAltText(image.altText || '');
    setDescription(image.description || '');
    setImageUrl(image.imageUrl);
    setOrder(image.order || 1);
    setPreviewUrl(image.imageUrl);
    setIsEditing(true);
  };

  // Deletar imagem
  const handleDelete = async (image: FooterImage) => {
    if (!image.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir esta imagem de rodapé?`)) {
      try {
        const success = await footerImageService.delete(image.id);
        
        if (success) {
          showToast('Imagem excluída com sucesso!', 'success');
          loadFooterImages();
          resetForm();
        } else {
          showToast('Erro ao excluir imagem', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        showToast('Erro ao excluir imagem', 'error');
      }
    }
  };

  // Manipular seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Criar URL para preview
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl && !imageUrl) {
      showToast('É necessário selecionar uma imagem', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Criar objeto da imagem
      const imageData: Omit<FooterImage, 'id'> = {
        imageUrl: selectedFile ? previewUrl : imageUrl,
        isActive,
        type: 'payment', // Definindo um tipo padrão
        order,
        altText: altText.trim() || undefined,
        description: description.trim() || undefined
      };
      
      // Atualizar ou criar imagem
      if (currentImage?.id) {
        const updatedImage = await footerImageService.update(currentImage.id, imageData);
        if (updatedImage) {
          showToast('Imagem atualizada com sucesso!', 'success');
        } else {
          showToast('Erro ao atualizar imagem', 'error');
        }
      } else {
        const newImage = await footerImageService.add(imageData);
        if (newImage) {
          showToast('Imagem criada com sucesso!', 'success');
        } else {
          showToast('Erro ao criar imagem', 'error');
        }
      }
      
      // Recarregar lista e limpar formulário
      loadFooterImages();
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      showToast('Erro ao salvar imagem', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Componente de imagem de rodapé
  const FooterImageField = () => (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2 font-inter">
        Imagem de Rodapé
      </label>
      {previewUrl ? (
        <div className="relative h-32 w-auto max-w-xs flex items-center justify-center mb-2 border rounded-lg p-4 bg-white">
          <Image
            src={previewUrl}
            alt="Preview da imagem"
            width={200}
            height={100}
            className="object-contain max-h-full"
          />
        </div>
      ) : (
        <div className="h-32 bg-gray-200 flex items-center justify-center rounded mb-2 max-w-xs">
          <span className="text-gray-500">Nenhuma imagem selecionada</span>
        </div>
      )}
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
      >
        Selecionar Imagem
      </button>
    </div>
  );

  return (
    <AdminPageLayout title="Imagens de Rodapé">
      {isEditing ? (
        <AdminFormContainer 
          title={currentImage?.id ? "Editar Imagem" : "Nova Imagem"}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FooterImageField />
                
                <FormField
                  label="Posição"
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value))}
                  required
                  min={1}
                  placeholder="Ordem de exibição no rodapé"
                />
                
                <FormField
                  label="Texto Alternativo"
                  id="altText"
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descrição da imagem para acessibilidade"
                />
              </div>
              
              <div>
                <FormField
                  label="Descrição"
                  id="description"
                  type="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Informações adicionais sobre esta imagem"
                />
                
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex items-center mt-2">
                    <label htmlFor="isActive" className="inline-flex items-center cursor-pointer">
                      <input
                        id="isActive"
                        type="checkbox"
                        className="sr-only peer"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700 hover:bg-gray-50"
                disabled={submitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded shadow-sm text-white hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? 'Salvando...' : currentImage?.id ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </AdminFormContainer>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">+</span> Nova Imagem
            </button>
          </div>

          {footerImages.length === 0 ? (
            <AdminItemCard
              title="Nenhuma imagem cadastrada"
              content={
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Nenhuma imagem de rodapé cadastrada.</p>
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
                  >
                    <span className="mr-2">+</span> Adicionar Primeira Imagem
                  </button>
                </div>
              }
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : (
            <AdminTable
              columns={[
                { header: 'Imagem', key: 'image' },
                { header: 'Posição', key: 'position' },
                { header: 'Status', key: 'status' },
                { header: 'Texto Alt', key: 'alt' }
              ]}
              data={footerImages.map(image => ({
                id: image.id,
                image: (
                  <div className="relative h-16 w-auto flex items-center">
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || 'Imagem de rodapé'}
                      width={80}
                      height={40}
                      className="object-contain max-h-full"
                    />
                  </div>
                ),
                position: image.order || 1,
                status: (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    image.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {image.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                ),
                alt: image.altText || '-'
              }))}
              actions={{
                onEdit: (row) => handleEdit(footerImages.find(img => img.id === row.id)!),
                onDelete: (row) => handleDelete(footerImages.find(img => img.id === row.id)!)
              }}
            />
          )}
        </>
      )}
    </AdminPageLayout>
  );
} 