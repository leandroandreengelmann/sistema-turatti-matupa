-- Esquema do banco de dados para o Turatti Store

-- Categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN DEFAULT true,
  isMainMenu BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategorias
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  categoryId UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coleções de Cores
CREATE TABLE IF NOT EXISTS color_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  representativeColor TEXT,
  imageUrl TEXT,
  description TEXT,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cores
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  collectionId UUID REFERENCES color_collections(id) ON DELETE CASCADE,
  hexCode TEXT,
  hex TEXT,
  rgb TEXT,
  red INTEGER,
  green INTEGER,
  blue INTEGER,
  ncs TEXT,
  active BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  originalPrice DECIMAL(10, 2),
  discountPercentage INTEGER,
  images JSONB,
  features JSONB,
  rating DECIMAL(3, 2),
  reviewCount INTEGER,
  brand TEXT,
  sku TEXT,
  isPromotion BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  isNew BOOLEAN DEFAULT false,
  sellerName TEXT,
  categoryId UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategoryId UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  isPaint BOOLEAN DEFAULT false,
  colorId UUID REFERENCES colors(id) ON DELETE SET NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imageUrl TEXT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lojas
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  phone TEXT NOT NULL,
  hours TEXT,
  iconUrl TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendedores
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  storeId UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  whatsapp TEXT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logos
CREATE TABLE IF NOT EXISTS logos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imageUrl TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('primary', 'secondary', 'mobile', 'favicon')),
  isActive BOOLEAN DEFAULT true,
  altText TEXT,
  description TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imagens do rodapé
CREATE TABLE IF NOT EXISTS footer_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  imageUrl TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('payment', 'security', 'social', 'partner', 'other')),
  isActive BOOLEAN DEFAULT true,
  altText TEXT,
  "order" INTEGER DEFAULT 0,
  description TEXT,
  link TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links de redes sociais
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook')),
  url TEXT NOT NULL,
  description TEXT,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Segurança - RLS (Row Level Security)

-- Políticas para Categorias
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorias visíveis publicamente" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar categorias" 
ON categories FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Subcategorias
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subcategorias visíveis publicamente" 
ON subcategories FOR SELECT 
USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar subcategorias" 
ON subcategories FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Coleções de Cores
ALTER TABLE color_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coleções de cores visíveis publicamente" 
ON color_collections FOR SELECT 
USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar coleções de cores" 
ON color_collections FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Cores
ALTER TABLE colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cores visíveis publicamente" 
ON colors FOR SELECT 
USING (true);

CREATE POLICY "Apenas usuários autenticados podem modificar cores" 
ON colors FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Produtos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Produtos ativos visíveis publicamente" 
ON products FOR SELECT 
USING (active = true);

CREATE POLICY "Usuários autenticados podem ver todos os produtos" 
ON products FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar produtos" 
ON products FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Banners
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Banners ativos visíveis publicamente" 
ON banners FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todos os banners" 
ON banners FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar banners" 
ON banners FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Lojas
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lojas ativas visíveis publicamente" 
ON stores FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todas as lojas" 
ON stores FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar lojas" 
ON stores FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Vendedores
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendedores ativos visíveis publicamente" 
ON sellers FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todos os vendedores" 
ON sellers FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar vendedores" 
ON sellers FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Logos
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Logos ativos visíveis publicamente" 
ON logos FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todos os logos" 
ON logos FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar logos" 
ON logos FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Imagens do Rodapé
ALTER TABLE footer_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Imagens do rodapé ativas visíveis publicamente" 
ON footer_images FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todas as imagens do rodapé" 
ON footer_images FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar imagens do rodapé" 
ON footer_images FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated');

-- Políticas para Links de Redes Sociais
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Links de redes sociais ativos visíveis publicamente" 
ON social_links FOR SELECT 
USING (isActive = true);

CREATE POLICY "Usuários autenticados podem ver todos os links de redes sociais" 
ON social_links FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem modificar links de redes sociais" 
ON social_links FOR INSERT, UPDATE, DELETE 
USING (auth.role() = 'authenticated'); 