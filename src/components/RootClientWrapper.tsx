'use client';

import { ToastProvider } from './ToastProvider';
import ClientLayout from './ClientLayout';
import { Suspense } from 'react';
import CookieManager from './CookieManager';

interface RootClientWrapperProps {
  children: React.ReactNode;
}

export default function RootClientWrapper({ children }: RootClientWrapperProps) {
  return (
    <Suspense fallback={null}>
      <ToastProvider>
        <ClientLayout>
          {children}
          <CookieManager />
        </ClientLayout>
      </ToastProvider>
    </Suspense>
  );
} 