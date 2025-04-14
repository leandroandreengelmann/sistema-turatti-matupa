import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // Cria um cliente Supabase usando as variáveis de ambiente
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' // Usando a chave anônima em vez da service role
  );

  try {
    console.log('Verificando estrutura da tabela colors...');
    
    // Consulta para obter um exemplo de dados
    const { data: sampleData, error: sampleError } = await supabase
      .from('colors')
      .select('*')
      .limit(5);

    if (sampleError) {
      console.error('Erro ao consultar dados:', sampleError);
      return NextResponse.json({
        success: false,
        message: 'Erro ao consultar dados da tabela',
        error: sampleError.message,
        errorDetails: sampleError
      }, { status: 500 });
    }

    console.log('Dados de amostra obtidos:', sampleData);

    // Extrair nomes das colunas do primeiro item se disponível
    const columnNames = sampleData && sampleData.length > 0 
      ? Object.keys(sampleData[0])
      : [];

    console.log('Colunas encontradas:', columnNames);

    return NextResponse.json({
      success: true,
      message: 'Estrutura da tabela colors recuperada com sucesso',
      columns: columnNames,
      sampleData: sampleData || []
    });
  } catch (error) {
    console.error('Erro ao verificar estrutura da tabela:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar estrutura da tabela',
      error: String(error),
      errorObject: error
    }, { status: 500 });
  }
} 