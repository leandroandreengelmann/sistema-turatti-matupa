'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Banner } from '@/data/types';
import { bannerService } from '@/services/supabaseService';
import AdminPageLayout from '@/components/AdminPageLayout';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar banners ao iniciar
  useEffect(() => {
    loadBanners();
  }, []);

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

  // Carregar banners do serviço
  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannerService.getAll();
      // Mapear os dados para o formato esperado pela interface
      const mappedBanners = data.map(mapBannerData);
      setBanners(mappedBanners);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      toast.error('Erro ao carregar banners');
    } finally {
      setLoading(false);
    }
  };

  // Alternar status do banner (ativo/inativo)
  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const updatedBanner = await bannerService.update(banner.id, {
        isActive: !banner.isActive
      });
      
      if (updatedBanner) {
        // Atualizar o estado local com o banner atualizado
        setBanners(prev => 
          prev.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b)
        );
        
        toast.success(`Banner ${banner.isActive ? 'desativado' : 'ativado'} com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao atualizar status do banner:', error);
      toast.error('Falha ao atualizar o status do banner');
    }
  };

  if (loading) {
    return (
      <AdminPageLayout title="Gerenciamento de Banners">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout title="Gerenciamento de Banners">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Banners</h2>
        <Link
          href="/admin/banners/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="mr-1" />
          Novo Banner
        </Link>
      </div>
      
      {banners.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nenhum banner encontrado</h2>
          <p className="text-gray-500 mb-6">
            Comece adicionando um novo banner para exibir em seu site.
          </p>
          <Link 
            href="/admin/banners/novo" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Banner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={banner.imageUrl}
                  alt="Banner"
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Ordem: {banner.order || 0}</span>
                  </div>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {banner.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/banners/${banner.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </Link>
                    <Link
                      href={`/admin/banners/excluir/${banner.id}`}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => toggleBannerStatus(banner)}
                    className={`p-2 rounded ${
                      banner.isActive 
                        ? 'text-gray-600 hover:bg-gray-50' 
                        : 'text-gray-600 hover:bg-green-50'
                    }`}
                    title={banner.isActive ? 'Desativar' : 'Ativar'}
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
} 