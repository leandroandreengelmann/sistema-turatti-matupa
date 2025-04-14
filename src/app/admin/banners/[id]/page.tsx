'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save } from 'lucide-react';
import { bannerService } from '@/services/supabaseService';
import { Banner } from '@/data/types';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-toastify';

// Mapeamento dos dados do banco de dados para o formato da interface
const mapBannerData = (dbBanner: any): Banner => {
  return {
    id: dbBanner.id,
    imageUrl: dbBanner.imageurl || dbBanner.imageUrl,
    isActive: dbBanner.isactive !== undefined ? dbBanner.isactive : dbBanner.isActive,
    order: dbBanner.order,
    createdAt: dbBanner.createdat || dbBanner.createdAt,
    updatedAt: dbBanner.updatedat || dbBanner.updatedAt
  };
};

export default function EditarBannerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bannerId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Carregar dados do banner
  useEffect(() => {
    const loadBanner = async () => {
      try {
        setLoading(true);
        const banner = await bannerService.getById(bannerId);
        
        if (!banner) {
          setNotFound(true);
          return;
        }
        
        // Mapear os dados do banco para o formato esperado pela interface
        const mappedBanner = mapBannerData(banner);
        
        setIsActive(mappedBanner.isActive);
        setOrder(mappedBanner.order || 0);
        setImageUrl(mappedBanner.imageUrl);
        setPreviewUrl(mappedBanner.imageUrl);
      } catch (error) {
        console.error('Erro ao carregar banner:', error);
        toast.error('Erro ao carregar dados do banner');
      } finally {
        setLoading(false);
      }
    };
    
    if (bannerId) {
      loadBanner();
    }
  }, [bannerId]);
  
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
      toast.error('É necessário selecionar uma imagem');
      return;
    }

    try {
      setSubmitting(true);
      
      // Criar objeto do banner
      const bannerData: Partial<Banner> = {
        imageUrl: selectedFile ? previewUrl : imageUrl,
        isActive,
        order: Number(order) || 0
      };
      
      // Atualizar banner
      const updatedBanner = await bannerService.update(bannerId, bannerData);
      
      if (updatedBanner) {
        toast.success('Banner atualizado com sucesso!');
        router.push('/admin/banners');
      } else {
        toast.error('Erro ao atualizar banner');
      }
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      toast.error('Erro ao atualizar banner');
    } finally {
      setSubmitting(false);
    }
  };

  // Se o banner não foi encontrado
  if (notFound && !loading) {
    return (
      <AdminPageLayout title="Banner não encontrado">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Banner não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O banner que você está tentando editar não existe ou foi removido.
          </p>
          <Link 
            href="/admin/banners" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Voltar para Banners
          </Link>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Editar Banner">
      <div className="mb-6 flex items-center">
        <Link
          href="/admin/banners"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Voltar para Banners
        </Link>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Carregando dados do banner...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Imagem do Banner */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Imagem do Banner <span className="text-red-600">*</span>
              </label>
              {previewUrl ? (
                <div className="relative h-48 mb-4 rounded overflow-hidden border border-gray-200">
                  <Image
                    src={previewUrl}
                    alt="Preview do banner"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center rounded mb-4 border-2 border-dashed border-gray-300">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
              >
                {previewUrl ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </button>
            </div>
            
            {/* Ordem */}
            <div className="mb-6">
              <label htmlFor="order" className="block text-gray-700 font-medium mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                id="order"
                min="0"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                A ordem define a sequência em que os banners serão exibidos. Banners com ordem menor aparecem primeiro.
              </p>
            </div>
            
            {/* Status */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-gray-700">
                  Banner ativo
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Banners inativos não são exibidos no site.
              </p>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/admin/banners"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-2"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={submitting || (!previewUrl && !imageUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-1" />
                    Atualizar Banner
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminPageLayout>
  );
} 