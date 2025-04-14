import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // Cria um cliente Supabase usando as variáveis de ambiente
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  try {
    console.log('Verificando se a tabela colors existe...');
    
    // Tenta consultar a tabela colors
    const { data, error } = await supabase
      .from('colors')
      .select('*')
      .limit(1);
    
    // Se o erro for do tipo "relation does not exist", a tabela não existe
    if (error) {
      console.error('Erro ao verificar tabela:', error);
      
      // Instruções para criar a tabela manualmente
      const createTableSQL = `
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  hexcode VARCHAR(10) NOT NULL,
  collectionid UUID REFERENCES color_collections(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `;
      
      return NextResponse.json({
        success: false,
        message: 'A tabela colors não existe ou houve um erro ao acessá-la',
        error: error.message,
        createTableSQL: createTableSQL,
        instructions: 'Execute este SQL no SQL Editor do Supabase para criar a tabela corretamente'
      }, { status: 404 });
    }
    
    // A tabela existe, verificar a estrutura
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];
    
    console.log('Colunas encontradas:', columnNames);
    
    return NextResponse.json({
      success: true,
      message: 'A tabela colors existe',
      columns: columnNames,
      sample: data
    });
    
  } catch (error) {
    console.error('Erro ao verificar tabela:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar a tabela colors',
      error: String(error)
    }, { status: 500 });
  }
} 