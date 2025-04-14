'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Palette, 
  Image, 
  Store, 
  Users, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X 
} from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { authService } from '@/services/authService';

// Tipo para item do menu
interface MenuItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Verificar se estamos na página de login
  const isLoginPage = pathname === '/admin/login';

  // Não aplicar o AuthGuard na página de login
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Menu de navegação
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
    },
    {
      title: 'Produtos',
      href: '/admin/produtos',
      icon: <ShoppingBag className="mr-3 h-5 w-5" />,
    },
    {
      title: 'Coleções de Cores',
      href: '/admin/colecoes',
      icon: <Palette className="mr-3 h-5 w-5" />,
    },
    {
      title: 'Banners',
      href: '/admin/banners',
      icon: <Image className="mr-3 h-5 w-5" />,
    },
    {
      title: 'Lojas',
      href: '/admin/lojas',
      icon: <Store className="mr-3 h-5 w-5" />,
    },
    {
      title: 'Vendedores',
      href: '/admin/vendedores',
      icon: <Users className="mr-3 h-5 w-5" />,
    },
  ];

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/admin/login';
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar para mobile */}
        <div className="lg:hidden">
          {sidebarOpen ? (
            <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75">
              <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white">
                <div className="flex items-center justify-between px-4 py-5">
                  <div className="text-xl font-bold">Painel Admin</div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="mt-5 px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="mt-4 flex w-full items-center rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sair
                  </button>
                </nav>
              </div>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setSidebarOpen(false)}
              ></div>
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="fixed left-4 top-4 z-40 rounded-md bg-white p-2 shadow-md"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          )}
        </div>

        {/* Sidebar para desktop */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="text-xl font-bold">Painel Admin</h1>
                </div>
                <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        pathname === item.href
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {item.icon}
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                <div className="flex w-full items-center">
                  <div className="relative inline-block w-full text-left">
                    <div>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="group flex w-full items-center rounded-md bg-white px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <div className="mr-3 h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium">A</span>
                        </div>
                        <span className="flex flex-1 truncate">Admin</span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 group-hover:text-gray-500 ${
                            dropdownOpen ? 'rotate-180 transform' : ''
                          }`}
                        />
                      </button>
                    </div>
                    {dropdownOpen && (
                      <div className="absolute bottom-0 left-0 right-0 z-10 mb-12 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sair
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 