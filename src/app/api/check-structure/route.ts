import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Consulta SQL para obter informações sobre as colunas da tabela subcategories
    const { data: columns, error: columnsError } = await supabase
      .from('subcategories')
      .select('*')
      .limit(1);

    if (columnsError) {
      return NextResponse.json({ 
        error: `Erro ao consultar subcategorias: ${columnsError.message}`,
        details: columnsError
      }, { status: 500 });
    }

    // Se conseguimos um registro, podemos ver a estrutura das colunas
    const columnNames = columns && columns.length > 0 
      ? Object.keys(columns[0])
      : [];

    return NextResponse.json({ 
      columnNames,
      sampleData: columns,
      message: 'Verificação da estrutura concluída' 
    });
  } catch (error: any) {
    console.error('Erro na verificação da estrutura:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error?.message || String(error)
    }, { status: 500 });
  }
} 