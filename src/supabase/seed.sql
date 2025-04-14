-- Script para popular o banco de dados com dados iniciais
-- Execute este script após aplicar o schema.sql

-- Categorias
INSERT INTO categories (id, name, description, active, isMainMenu, featured)
VALUES
  ('c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'Tintas', 'Tintas para diversos tipos de superfícies', true, true, true),
  ('c7824ce1-1023-4f2e-860c-5f31f5df9a12', 'Materiais Elétricos', 'Materiais para instalações elétricas', true, true, false),
  ('c7824ce1-1023-4f2e-860c-5f31f5df9a13', 'Hidráulica', 'Materiais para instalações hidráulicas', true, true, false),
  ('c7824ce1-1023-4f2e-860c-5f31f5df9a14', 'Ferramentas', 'Ferramentas manuais e elétricas', true, true, true)
ON CONFLICT (id) DO NOTHING;

-- Subcategorias
INSERT INTO subcategories (id, name, categoryId, description, active)
VALUES
  ('d7824ce1-1023-4f2e-860c-5f31f5df9a21', 'Tintas Acrílicas', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'Tintas acrílicas para paredes', true),
  ('d7824ce1-1023-4f2e-860c-5f31f5df9a22', 'Tintas Látex', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'Tintas látex para paredes internas', true),
  ('d7824ce1-1023-4f2e-860c-5f31f5df9a23', 'Esmaltes', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'Esmaltes para madeiras e metais', true),
  ('d7824ce1-1023-4f2e-860c-5f31f5df9a24', 'Cabos e Fios', 'c7824ce1-1023-4f2e-860c-5f31f5df9a12', 'Cabos e fios elétricos', true)
ON CONFLICT (id) DO NOTHING;

-- Coleções de Cores
INSERT INTO color_collections (id, name, representativeColor, imageUrl, description, active)
VALUES
  ('e7824ce1-1023-4f2e-860c-5f31f5df9a31', 'Cores Neutras', '#F5F5F5', '/images/color-examples/neutral.jpg', 'Coleção de cores neutras para ambientes minimalistas', true),
  ('e7824ce1-1023-4f2e-860c-5f31f5df9a32', 'Cores Vibrantes', '#FF4500', '/images/color-examples/vibrant.jpg', 'Coleção de cores vibrantes para ambientes modernos', true)
ON CONFLICT (id) DO NOTHING;

-- Cores
INSERT INTO colors (id, name, collectionId, hexCode, hex)
VALUES
  ('f7824ce1-1023-4f2e-860c-5f31f5df9a41', 'Branco Neve', 'e7824ce1-1023-4f2e-860c-5f31f5df9a31', '#FFFFFF', '#FFFFFF'),
  ('f7824ce1-1023-4f2e-860c-5f31f5df9a42', 'Cinza Platina', 'e7824ce1-1023-4f2e-860c-5f31f5df9a31', '#E5E5E5', '#E5E5E5'),
  ('f7824ce1-1023-4f2e-860c-5f31f5df9a43', 'Vermelho Vibrante', 'e7824ce1-1023-4f2e-860c-5f31f5df9a32', '#FF0000', '#FF0000'),
  ('f7824ce1-1023-4f2e-860c-5f31f5df9a44', 'Azul Celeste', 'e7824ce1-1023-4f2e-860c-5f31f5df9a32', '#1E90FF', '#1E90FF')
ON CONFLICT (id) DO NOTHING;

-- Lojas
INSERT INTO stores (id, name, city, phone, hours, isActive)
VALUES
  ('a7824ce1-1023-4f2e-860c-5f31f5df9a51', 'Turatti Centro', 'Umuarama', '(44) 3622-1234', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h', true),
  ('a7824ce1-1023-4f2e-860c-5f31f5df9a52', 'Turatti Zona 7', 'Umuarama', '(44) 3622-5678', 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h', true)
ON CONFLICT (id) DO NOTHING;

-- Vendedores
INSERT INTO sellers (id, name, storeId, whatsapp, isActive)
VALUES
  ('b7824ce1-1023-4f2e-860c-5f31f5df9a61', 'João Silva', 'a7824ce1-1023-4f2e-860c-5f31f5df9a51', '5544999887766', true),
  ('b7824ce1-1023-4f2e-860c-5f31f5df9a62', 'Maria Oliveira', 'a7824ce1-1023-4f2e-860c-5f31f5df9a51', '5544998765432', true),
  ('b7824ce1-1023-4f2e-860c-5f31f5df9a63', 'Carlos Mendes', 'a7824ce1-1023-4f2e-860c-5f31f5df9a52', '5544991234567', true)
ON CONFLICT (id) DO NOTHING;

-- Produtos
INSERT INTO products (id, name, slug, description, price, originalPrice, isPromotion, active, isNew, sellerName, categoryId, subcategoryId, images)
VALUES
  ('01824ce1-1023-4f2e-860c-5f31f5df9a71', 'Tinta Acrílica Premium Fosca 18L - Branco Neve', 'tinta-acrilica-premium-fosca-18l-branco-neve', 'Tinta acrílica premium com acabamento fosco, ideal para paredes internas e externas. Excelente cobertura e rendimento.', 299.90, 349.90, true, true, true, 'João Silva', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'd7824ce1-1023-4f2e-860c-5f31f5df9a21', 
  '[
    {
      "id": "img-01",
      "standard": "/images/products/primary-image.jpg",
      "thumbnail": "/images/products/primary-image.jpg",
      "isMain": true
    },
    {
      "id": "img-02",
      "standard": "/images/products/tinta-1.jpg",
      "thumbnail": "/images/products/tinta-1.jpg",
      "isMain": false
    },
    {
      "id": "img-03",
      "standard": "/images/products/tinta-2.jpg",
      "thumbnail": "/images/products/tinta-2.jpg",
      "isMain": false
    }
  ]'),
  ('01824ce1-1023-4f2e-860c-5f31f5df9a72', 'Tinta Látex PVA 18L - Branco Gelo', 'tinta-latex-pva-18l-branco-gelo', 'Tinta látex PVA econômica ideal para paredes internas, com bom rendimento e secagem rápida.', 189.90, 219.90, true, true, false, 'Maria Oliveira', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'd7824ce1-1023-4f2e-860c-5f31f5df9a22',
  '[
    {
      "id": "img-04",
      "standard": "/images/products/tinta-3.jpg",
      "thumbnail": "/images/products/tinta-3.jpg",
      "isMain": true
    },
    {
      "id": "img-05",
      "standard": "/images/products/tinta-4.jpg",
      "thumbnail": "/images/products/tinta-4.jpg",
      "isMain": false
    }
  ]'),
  ('01824ce1-1023-4f2e-860c-5f31f5df9a73', 'Esmalte Sintético Brilhante 3.6L - Branco', 'esmalte-sintetico-brilhante-3-6l-branco', 'Esmalte sintético de alta qualidade com acabamento brilhante, ideal para madeiras e metais.', 119.90, 139.90, true, true, false, 'Carlos Mendes', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'd7824ce1-1023-4f2e-860c-5f31f5df9a23',
  '[
    {
      "id": "img-06",
      "standard": "/images/products/esmalte-1.jpg",
      "thumbnail": "/images/products/esmalte-1.jpg",
      "isMain": true
    },
    {
      "id": "img-07",
      "standard": "/images/products/esmalte-2.jpg",
      "thumbnail": "/images/products/esmalte-2.jpg",
      "isMain": false
    }
  ]'),
  ('01824ce1-1023-4f2e-860c-5f31f5df9a74', 'Esmalte Base Água 900ml - Preto', 'esmalte-base-agua-900ml-preto', 'Esmalte base água, secagem rápida e baixo odor, ideal para ambientes internos.', 54.90, null, false, true, true, 'João Silva', 'c7824ce1-1023-4f2e-860c-5f31f5df9a11', 'd7824ce1-1023-4f2e-860c-5f31f5df9a23',
  '[
    {
      "id": "img-08",
      "standard": "/images/products/esmalte-3.jpg",
      "thumbnail": "/images/products/esmalte-3.jpg",
      "isMain": true
    },
    {
      "id": "img-09",
      "standard": "/images/products/esmalte-4.jpg",
      "thumbnail": "/images/products/esmalte-4.jpg",
      "isMain": false
    }
  ]')
ON CONFLICT (id) DO NOTHING;

-- Banners
INSERT INTO banners (id, imageUrl, isActive, "order")
VALUES
  ('h7824ce1-1023-4f2e-860c-5f31f5df9a81', '/images/banners/banner1.jpg', true, 1),
  ('h7824ce1-1023-4f2e-860c-5f31f5df9a82', '/images/banners/banner2.jpg', true, 2)
ON CONFLICT (id) DO NOTHING;

-- Logos
INSERT INTO logos (id, imageUrl, type, isActive, altText)
VALUES
  ('i7824ce1-1023-4f2e-860c-5f31f5df9a91', '/images/logos/logo-primary.png', 'primary', true, 'Turatti Store Logo'),
  ('i7824ce1-1023-4f2e-860c-5f31f5df9a92', '/images/logos/logo-mobile.png', 'mobile', true, 'Turatti Logo Mobile')
ON CONFLICT (id) DO NOTHING;

-- Social Links
INSERT INTO social_links (id, platform, url, isActive)
VALUES
  ('j7824ce1-1023-4f2e-860c-5f31f5df9a01', 'instagram', 'https://instagram.com/turattioficial', true),
  ('j7824ce1-1023-4f2e-860c-5f31f5df9a02', 'facebook', 'https://facebook.com/turattioficial', true)
ON CONFLICT (id) DO NOTHING; 