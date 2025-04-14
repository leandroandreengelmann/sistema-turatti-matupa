import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Inter } from 'next/font/google';
import RootClientWrapper from '../components/RootClientWrapper';

const geistSans = GeistSans;
const geistMono = GeistMono;

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Turatti Store - Materiais de Construção',
  description: 'Encontre produtos de qualidade para sua obra ou reforma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-gray-50 min-h-screen`} suppressHydrationWarning>
        <RootClientWrapper>
          {children}
        </RootClientWrapper>
      </body>
    </html>
  );
}
