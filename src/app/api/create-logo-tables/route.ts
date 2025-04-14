import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Função para criar o cliente do Supabase com a service role key
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return createClient(supabaseUrl, supabaseServiceKey);
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    
    // Verificar se a tabela de logos já existe
    const { data: logosExists, error: logosExistsError } = await supabase
      .from('logos')
      .select('count')
      .limit(1);
    
    if (logosExistsError && !logosExistsError.message.includes('relation "logos" does not exist')) {
      return NextResponse.json({ 
        success: false, 
        error: `Erro ao verificar tabela de logos: ${logosExistsError.message}` 
      }, { status: 500 });
    }
    
    // Verificar se a tabela de links sociais já existe
    const { data: socialLinksExists, error: socialLinksExistsError } = await supabase
      .from('social_links')
      .select('count')
      .limit(1);
    
    if (socialLinksExistsError && !socialLinksExistsError.message.includes('relation "social_links" does not exist')) {
      return NextResponse.json({ 
        success: false, 
        error: `Erro ao verificar tabela de links sociais: ${socialLinksExistsError.message}` 
      }, { status: 500 });
    }
    
    // Criar a tabela de logos se não existir
    if (logosExistsError && logosExistsError.message.includes('relation "logos" does not exist')) {
      const { error: createLogosError } = await supabase
        .rpc('execute_sql', {
          query: `
            CREATE TABLE logos (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              imageurl TEXT NOT NULL,
              type TEXT NOT NULL,
              isactive BOOLEAN DEFAULT true,
              alttext TEXT,
              description TEXT,
              createdat TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updatedat TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            -- Criação de índices para otimização de consultas
            CREATE INDEX idx_logos_type ON logos (type);
            CREATE INDEX idx_logos_isactive ON logos (isactive);
          `
        });
      
      if (createLogosError) {
        return NextResponse.json({ 
          success: false, 
          error: `Erro ao criar tabela de logos: ${createLogosError.message}` 
        }, { status: 500 });
      }
    }
    
    // Criar a tabela de links sociais se não existir
    if (socialLinksExistsError && socialLinksExistsError.message.includes('relation "social_links" does not exist')) {
      const { error: createSocialLinksError } = await supabase
        .rpc('execute_sql', {
          query: `
            CREATE TABLE social_links (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              platform TEXT NOT NULL,
              url TEXT NOT NULL,
              description TEXT,
              isactive BOOLEAN DEFAULT true,
              createdat TIMESTAMP WITH TIME ZONE DEFAULT now(),
              updatedat TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
            
            -- Criação de índices para otimização de consultas
            CREATE INDEX idx_social_links_platform ON social_links (platform);
            CREATE INDEX idx_social_links_isactive ON social_links (isactive);
          `
        });
      
      if (createSocialLinksError) {
        return NextResponse.json({ 
          success: false, 
          error: `Erro ao criar tabela de links sociais: ${createSocialLinksError.message}` 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Tabelas de logos e links sociais verificadas/criadas com sucesso.',
      logosExists: !logosExistsError,
      socialLinksExists: !socialLinksExistsError
    });
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
} 