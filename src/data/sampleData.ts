import { Product, ColorCollection, Color, Store, ProductImage, ProductCategory } from './types';

// Sample products data
export const products: Product[] = [
  // ========== TINTAS - TINTAS ACRÍLICAS ==========
  {
    id: 'tinta-acrilica-1',
    name: 'Tinta Acrílica Premium Fosca 18L - Branco Neve',
    price: 349.90,
    promoPrice: 299.90,
    category: 'Tintas',
    subcategory: 'Tintas Acrílicas',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 10,
    images: [
      {
        id: 'tinta-acrilica-1-1',
        productId: 'tinta-acrilica-1',
        highResolution: '/images/products/primary-image.jpg',
        standard: '/images/products/primary-image.jpg',
        thumbnail: '/images/products/primary-image.jpg',
        isMain: true
      },
      {
        id: 'tinta-acrilica-1-2',
        productId: 'tinta-acrilica-1',
        highResolution: '/images/products/tinta-1.jpg',
        standard: '/images/products/tinta-1.jpg',
        thumbnail: '/images/products/tinta-1.jpg',
        isMain: false
      },
      {
        id: 'tinta-acrilica-1-3',
        productId: 'tinta-acrilica-1',
        highResolution: '/images/products/tinta-2.jpg',
        standard: '/images/products/tinta-2.jpg',
        thumbnail: '/images/products/tinta-2.jpg',
        isMain: false
      },
      {
        id: 'tinta-acrilica-1-4',
        productId: 'tinta-acrilica-1',
        highResolution: '/images/products/tinta-3.jpg',
        standard: '/images/products/tinta-3.jpg',
        thumbnail: '/images/products/tinta-3.jpg',
        isMain: false
      },
      {
        id: 'tinta-acrilica-1-5',
        productId: 'tinta-acrilica-1',
        highResolution: '/images/products/tinta-4.jpg',
        standard: '/images/products/tinta-4.jpg',
        thumbnail: '/images/products/tinta-4.jpg',
        isMain: false
      }
    ],
    description: 'Tinta acrílica premium com acabamento fosco, ideal para paredes internas e externas. Excelente cobertura e rendimento.',
    isPromotion: true,
    isNew: true,
    stock: 35
  },
  {
    id: 'tinta-acrilica-2',
    name: 'Tinta Acrílica Semibrilho 3.6L - Azul Sereno',
    price: 129.90,
    category: 'Tintas',
    subcategory: 'Tintas Acrílicas',
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 5,
    images: [
      {
        id: 'tinta-acrilica-2-1',
        productId: 'tinta-acrilica-2',
        highResolution: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'tinta-acrilica-2-2',
        productId: 'tinta-acrilica-2',
        highResolution: 'https://images.unsplash.com/photo-1580462766250-5a555f2b4209?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1580462766250-5a555f2b4209?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1580462766250-5a555f2b4209?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'tinta-acrilica-2-3',
        productId: 'tinta-acrilica-2',
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Tinta acrílica com acabamento semibrilho que facilita a limpeza e possui excelente resistência a manchas.',
    isPromotion: false,
    stock: 42
  },

  // ========== TINTAS - TINTAS LÁTEX ==========
  {
    id: 'tinta-latex-1',
    name: 'Tinta Látex PVA 18L - Branco Gelo',
    price: 219.90,
    promoPrice: 189.90,
    category: 'Tintas',
    subcategory: 'Tintas Látex',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 6,
    images: [
      {
        id: 'tinta-latex-1-1',
        productId: 'tinta-latex-1',
        highResolution: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'tinta-latex-1-2',
        productId: 'tinta-latex-1',
        highResolution: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'tinta-latex-1-3',
        productId: 'tinta-latex-1',
        highResolution: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Tinta látex PVA econômica ideal para paredes internas, com bom rendimento e secagem rápida.',
    isPromotion: true,
    stock: 28
  },
  {
    id: 'tinta-latex-2',
    name: 'Tinta Látex Standard 3.6L - Palha',
    price: 89.90,
    category: 'Tintas',
    subcategory: 'Tintas Látex',
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 4,
    images: [
      {
        id: 'tinta-latex-2-1',
        productId: 'tinta-latex-2',
        highResolution: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Tinta látex de qualidade standard para ambientes internos, com boa cobertura e custo-benefício.',
    isPromotion: false,
    stock: 50
  },

  // ========== TINTAS - ESMALTES ==========
  {
    id: 'esmalte-1',
    name: 'Esmalte Sintético Brilhante 3.6L - Branco',
    price: 139.90,
    promoPrice: 119.90,
    category: 'Tintas',
    subcategory: 'Esmaltes',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 5,
    images: [
      {
        id: 'esmalte-1-1',
        productId: 'esmalte-1',
        highResolution: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1582539971836-e3bd448fc8e0?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'esmalte-1-2',
        productId: 'esmalte-1',
        highResolution: 'https://images.unsplash.com/photo-1635348839074-c9b9d5aaf4f6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1635348839074-c9b9d5aaf4f6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1635348839074-c9b9d5aaf4f6?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'esmalte-1-3',
        productId: 'esmalte-1',
        highResolution: 'https://images.unsplash.com/photo-1548519835-f1d5244298c9?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1548519835-f1d5244298c9?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1548519835-f1d5244298c9?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'esmalte-1-4',
        productId: 'esmalte-1',
        highResolution: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Esmalte sintético de alta qualidade com acabamento brilhante, ideal para madeiras e metais.',
    isPromotion: true,
    stock: 22
  },
  {
    id: 'esmalte-2',
    name: 'Esmalte Base Água 900ml - Preto',
    price: 54.90,
    category: 'Tintas',
    subcategory: 'Esmaltes',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 2,
    images: [
      {
        id: 'esmalte-2-1',
        productId: 'esmalte-2',
        highResolution: '/images/products/esmalte-1.jpg',
        standard: '/images/products/esmalte-1.jpg',
        thumbnail: '/images/products/esmalte-1.jpg',
        isMain: true
      },
      {
        id: 'esmalte-2-2',
        productId: 'esmalte-2',
        highResolution: '/images/products/esmalte-2.jpg',
        standard: '/images/products/esmalte-2.jpg',
        thumbnail: '/images/products/esmalte-2.jpg',
        isMain: false
      },
      {
        id: 'esmalte-2-3',
        productId: 'esmalte-2',
        highResolution: '/images/products/esmalte-3.jpg',
        standard: '/images/products/esmalte-3.jpg',
        thumbnail: '/images/products/esmalte-3.jpg',
        isMain: false
      },
      {
        id: 'esmalte-2-4',
        productId: 'esmalte-2',
        highResolution: '/images/products/esmalte-4.jpg',
        standard: '/images/products/esmalte-4.jpg',
        thumbnail: '/images/products/esmalte-4.jpg',
        isMain: false
      }
    ],
    description: 'Esmalte base água com baixo odor e secagem rápida, ideal para ambientes internos.',
    isPromotion: false,
    isNew: true,
    stock: 33
  },

  // ========== TINTAS - VERNIZES ==========
  {
    id: 'verniz-1',
    name: 'Verniz Marítimo Brilhante 3.6L',
    price: 159.90,
    promoPrice: 139.90,
    category: 'Tintas',
    subcategory: 'Vernizes',
    sellerName: 'Ana Costa',
    sellerPhone: '44987654321',
    installments: 4,
    images: [
      {
        id: 'verniz-1-1',
        productId: 'verniz-1',
        highResolution: 'https://images.unsplash.com/photo-1573316958334-04b9bbc85468?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1573316958334-04b9bbc85468?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1573316958334-04b9bbc85468?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'verniz-1-2',
        productId: 'verniz-1',
        highResolution: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1631194758628-71ec7c35137e?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'verniz-1-3',
        productId: 'verniz-1',
        highResolution: 'https://images.unsplash.com/photo-1581091007718-0c50d599bfd0?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1581091007718-0c50d599bfd0?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1581091007718-0c50d599bfd0?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'verniz-1-4',
        productId: 'verniz-1',
        highResolution: 'https://images.unsplash.com/photo-1617979607547-21b5727f3d77?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1617979607547-21b5727f3d77?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1617979607547-21b5727f3d77?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Verniz marítimo resistente a intempéries, ideal para áreas externas e embarcações.',
    isPromotion: true,
    stock: 15
  },
  {
    id: 'verniz-2',
    name: 'Verniz Tingidor Mogno 900ml',
    price: 49.90,
    category: 'Tintas',
    subcategory: 'Vernizes',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 2,
    images: [
      {
        id: 'verniz-2-1',
        productId: 'verniz-2',
        highResolution: 'https://images.unsplash.com/photo-1505317553043-8e842b0f74ef?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1505317553043-8e842b0f74ef?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1505317553043-8e842b0f74ef?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Verniz com pigmentação que realça e protege a madeira, proporcionando um tom mogno elegante.',
    isPromotion: false,
    stock: 20
  },

  // ========== ACESSÓRIOS - PINCÉIS ==========
  {
    id: 'pincel-1',
    name: 'Kit Pincéis Profissionais - 5 unidades',
    price: 79.90,
    promoPrice: 69.90,
    category: 'Acessórios',
    subcategory: 'Pincéis',
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 3,
    images: [
      {
        id: 'pincel-1-1',
        productId: 'pincel-1',
        highResolution: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1590075865003-e28dcc66484f?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'pincel-1-2',
        productId: 'pincel-1',
        highResolution: 'https://images.unsplash.com/photo-1598016677484-ae4a5fc168a1?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1598016677484-ae4a5fc168a1?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1598016677484-ae4a5fc168a1?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'pincel-1-3',
        productId: 'pincel-1',
        highResolution: 'https://images.unsplash.com/photo-1628689522799-eb7125c21db5?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1628689522799-eb7125c21db5?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1628689522799-eb7125c21db5?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Kit com 5 pincéis profissionais de diferentes tamanhos para todos os tipos de pintura.',
    isPromotion: true,
    isNew: true,
    stock: 40
  },
  {
    id: 'pincel-2',
    name: 'Pincel Trincha 4" Premium',
    price: 29.90,
    category: 'Acessórios',
    subcategory: 'Pincéis',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 0,
    images: [
      {
        id: 'pincel-2-1',
        productId: 'pincel-2',
        highResolution: 'https://images.unsplash.com/photo-1573504611657-2e809a07a1a2?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1573504611657-2e809a07a1a2?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1573504611657-2e809a07a1a2?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Pincel trincha de 4 polegadas com cerdas sintéticas de alta qualidade para acabamento perfeito.',
    isPromotion: false,
    stock: 55
  },

  // ========== ACESSÓRIOS - ROLOS ==========
  {
    id: 'rolo-1',
    name: 'Rolo Antigota 23cm com Cabo',
    price: 39.90,
    promoPrice: 34.90,
    category: 'Acessórios',
    subcategory: 'Rolos',
    sellerName: 'Ana Costa',
    sellerPhone: '44987654321',
    installments: 0,
    images: [
      {
        id: 'rolo-1-1',
        productId: 'rolo-1',
        highResolution: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1572981739426-e70c3da4be4d?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'rolo-1-2',
        productId: 'rolo-1',
        highResolution: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'rolo-1-3',
        productId: 'rolo-1',
        highResolution: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Rolo de 23cm com tecnologia antigota para pinturas mais limpas e precisas.',
    isPromotion: true,
    stock: 28
  },
  {
    id: 'rolo-2',
    name: 'Kit Rolo de Espuma 15cm - 3 unidades',
    price: 24.90,
    category: 'Acessórios',
    subcategory: 'Rolos',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 0,
    images: [
      {
        id: 'rolo-2-1',
        productId: 'rolo-2',
        highResolution: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1507207611509-ec012433ff52?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Kit com 3 rolos de espuma de 15cm ideal para superfícies lisas e acabamentos refinados.',
    isPromotion: false,
    stock: 45
  },

  // ========== ACESSÓRIOS - LIXAS ==========
  {
    id: 'lixa-1',
    name: 'Lixa para Parede - Pacote 50 unidades',
    price: 49.90,
    promoPrice: 39.90,
    category: 'Acessórios',
    subcategory: 'Lixas',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 2,
    images: [
      {
        id: 'lixa-1-1',
        productId: 'lixa-1',
        highResolution: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1550319943-daaf26d56ad5?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'lixa-1-2',
        productId: 'lixa-1',
        highResolution: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Pacote com 50 lixas para parede grão 180, ideal para preparação de superfícies antes da pintura.',
    isPromotion: true,
    stock: 30
  },
  {
    id: 'lixa-2',
    name: 'Lixa para Madeira Grão 120 - Pacote 20 unidades',
    price: 29.90,
    category: 'Acessórios',
    subcategory: 'Lixas',
    sellerName: 'Ana Costa',
    sellerPhone: '44987654321',
    installments: 0,
    images: [
      {
        id: 'lixa-2-1',
        productId: 'lixa-2',
        highResolution: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1553288569-8d3c4223a264?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Pacote com 20 lixas para madeira com grão 120, perfeito para acabamento fino em superfícies de madeira.',
    isPromotion: false,
    stock: 38
  },

  // ========== REVESTIMENTOS - TEXTURAS ==========
  {
    id: 'textura-1',
    name: 'Textura Acrílica Rústica 25kg',
    price: 129.90,
    promoPrice: 109.90,
    category: 'Revestimentos',
    subcategory: 'Texturas',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 4,
    images: [
      {
        id: 'textura-1-1',
        productId: 'textura-1',
        highResolution: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'textura-1-2',
        productId: 'textura-1',
        highResolution: 'https://images.unsplash.com/photo-1582644903498-6c3c3a61db02?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1582644903498-6c3c3a61db02?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1582644903498-6c3c3a61db02?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Textura acrílica com efeito rústico para paredes externas e internas, garantindo durabilidade e beleza.',
    isPromotion: true,
    isNew: true,
    stock: 18
  },
  {
    id: 'textura-2',
    name: 'Massa Texturizada 15kg - Branco',
    price: 79.90,
    category: 'Revestimentos',
    subcategory: 'Texturas',
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 3,
    images: [
      {
        id: 'textura-2-1',
        productId: 'textura-2',
        highResolution: 'https://images.unsplash.com/photo-1627133805103-ce2d34ccdd37?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1627133805103-ce2d34ccdd37?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1627133805103-ce2d34ccdd37?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Massa texturizada para decoração de interiores com acabamento personalizado e fácil aplicação.',
    isPromotion: false,
    stock: 25
  },

  // ========== REVESTIMENTOS - GRAFIATOS ==========
  {
    id: 'grafiato-1',
    name: 'Grafiato Premium 25kg - Branco',
    price: 149.90,
    promoPrice: 129.90,
    category: 'Revestimentos',
    subcategory: 'Grafiatos',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 5,
    images: [
      {
        id: 'grafiato-1-1',
        productId: 'grafiato-1',
        highResolution: 'https://images.unsplash.com/photo-1614260135668-f44ba630398f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1614260135668-f44ba630398f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1614260135668-f44ba630398f?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Grafiato premium para fachadas e paredes externas, com alta resistência às intempéries e raios UV.',
    isPromotion: true,
    stock: 15
  },
  {
    id: 'grafiato-2',
    name: 'Grafiato Acrílico 20kg - Cinza',
    price: 119.90,
    category: 'Revestimentos',
    subcategory: 'Grafiatos',
    sellerName: 'Ana Costa',
    sellerPhone: '44987654321',
    installments: 4,
    images: [
      {
        id: 'grafiato-2-1',
        productId: 'grafiato-2',
        highResolution: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1563456161-e6e6e88e2772?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Grafiato acrílico na cor cinza para fachadas modernas com acabamento texturizado uniforme.',
    isPromotion: false,
    stock: 12
  },

  // ========== IMPERMEABILIZANTES - ASFÁLTICOS ==========
  {
    id: 'imperm-asfaltico-1',
    name: 'Manta Asfáltica Aluminizada 10m²',
    price: 199.90,
    promoPrice: 179.90,
    category: 'Impermeabilizantes',
    subcategory: 'Asfálticos',
    sellerName: 'João Silva',
    sellerPhone: '44999887766',
    installments: 6,
    images: [
      {
        id: 'imperm-asfaltico-1-1',
        productId: 'imperm-asfaltico-1',
        highResolution: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1626837540639-89e56f29001d?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Manta asfáltica com acabamento aluminizado que reflete os raios solares, ideal para lajes e telhados.',
    isPromotion: true,
    stock: 20
  },
  {
    id: 'imperm-asfaltico-2',
    name: 'Emulsão Asfáltica 18L',
    price: 149.90,
    category: 'Impermeabilizantes',
    subcategory: 'Asfálticos',
    sellerName: 'Maria Oliveira',
    sellerPhone: '44998765432',
    installments: 5,
    images: [
      {
        id: 'imperm-asfaltico-2-1',
        productId: 'imperm-asfaltico-2',
        highResolution: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1584461772442-bc3f850c2e64?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Emulsão asfáltica para impermeabilização de fundações, baldrames e alicerces.',
    isPromotion: false,
    stock: 22
  },

  // ========== IMPERMEABILIZANTES - ACRÍLICOS ==========
  {
    id: 'imperm-acrilico-1',
    name: 'Impermeabilizante Acrílico 18kg',
    price: 239.90,
    promoPrice: 209.90,
    category: 'Impermeabilizantes',
    subcategory: 'Acrílicos',
    sellerName: 'Carlos Mendes',
    sellerPhone: '44991234567',
    installments: 6,
    images: [
      {
        id: 'imperm-acrilico-1-1',
        productId: 'imperm-acrilico-1',
        highResolution: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1558442097-e19dae35c13b?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Impermeabilizante acrílico flexível para lajes, telhados e áreas expostas, com proteção UV.',
    isPromotion: true,
    isNew: true,
    stock: 12
  },
  {
    id: 'imperm-acrilico-2',
    name: 'Impermeabilizante Flexível 4kg',
    price: 79.90,
    category: 'Impermeabilizantes',
    subcategory: 'Acrílicos',
    sellerName: 'Ana Costa',
    sellerPhone: '44987654321',
    installments: 3,
    images: [
      {
        id: 'imperm-acrilico-2-1',
        productId: 'imperm-acrilico-2',
        highResolution: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1542556398-95fb5b9f787d?q=80&w=150&auto=format&fit=crop',
        isMain: true
      }
    ],
    description: 'Impermeabilizante flexível para áreas úmidas como banheiros, cozinhas e áreas de serviço.',
    isPromotion: false,
    stock: 30
  },

  // ========== FERRAMENTAS - MÁQUINAS ==========
  {
    id: 'maquina-solda-1',
    name: 'Máquina de Solda Inversora 140A - Turatti',
    price: 599.90,
    promoPrice: 499.90,
    category: 'Ferramentas',
    subcategory: 'Máquinas',
    sellerName: 'José Santos',
    sellerPhone: '44998765432',
    installments: 10,
    images: [
      {
        id: 'maquina-solda-1-1',
        productId: 'maquina-solda-1',
        highResolution: 'https://images.unsplash.com/photo-1671147056820-7b785cdcdac6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1671147056820-7b785cdcdac6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1671147056820-7b785cdcdac6?q=80&w=150&auto=format&fit=crop',
        isMain: true
      },
      {
        id: 'maquina-solda-1-2',
        productId: 'maquina-solda-1',
        highResolution: 'https://images.unsplash.com/photo-1503980850968-b7c3b4af0e0f?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1503980850968-b7c3b4af0e0f?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1503980850968-b7c3b4af0e0f?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'maquina-solda-1-3',
        productId: 'maquina-solda-1',
        highResolution: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=150&auto=format&fit=crop',
        isMain: false
      },
      {
        id: 'maquina-solda-1-4',
        productId: 'maquina-solda-1',
        highResolution: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=1000&auto=format&fit=crop',
        standard: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=600&auto=format&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1562184552-997c461abbe6?q=80&w=150&auto=format&fit=crop',
        isMain: false
      }
    ],
    description: 'Máquina de solda inversora 140A de alta qualidade, ideal para pequenos reparos e projetos. Compacta e fácil de transportar. Acompanha eletrodos e máscara de solda.',
    isPromotion: true,
    isNew: true,
    stock: 15
  },
];

// Sample color collections data
export const colorCollections: ColorCollection[] = [
  {
    id: '1',
    name: 'Amarelos',
    representativeColor: '#FFD700',
    description: 'Coleção de cores amarelas para iluminar seus ambientes.',
  },
  {
    id: '2',
    name: 'Azuis',
    representativeColor: '#1E90FF',
    description: 'Coleção de cores azuis para trazer tranquilidade e serenidade.',
  },
  {
    id: '3',
    name: 'Verdes',
    representativeColor: '#2E8B57',
    description: 'Coleção de cores verdes para conectar seu ambiente com a natureza.',
  },
  {
    id: '4',
    name: 'Vermelhos',
    representativeColor: '#DC143C',
    description: 'Coleção de cores vermelhas para ambientes vibrantes e cheios de energia.',
  },
  {
    id: '5',
    name: 'Neutros',
    representativeColor: '#D3D3D3',
    description: 'Coleção de cores neutras para ambientes elegantes e atemporais.',
  },
];

// Sample colors data
export const colors: Color[] = [
  // Amarelos
  {
    id: '1',
    name: 'Amarelo Sol',
    collectionId: '1',
    hexCode: '#FFD700',
  },
  {
    id: '2',
    name: 'Amarelo Canário',
    collectionId: '1',
    hexCode: '#FFFF00',
  },
  {
    id: '3',
    name: 'Amarelo Mostarda',
    collectionId: '1',
    hexCode: '#FFDB58',
  },
  
  // Azuis
  {
    id: '4',
    name: 'Azul Céu',
    collectionId: '2',
    hexCode: '#87CEEB',
  },
  {
    id: '5',
    name: 'Azul Marinho',
    collectionId: '2',
    hexCode: '#000080',
  },
  {
    id: '6',
    name: 'Azul Royal',
    collectionId: '2',
    hexCode: '#4169E1',
  },
  
  // Verdes
  {
    id: '7',
    name: 'Verde Esmeralda',
    collectionId: '3',
    hexCode: '#2E8B57',
  },
  {
    id: '8',
    name: 'Verde Limão',
    collectionId: '3',
    hexCode: '#32CD32',
  },
  {
    id: '9',
    name: 'Verde Oliva',
    collectionId: '3',
    hexCode: '#556B2F',
  },
  
  // Vermelhos
  {
    id: '10',
    name: 'Vermelho Cereja',
    collectionId: '4',
    hexCode: '#DC143C',
  },
  {
    id: '11',
    name: 'Vermelho Tomate',
    collectionId: '4',
    hexCode: '#FF6347',
  },
  {
    id: '12',
    name: 'Vermelho Borgonha',
    collectionId: '4',
    hexCode: '#800020',
  },
  
  // Neutros
  {
    id: '13',
    name: 'Branco Neve',
    collectionId: '5',
    hexCode: '#FFFAFA',
  },
  {
    id: '14',
    name: 'Cinza Claro',
    collectionId: '5',
    hexCode: '#D3D3D3',
  },
  {
    id: '15',
    name: 'Bege',
    collectionId: '5',
    hexCode: '#F5F5DC',
  },
];

// Sample stores data
export const stores: Store[] = [
  {
    id: '1',
    name: 'Turatti Centro',
    city: 'Cuiabá',
    phone: '(65) 3027-5865',
    hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
    isActive: true,
  },
  {
    id: '2',
    name: 'Turatti CPA',
    city: 'Cuiabá',
    phone: '(65) 3028-4335',
    hours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 13h',
    isActive: true,
  },
];

// Categorias de exemplo
export const sampleCategories: ProductCategory[] = [
  {
    id: '1',
    name: 'Tintas',
    slug: 'tintas'
  },
  {
    id: '2',
    name: 'Ferramentas',
    slug: 'ferramentas'
  },
  {
    id: '3',
    name: 'Madeiras',
    slug: 'madeiras'
  }
];

// Produtos de exemplo
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Tinta Látex PVA 18L - Branco Gelo',
    slug: 'tinta-latex-pva-18l-branco-gelo',
    description: 'Tinta látex PVA econômica ideal para paredes internas, com bom rendimento e secagem rápida.',
    price: 189.90,
    originalPrice: 219.90,
    discountPercentage: 14,
    images: [
      {
        id: '1',
        standard: '/images/tinta-branco-gelo-1.jpg',
        highResolution: '/images/tinta-branco-gelo-1-hd.jpg',
        thumbnail: '/images/tinta-branco-gelo-1-thumb.jpg',
        isMain: true
      },
      {
        id: '2',
        standard: '/images/tinta-branco-gelo-2.jpg',
        highResolution: '/images/tinta-branco-gelo-2-hd.jpg',
        thumbnail: '/images/tinta-branco-gelo-2-thumb.jpg'
      }
    ],
    category: sampleCategories[0],
    features: [
      'Rendimento de até 380m² por demão',
      'Secagem rápida',
      'Fácil aplicação',
      'Acabamento fosco'
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 32,
    brand: 'SuperTintas',
    sku: 'TN-BG-18L'
  },
  {
    id: '2',
    name: 'Tinta Acrílica Semibrilho 3.6L - Azul Sereno',
    slug: 'tinta-acrilica-semibrilho-36l-azul-sereno',
    description: 'Tinta acrílica com acabamento semibrilho que facilita a limpeza e possui excelente resistência a manchas.',
    price: 129.90,
    originalPrice: null,
    discountPercentage: 0,
    images: [
      {
        id: '3',
        standard: '/images/tinta-azul-sereno-1.jpg',
        highResolution: '/images/tinta-azul-sereno-1-hd.jpg',
        thumbnail: '/images/tinta-azul-sereno-1-thumb.jpg',
        isMain: true
      }
    ],
    category: sampleCategories[0],
    features: [
      'Resistente a manchas',
      'Fácil limpeza',
      'Durabilidade superior',
      'Não amarela com o tempo'
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 18,
    brand: 'SuperTintas',
    sku: 'TA-AS-36L'
  }
];
