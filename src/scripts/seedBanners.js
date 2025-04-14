// Script para popular a tabela de banners com dados de demonstração
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configurar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Banners de demonstração
const demoBanners = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1969&auto=format&fit=crop',
    isactive: true,
    order: 1,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1511355626977-4ac5395d93c0?q=80&w=1974&auto=format&fit=crop',
    isactive: true,
    order: 2,
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1517697471339-4aa32003c11a?q=80&w=2076&auto=format&fit=crop',
    isactive: true,
    order: 3,
  }
];

// Função para verificar se já existem banners
async function checkExistingBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('id');
    
  if (error) {
    console.error('Erro ao verificar banners existentes:', error);
    return false;
  }
  
  return data.length > 0;
}

// Função para inserir banners de demonstração
async function insertDemoBanners() {
  const now = new Date().toISOString();
  
  // Adicionar timestamps a cada banner
  const bannersWithTimestamps = demoBanners.map(banner => ({
    ...banner,
    createdAt: now,
    updatedAt: now
  }));
  
  const { data, error } = await supabase
    .from('banners')
    .insert(bannersWithTimestamps);
    
  if (error) {
    console.error('Erro ao inserir banners de demonstração:', error);
    return false;
  }
  
  return true;
}

// Função principal
async function seedBanners() {
  console.log('Verificando banners existentes...');
  
  const hasExistingBanners = await checkExistingBanners();
  
  if (hasExistingBanners) {
    console.log('Banners já existem no banco de dados. Nenhuma ação necessária.');
    return;
  }
  
  console.log('Inserindo banners de demonstração...');
  
  const success = await insertDemoBanners();
  
  if (success) {
    console.log('Banners de demonstração inseridos com sucesso!');
  } else {
    console.log('Falha ao inserir banners de demonstração.');
  }
}

// Executar a função principal
seedBanners()
  .catch(error => {
    console.error('Erro durante o seeding de banners:', error);
  })
  .finally(() => {
    process.exit(0);
  }); 