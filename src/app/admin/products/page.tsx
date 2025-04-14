"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product, Category, Subcategory, Color, ColorCollection } from "@/data/types";
import { useToast } from '@/components/ToastProvider';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminTable from '@/components/AdminTable';
import AdminQuickLinks from '@/components/AdminQuickLinks';
import { Package } from 'lucide-react';
import { formatCurrency } from "@/lib/utils";
import { categoryService, subcategoryService } from '@/services/categoryService';
import { fetchColors, fetchColorCollections } from '@/services/colorService';

// Função simulada para buscar produtos
const fetchProducts = async (): Promise<Product[]> => {
  // Simula atraso na rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retorna dados simulados de produtos
  return [
    {
      id: "1",
      name: "Tinta Acrílica Premium",
      price: 159.90,
      originalPrice: 139.90,
      images: ["/images/produtos/tinta-premium.jpg"],
      description: "Tinta acrílica premium com alta cobertura e durabilidade",
      isPromotion: true,
      active: true,
      isNew: true,
      sellerName: "Loja Centro",
      slug: "tinta-acrilica-premium"
    },
    {
      id: "2",
      name: "Esmalte Sintético Standard",
      price: 89.90,
      images: ["/images/produtos/esmalte-standard.jpg"],
      description: "Esmalte sintético de secagem rápida, ideal para madeiras e metais",
      isPromotion: false,
      active: true,
      isNew: false,
      sellerName: "Loja Tatuapé",
      slug: "esmalte-sintetico-standard"
    },
    {
      id: "3",
      name: "Primer Antiferrugem",
      price: 72.50,
      originalPrice: 65.90,
      images: ["/images/produtos/primer.jpg"],
      description: "Primer antiferrugem para superfícies metálicas",
      isPromotion: true,
      active: false,
      isNew: false,
      sellerName: "Loja Zona Sul",
      slug: "primer-antiferrugem"
    },
    {
      id: "4",
      name: "Textura Rústica",
      price: 127.80,
      images: ["/images/produtos/textura-rustica.jpg"],
      description: "Textura rústica para paredes internas e externas",
      isPromotion: false,
      active: true,
      isNew: true,
      sellerName: "Loja Zona Oeste",
      slug: "textura-rustica"
    },
    {
      id: "5",
      name: "Kit Pintura Completo",
      price: 219.90,
      originalPrice: 189.90,
      images: ["/images/produtos/kit-pintura.jpg"],
      description: "Kit completo com tinta, rolo, bandeja e fita crepe",
      isPromotion: true,
      active: true,
      isNew: false,
      sellerName: "Loja Centro",
      slug: "kit-pintura-completo"
    }
  ];
};

export default function ProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dados de categorias e subcategorias
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorCollections, setColorCollections] = useState<ColorCollection[]>([]);
  
  // Carregar produtos, categorias, subcategorias e cores
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Carregar em paralelo
        const [productsData, categoriesData, subcategoriesData, colorsData, collectionsData] = await Promise.all([
          fetchProducts(),
          categoryService.getActive(),
          subcategoryService.getActive(),
          fetchColors(),
          fetchColorCollections()
        ]);
        
        setProductsList(productsData);
        setCategories(categoriesData);
        setAllSubcategories(subcategoriesData);
        setColors(colorsData);
        setColorCollections(collectionsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showToast('Erro ao carregar dados', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Remover showToast das dependências

  // Obter nomes de categoria e subcategoria a partir de IDs
  const getCategoryName = (id: string) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.name : '';
  };
  
  const getSubcategoryName = (id: string) => {
    const subcategory = allSubcategories.find(sub => sub.id === id);
    return subcategory ? subcategory.name : '';
  };

  // Excluir produto
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        // Simulação de exclusão no frontend
        setProductsList(prev => prev.filter(product => product.id !== id));
        showToast('Produto excluído com sucesso!', 'success');
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        showToast('Ocorreu um erro inesperado. Tente novamente.', 'error');
      }
    }
  };

  // Renderização da página
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <AdminPageLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Gerenciamento de Produtos</h1>
            <div className="text-sm">
              <Link href="/admin" className="text-blue-600 hover:text-blue-800">← Dashboard</Link>
            </div>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <Link
              href="/admin/products/edit"
              className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <span className="hidden xs:block ml-2">Adicionar Novo Produto</span>
              <span className="xs:hidden">+ Novo</span>
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <AdminQuickLinks
            links={[
              { href: '/admin/categories', label: 'Gerenciar Categorias' },
              { href: '/admin/subcategories', label: 'Gerenciar Subcategorias' },
              { href: '/admin/taxonomy', label: 'Gerenciar Taxonomia' },
            ]}
          />
        </div>

        <div className="bg-white rounded-lg shadow">
          <AdminTable
            columns={[
              {
                header: 'Nome',
                key: 'name',
                render: (value, row) => (
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      {row.images?.[0] ? (
                        <Image
                          src={row.images[0]}
                          alt={value}
                          fill
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{value}</div>
                      <div className="text-gray-500 text-xs">{row.sellerName}</div>
                    </div>
                  </div>
                )
              },
              {
                header: 'Preço',
                key: 'price',
                align: 'right',
                render: (value, row) => (
                  <div>
                    {row.isPromotion && row.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatCurrency(row.originalPrice)}
                      </div>
                    )}
                    <div className={row.isPromotion ? 'text-green-600 font-medium' : ''}>
                      {formatCurrency(value)}
                    </div>
                  </div>
                )
              },
              {
                header: 'Status',
                key: 'status',
                align: 'center',
                render: (_, row) => (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {row.active && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Ativo
                      </span>
                    )}
                    {!row.active && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Inativo
                      </span>
                    )}
                    {row.isNew && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Novidade
                      </span>
                    )}
                    {row.isPromotion && (
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        Promoção
                      </span>
                    )}
                  </div>
                )
              },
              {
                header: 'Categoria',
                key: 'categoryId',
                render: (value) => getCategoryName(value) || '-'
              },
              {
                header: 'Subcategoria',
                key: 'subcategoryId',
                render: (value) => getSubcategoryName(value) || '-'
              },
              {
                header: 'Coleção',
                key: 'collection',
                render: (_, row) => {
                  if (!row.isPaint || !row.colorId) return '-';
                  const color = colors.find(c => c.id === row.colorId);
                  const collection = colorCollections.find(c => c.id === color?.collectionId);
                  return collection?.name || '-';
                }
              },
              {
                header: 'Cor',
                key: 'color',
                render: (_, row) => {
                  if (!row.isPaint || !row.colorId) return '-';
                  const color = colors.find(c => c.id === row.colorId);
                  if (!color) return '-';
                  return (
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200" 
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </div>
                  );
                }
              }
            ]}
            data={productsList}
            actions={{
              onEdit: (row) => router.push(`/admin/products/edit/${row.id}`),
              onDelete: (row) => handleDelete(row.id)
            }}
            emptyText="Nenhum produto encontrado."
          />
        </div>
      </div>
    </AdminPageLayout>
  );
}
