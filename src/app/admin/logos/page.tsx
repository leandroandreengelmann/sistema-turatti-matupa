'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Logo } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { logoService } from '@/services/supabaseService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';

export default function AdminLogosPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLogo, setCurrentLogo] = useState<Logo | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [logoType, setLogoType] = useState<'primary' | 'secondary' | 'mobile' | 'favicon'>('primary');
  const [altText, setAltText] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar logos ao iniciar
  useEffect(() => {
    loadLogos();
  }, []);

  // Carregar logos do serviço
  const loadLogos = async () => {
    try {
      setLoading(true);
      const data = await logoService.getAll();
      setLogos(data);
    } catch (error) {
      console.error('Erro ao carregar logos:', error);
      showToast('Erro ao carregar logos', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo logo
  const handleAddNew = () => {
    setCurrentLogo(null);
    setIsActive(true);
    setLogoType('primary');
    setAltText('');
    setDescription('');
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditing(true);
  };

  // Limpar formulário
  const resetForm = () => {
    setCurrentLogo(null);
    setIsActive(true);
    setLogoType('primary');
    setAltText('');
    setDescription('');
    setImageUrl('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  // Editar logo existente
  const handleEdit = (logo: Logo) => {
    setCurrentLogo(logo);
    setIsActive(logo.isActive);
    setLogoType(logo.type as 'primary' | 'secondary' | 'mobile' | 'favicon');
    setAltText(logo.altText || '');
    setDescription(logo.description || '');
    setImageUrl(logo.imageUrl);
    setPreviewUrl(logo.imageUrl);
    setIsEditing(true);
  };

  // Deletar logo
  const handleDelete = async (logo: Logo) => {
    if (!logo.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir este logo?`)) {
      try {
        const success = await logoService.delete(logo.id);
        
        if (success) {
          showToast('Logo excluído com sucesso!', 'success');
          loadLogos();
          resetForm();
        } else {
          showToast('Erro ao excluir logo', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir logo:', error);
        showToast('Erro ao excluir logo', 'error');
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
      
      // Upload da imagem, se foi selecionada uma nova
      let finalImageUrl = imageUrl;
      if (selectedFile) {
        try {
          finalImageUrl = await logoService.uploadLogoImage(selectedFile);
        } catch (error) {
          console.error('Erro ao fazer upload do logo:', error);
          showToast('Erro ao fazer upload da imagem. Tente novamente.', 'error');
          setSubmitting(false);
          return;
        }
      }
      
      // Criar objeto do logo
      const logoData: Omit<Logo, 'id'> = {
        imageUrl: finalImageUrl,
        type: logoType,
        isActive,
        altText: altText.trim() || undefined,
        description: description.trim() || undefined
      };
      
      // Atualizar ou criar logo
      if (currentLogo?.id) {
        const updatedLogo = await logoService.update(currentLogo.id, logoData);
        if (updatedLogo) {
          showToast('Logo atualizado com sucesso!', 'success');
        } else {
          showToast('Erro ao atualizar logo', 'error');
        }
      } else {
        const newLogo = await logoService.add(logoData);
        if (newLogo) {
          showToast('Logo criado com sucesso!', 'success');
        } else {
          showToast('Erro ao criar logo', 'error');
        }
      }
      
      // Recarregar lista e limpar formulário
      loadLogos();
      resetForm();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar logo:', error);
      showToast('Erro ao salvar logo', 'error');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Componente de imagem do logo
  const LogoImageField = () => (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2 font-inter">
        Imagem do Logo
      </label>
      {previewUrl ? (
        <div className="relative h-32 w-auto max-w-xs flex items-center justify-center mb-2 border rounded-lg p-4 bg-white">
          <Image
            src={previewUrl}
            alt="Preview do logo"
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

  const getLogoTypeLabel = (type: string) => {
    switch(type) {
      case 'primary': return 'Principal';
      case 'secondary': return 'Secundário';
      case 'mobile': return 'Mobile';
      case 'favicon': return 'Favicon';
      default: return type;
    }
  };

  return (
    <AdminPageLayout title="Gestão de Logos">
      {isEditing ? (
        <AdminFormContainer 
          title={currentLogo?.id ? "Editar Logo" : "Novo Logo"}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LogoImageField />
              
              <div className="mb-4">
                <label className="block text-lg text-gray-700 mb-2">
                  Tipo <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={logoType}
                  onChange={(e) => setLogoType(e.target.value as any)}
                  required
                >
                  <option value="primary">Principal</option>
                  <option value="secondary">Secundário</option>
                  <option value="mobile">Mobile</option>
                  <option value="favicon">Favicon</option>
                </select>
              </div>
              
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
                placeholder="Informações adicionais sobre este logo"
                rows={5}
              />
              
              <div className="mt-6">
                <label className="block text-lg text-gray-700 mb-2">
                  Status <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex items-center mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
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
        </AdminFormContainer>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <span className="mr-2">+</span> Novo Logo
            </button>
          </div>

          {logos.length === 0 ? (
            <AdminItemCard
              title="Nenhum logo cadastrado"
              content={
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Nenhum logo cadastrado.</p>
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
                  >
                    <span className="mr-2">+</span> Adicionar Primeiro Logo
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
                { header: 'Tipo', key: 'type' },
                { header: 'Status', key: 'status' },
                { header: 'Texto Alt', key: 'alt' }
              ]}
              data={logos.map(logo => ({
                id: logo.id,
                image: (
                  <div className="relative h-16 w-auto flex items-center">
                    <Image
                      src={logo.imageUrl}
                      alt={logo.altText || 'Logo'}
                      width={80}
                      height={40}
                      className="object-contain max-h-full"
                    />
                  </div>
                ),
                type: getLogoTypeLabel(logo.type),
                status: (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    logo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {logo.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                ),
                alt: logo.altText || '-'
              }))}
              actions={{
                onEdit: (row) => handleEdit(logos.find(logo => logo.id === row.id)!),
                onDelete: (row) => handleDelete(logos.find(logo => logo.id === row.id)!)
              }}
            />
          )}
        </>
      )}
    </AdminPageLayout>
  );
} 