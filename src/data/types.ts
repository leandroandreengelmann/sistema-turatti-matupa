// Data models for Turatti store

// Product image model
export interface ProductImage {
  id?: string;
  standard: string;
  highResolution?: string;
  thumbnail?: string;
  isMain?: boolean;
}

// Product model
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalprice?: number;
  discountPercentage?: number;
  images: (ProductImage | string)[];
  category?: ProductCategory;
  features?: string[];
  rating?: number;
  reviewCount?: number;
  brand?: string;
  sku?: string;
  ispromotion: boolean;
  active: boolean;
  isnew: boolean;
  sellerName: string;
  categoryId?: string;
  subcategoryId?: string;
  ispaint?: boolean;
  colorId?: string;
  color?: Color;
  ismonthpromotion?: boolean;
  isfeatured?: boolean;
}

// Category model
export interface Category {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  ismainmenu?: boolean; // Indica se a categoria deve aparecer no menu principal
  featured?: boolean;    // Indica se a categoria deve aparecer como destaque
  createdAt?: string;
  updatedAt?: string;
}

// Subcategory model
export interface Subcategory {
  id: string;
  name: string;
  categoryid: string; // ID da categoria pai
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Banner model
export interface Banner {
  id: string;
  imageUrl: string;     // URL para a imagem do banner
  isactive: boolean;    // Indica se o banner está ativo
  order?: number;       // Ordem de exibição para múltiplos banners
  createdAt?: string;
  updatedAt?: string;
}

// Color Collection model
export interface ColorCollection {
  id: string;
  name: string;
  representativeColor?: string;
  imageUrl?: string;
  description: string;
  active?: boolean;     // Indica se a coleção está ativa
  createdAt?: string;
  updatedAt?: string;
}

// Color model
export interface Color {
  id: string;
  name: string;
  collectionId?: string;
  collectionid?: string; // Versão minúscula como no banco
  hexCode?: string;
  hexcode?: string;     // Versão minúscula como no banco
  hex?: string;         // Código hexadecimal da cor (ex: #FF0000)
  rgb?: string;         // Código RGB da cor (ex: rgb(255, 0, 0))
  red?: number;         // Componente vermelho (0-255)
  green?: number;       // Componente verde (0-255)
  blue?: number;        // Componente azul (0-255)
  ncs?: string;         // Código NCS (Natural Color System)
  active?: boolean;     // Se a cor está ativa
  createdAt?: string;
  updatedAt?: string;
}

// Store model
export interface Store {
  id: string;
  name: string;
  city: string;
  phone: string;
  hours?: string;
  iconUrl?: string;     // URL para o ícone da loja
  isactive?: boolean;   // Indica se a loja está ativa
  createdAt?: string;
  updatedAt?: string;
}

// Seller model (Vendedor)
export interface Seller {
  id: string;
  name: string;
  storeId: string;      // ID da loja a qual o vendedor está associado
  storeid?: string;     // Variação com letra minúscula (conforme DB)
  whatsapp: string;     // Número do WhatsApp do vendedor (com código do país)
  isactive?: boolean;   // Indica se o vendedor está ativo
  isActive?: boolean;   // Versão alternativa com CamelCase
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Logo {
  id?: string;
  imageUrl: string;
  type: 'primary' | 'secondary' | 'mobile' | 'favicon';
  isactive: boolean;
  altText?: string;
  description?: string;
}

export interface FooterImage {
  id?: string;
  imageUrl: string;
  type: 'payment' | 'security' | 'social' | 'partner' | 'other';
  isactive: boolean;
  altText?: string;
  order: number;
  description?: string;
  link?: string;
}

export interface SocialLink {
  id?: string;
  platform: 'instagram' | 'facebook';
  url: string;
  description?: string;
  isactive: boolean;
}
