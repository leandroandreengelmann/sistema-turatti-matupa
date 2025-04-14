import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  // Cria um cliente Supabase usando as variáveis de ambiente
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  try {
    // Consulta para obter a estrutura da tabela colors
    const { data, error } = await supabase.rpc('get_table_columns', {
      p_table_name: 'colors'
    });

    if (error) {
      // Se a função RPC não estiver disponível, fornecer um SQL para executar manualmente
      console.error('Erro ao consultar estrutura da tabela:', error);
      
      const sqlScript = `
-- Execute este SQL no Editor SQL do Supabase Dashboard
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'colors'
ORDER BY ordinal_position;
      `;
      
      return NextResponse.json({
        success: false,
        message: 'Erro ao consultar estrutura da tabela',
        error: error.message,
        sqlToExecute: sqlScript,
        instructions: 'Execute o SQL acima no Editor SQL do Supabase Dashboard para verificar a estrutura'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Estrutura da tabela obtida com sucesso',
      columns: data
    });
  } catch (error) {
    console.error('Erro ao verificar estrutura da tabela:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar estrutura da tabela',
      error: String(error)
    }, { status: 500 });
  }
} 