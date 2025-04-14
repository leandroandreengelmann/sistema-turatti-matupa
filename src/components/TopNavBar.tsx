'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';

export default function TopNavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const mainMenuItems = [
    { name: 'Início', href: '/' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Categorias', href: '/categorias' },
    { name: 'Paletas 2025', href: '/paletas/2025' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="h-10 w-32 relative">
                <Image 
                  src="/logo.png" 
                  alt="Logo Turatti" 
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search, User & Cart */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className="text-gray-700 hover:text-blue-600 transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="container mx-auto py-3 space-y-2">
            {mainMenuItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 