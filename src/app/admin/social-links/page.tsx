'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SocialLink } from '@/data/types';
import { useToast } from '@/components/ToastProvider';
import { socialLinkService } from '@/services/supabaseService';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminFormContainer from '@/components/AdminFormContainer';
import FormField from '@/components/FormField';
import AdminItemCard from '@/components/AdminItemCard';
import AdminTable from '@/components/AdminTable';
import { Facebook, Instagram } from 'lucide-react';

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLink, setCurrentLink] = useState<SocialLink | null>(null);
  const [platform, setPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { showToast } = useToast();

  // Carregar links ao iniciar
  useEffect(() => {
    loadSocialLinks();
  }, []);

  // Carregar links do serviço
  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      const data = await socialLinkService.getAll();
      setSocialLinks(data);
    } catch (error) {
      console.error('Erro ao carregar links de redes sociais:', error);
      showToast('Erro ao carregar links de redes sociais', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Adicionar novo link
  const handleAddInstagram = () => {
    setCurrentLink(null);
    setPlatform('instagram');
    setUrl('https://instagram.com/');
    setDescription('Siga-nos no Instagram');
    setIsActive(true);
    setIsEditing(true);
  };

  const handleAddFacebook = () => {
    setCurrentLink(null);
    setPlatform('facebook');
    setUrl('https://facebook.com/');
    setDescription('Curta nossa página no Facebook');
    setIsActive(true);
    setIsEditing(true);
  };

  // Limpar formulário
  const resetForm = () => {
    setCurrentLink(null);
    setPlatform('instagram');
    setUrl('');
    setDescription('');
    setIsActive(true);
  };

  // Cancelar edição
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  // Editar link existente
  const handleEdit = (link: SocialLink) => {
    setCurrentLink(link);
    setPlatform(link.platform);
    setUrl(link.url);
    setDescription(link.description || '');
    setIsActive(link.isActive);
    setIsEditing(true);
  };

  // Deletar link
  const handleDelete = async (link: SocialLink) => {
    if (!link.id) return;
    
    if (window.confirm(`Tem certeza que deseja excluir este link de ${getPlatformLabel(link.platform)}?`)) {
      try {
        const success = await socialLinkService.delete(link.id);
        
        if (success) {
          showToast('Link excluído com sucesso!', 'success');
          loadSocialLinks();
        } else {
          showToast('Erro ao excluir link', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir link:', error);
        showToast('Erro ao excluir link', 'error');
      }
    }
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      showToast('É necessário informar a URL', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Criar objeto do link
      const linkData: Omit<SocialLink, 'id'> = {
        platform,
        url: url.trim(),
        description: description.trim() || undefined,
        isActive
      };
      
      // Atualizar ou criar link
      if (currentLink?.id) {
        const updatedLink = await socialLinkService.update(currentLink.id, linkData);
        if (updatedLink) {
          showToast('Link atualizado com sucesso!', 'success');
        } else {
          showToast('Erro ao atualizar link', 'error');
        }
      } else {
        const newLink = await socialLinkService.add(linkData);
        if (newLink) {
          showToast('Link criado com sucesso!', 'success');
        } else {
          showToast('Erro ao criar link', 'error');
        }
      }
      
      // Recarregar lista e limpar formulário
      loadSocialLinks();
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar link:', error);
      showToast('Erro ao salvar link', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getPlatformLabel = (platform: string) => {
    return platform === 'instagram' ? 'Instagram' : 'Facebook';
  };

  const getPlatformIcon = (platform: string) => {
    return platform === 'instagram' ? (
      <Instagram className="h-5 w-5 text-pink-600" />
    ) : (
      <Facebook className="h-5 w-5 text-blue-600" />
    );
  };

  const validateUrl = (url: string, platform: string) => {
    if (platform === 'instagram') {
      return url.includes('instagram.com');
    } else if (platform === 'facebook') {
      return url.includes('facebook.com');
    }
    return true;
  };

  return (
    <AdminPageLayout title="Redes Sociais">
      {isEditing ? (
        <AdminFormContainer 
          title={currentLink?.id ? `Editar Link de ${getPlatformLabel(platform)}` : `Novo Link de ${getPlatformLabel(platform)}`}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-center space-x-3 mb-4">
              {getPlatformIcon(platform)}
              <span className="text-xl font-medium">{getPlatformLabel(platform)}</span>
            </div>

            <FormField
              label="URL"
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={`https://${platform}.com/seuusuario`}
              required
            />
            
            <FormField
              label="Descrição"
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição para este link"
            />
            
            <div className="mt-2">
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

            {url && !validateUrl(url, platform) && (
              <div className="text-orange-500 text-sm">
                Atenção: A URL não parece ser válida para {getPlatformLabel(platform)}. 
                Recomendamos incluir "{platform}.com" na URL.
              </div>
            )}
          </div>
        </AdminFormContainer>
      ) : (
        <>
          <div className="flex justify-end mb-6 space-x-3">
            <button
              onClick={handleAddInstagram}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:from-pink-600 hover:to-purple-600 flex items-center"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Adicionar Instagram
            </button>
            <button
              onClick={handleAddFacebook}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 flex items-center"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Adicionar Facebook
            </button>
          </div>

          {socialLinks.length === 0 ? (
            <AdminItemCard
              title="Nenhum link de rede social cadastrado"
              content={
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Adicione links para suas redes sociais.</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleAddInstagram}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded hover:from-pink-600 hover:to-purple-600 inline-flex items-center"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </button>
                    <button
                      onClick={handleAddFacebook}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded hover:from-blue-600 hover:to-blue-700 inline-flex items-center"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </button>
                  </div>
                </div>
              }
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ) : (
            <AdminTable
              columns={[
                { header: 'Plataforma', key: 'platform' },
                { header: 'URL', key: 'url' },
                { header: 'Descrição', key: 'description' },
                { header: 'Status', key: 'status' }
              ]}
              data={socialLinks.map(link => ({
                id: link.id,
                platform: (
                  <div className="flex items-center">
                    {getPlatformIcon(link.platform)}
                    <span className="ml-2">{getPlatformLabel(link.platform)}</span>
                  </div>
                ),
                url: (
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                ),
                description: link.description || '-',
                status: (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {link.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                )
              }))}
              actions={{
                onEdit: (row) => handleEdit(socialLinks.find(link => link.id === row.id)!),
                onDelete: (row) => handleDelete(socialLinks.find(link => link.id === row.id)!)
              }}
            />
          )}
        </>
      )}
    </AdminPageLayout>
  );
} 