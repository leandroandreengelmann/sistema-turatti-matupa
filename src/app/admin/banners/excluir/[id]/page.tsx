'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
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

export default function ExcluirBannerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const bannerId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  
  // Carregar dados do banner
  useEffect(() => {
    const loadBanner = async () => {
      try {
        setLoading(true);
        const data = await bannerService.getById(bannerId);
        
        if (!data) {
          setNotFound(true);
          return;
        }
        
        // Mapear os dados do banco para o formato esperado pela interface
        const mappedBanner = mapBannerData(data);
        setBanner(mappedBanner);
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
  
  // Excluir banner
  const handleDelete = async () => {
    if (!banner) return;
    
    try {
      setDeleting(true);
      const success = await bannerService.delete(bannerId);
      
      if (success) {
        toast.success('Banner excluído com sucesso!');
        router.push('/admin/banners');
      } else {
        toast.error('Erro ao excluir banner');
      }
    } catch (error) {
      console.error('Erro ao excluir banner:', error);
      toast.error('Erro ao excluir banner');
    } finally {
      setDeleting(false);
    }
  };

  // Se o banner não foi encontrado
  if (notFound && !loading) {
    return (
      <AdminPageLayout title="Banner não encontrado">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Banner não encontrado</h2>
          <p className="text-gray-600 mb-6">
            O banner que você está tentando excluir não existe ou já foi removido.
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
    <AdminPageLayout title="Excluir Banner">
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
          <div className="flex flex-col items-center p-6 text-center">
            <AlertTriangle size={64} className="text-red-500 mb-4" />
            
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Confirmar Exclusão
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-lg">
              Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.
            </p>
            
            {banner && (
              <div className="mb-8 w-full max-w-md">
                <div className="relative h-48 mb-4 rounded overflow-hidden border border-gray-200">
                  <Image
                    src={banner.imageUrl}
                    alt="Banner a ser excluído"
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-500 text-left">Status:</div>
                    <div className="text-right font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    
                    <div className="text-gray-500 text-left">Ordem:</div>
                    <div className="text-right font-medium">{banner.order || 0}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-4">
              <Link
                href="/admin/banners"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium flex items-center disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} className="mr-1" />
                    Confirmar Exclusão
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
} 