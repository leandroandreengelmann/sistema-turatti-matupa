import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar tabela colors com uma consulta simples
    const { data: colorsData, error: colorsError } = await supabase
      .from('colors')
      .select()
      .limit(1);

    // Resultado final
    return NextResponse.json({
      columnsFromApi: colorsData && colorsData.length > 0 ? Object.keys(colorsData[0]) : 'Sem dados',
      sampleData: colorsData && colorsData.length > 0 ? colorsData[0] : null,
      apiError: colorsError,
      message: 'Verificação concluída'
    });
  } catch (error) {
    console.error('Erro ao verificar estrutura da tabela:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
} 