"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '@/services/authService';
import { 
  Home, Package, LayersIcon, Palette, Store, Users, 
  Image, LogOut, Menu, X, ChevronDown, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminPageLayoutProps {
  title: string;
  children: React.ReactNode;
  backLink?: string;
  hasBackButton?: boolean;
}

export default function AdminPageLayout({ 
  title, 
  children, 
  backLink, 
  hasBackButton 
}: AdminPageLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalogoExpanded, setCatalogoExpanded] = useState(true);
  const [configuracoesExpanded, setConfiguracoesExpanded] = useState(false);

  // Função para realizar logout
  const handleLogout = async () => {
    const { success } = await authService.logout();
    if (success) {
      router.push('/admin/login');
    }
  };

  // Função para verificar se um link está ativo
  const isLinkActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para mobile (overlay) */}
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <h1 className="text-xl font-bold">Turatti Admin</h1>
          <button 
            className="p-1 rounded-md lg:hidden hover:bg-blue-700" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          <Link 
            href="/admin" 
            className={`flex items-center px-4 py-2 my-1 rounded-md ${
              isLinkActive('/admin') ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Home size={20} className="mr-3" />
            <span>Dashboard</span>
          </Link>

          {/* Seção de Catálogo */}
          <div className="mb-2">
            <button 
              className="flex items-center justify-between w-full px-4 py-2 text-left rounded-md hover:bg-blue-700"
              onClick={() => setCatalogoExpanded(!catalogoExpanded)}
            >
              <div className="flex items-center">
                <Package size={20} className="mr-3" />
                <span>Catálogo</span>
              </div>
              {catalogoExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {catalogoExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                <Link 
                  href="/admin/produtos" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/produtos') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Produtos</span>
                </Link>
                <Link 
                  href="/admin/categorias" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/categorias') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Categorias</span>
                </Link>
                <Link 
                  href="/admin/subcategorias" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/subcategorias') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Subcategorias</span>
                </Link>
                <Link 
                  href="/admin/colecoes-cores" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/colecoes-cores') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Coleções de Cores</span>
                </Link>
                <Link 
                  href="/admin/cores" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/cores') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Cores</span>
                </Link>
              </div>
            )}
          </div>

          <Link 
            href="/admin/banners" 
            className={`flex items-center px-4 py-2 my-1 rounded-md ${
              isLinkActive('/admin/banners') ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Image size={20} className="mr-3" />
            <span>Banners</span>
          </Link>

          <Link 
            href="/admin/lojas" 
            className={`flex items-center px-4 py-2 my-1 rounded-md ${
              isLinkActive('/admin/lojas') ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Store size={20} className="mr-3" />
            <span>Lojas</span>
          </Link>

          <Link 
            href="/admin/vendedores" 
            className={`flex items-center px-4 py-2 my-1 rounded-md ${
              isLinkActive('/admin/vendedores') ? 'bg-blue-700' : 'hover:bg-blue-700'
            }`}
          >
            <Users size={20} className="mr-3" />
            <span>Vendedores</span>
          </Link>

          {/* Seção de Configurações */}
          <div className="mb-2 mt-4">
            <button 
              className="flex items-center justify-between w-full px-4 py-2 text-left rounded-md hover:bg-blue-700"
              onClick={() => setConfiguracoesExpanded(!configuracoesExpanded)}
            >
              <div className="flex items-center">
                <LayersIcon size={20} className="mr-3" />
                <span>Configurações</span>
              </div>
              {configuracoesExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {configuracoesExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                <Link 
                  href="/admin/logos" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/logos') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Logos</span>
                </Link>
                <Link 
                  href="/admin/social-links" 
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isLinkActive('/admin/social-links') ? 'bg-blue-700' : 'hover:bg-blue-700'
                  }`}
                >
                  <span>Links Sociais</span>
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-8 text-left text-red-300 rounded-md hover:bg-blue-700 hover:text-white"
          >
            <LogOut size={20} className="mr-3" />
            <span>Sair</span>
          </button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shadow-sm">
          <button 
            className="p-1 mr-4 lg:hidden" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center">
            {hasBackButton && backLink && (
              <Link href={backLink} className="mr-3 text-blue-600 hover:text-blue-800">
                <span className="flex items-center">
                  <ChevronRight className="transform rotate-180" size={20} />
                  <span className="ml-1">Voltar</span>
                </span>
              </Link>
            )}
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 