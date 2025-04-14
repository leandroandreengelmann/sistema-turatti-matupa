'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Verificar se estamos em uma rota pública
      if (pathname === '/admin/login') {
        setLoading(false);
        setAuthenticated(true);
        return;
      }

      try {
        const isAuth = await authService.isAuthenticated();
        
        if (!isAuth && pathname.startsWith('/admin')) {
          // Se não estiver autenticado e tentar acessar área administrativa, redirecionar para login
          router.replace('/admin/login');
        } else {
          setAuthenticated(isAuth || !pathname.startsWith('/admin'));
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (pathname.startsWith('/admin')) {
          router.replace('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return children;
} 