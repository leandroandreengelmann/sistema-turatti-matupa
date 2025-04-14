import { Product } from './types';
import { sampleProducts } from './sampleData';

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // Simula uma chamada de API com uma pequena demora
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Busca o produto pelo slug
  return sampleProducts.find(product => product.slug === slug);
}

export async function getProducts(limit?: number): Promise<Product[]> {
  // Simula uma chamada de API com uma pequena demora
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (limit) {
    return sampleProducts.slice(0, limit);
  }
  
  return sampleProducts;
}

export async function getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
  // Simula uma chamada de API com uma pequena demora
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const filteredProducts = sampleProducts.filter(
    product => product.category?.slug === categorySlug
  );
  
  if (limit) {
    return filteredProducts.slice(0, limit);
  }
  
  return filteredProducts;
} 