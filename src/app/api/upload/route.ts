import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Essa função lida com requisições POST para fazer upload de imagens
export async function POST(request: Request) {
  try {
    // Obter os dados do formulário da requisição
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }
    
    // Configuração do cliente Supabase com chave anônima
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas corretamente');
      return NextResponse.json({ error: 'Erro na configuração do servidor' }, { status: 500 });
    }
    
    // Criar cliente com a chave anônima (usando a mesma que o frontend usa)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Nome único para o arquivo
    const filename = `product-images/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Converter o arquivo para um ArrayBuffer para upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);
    
    // Fazer o upload do arquivo diretamente com a chave anônima
    // Isso funciona se as políticas de acesso estiverem configuradas corretamente
    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filename, fileBuffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) {
        console.error('Erro no upload:', error);
        return NextResponse.json({ error: 'Falha no upload: ' + error.message }, { status: 500 });
      }
      
      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(filename);
        
      // Retornar a URL pública
      return NextResponse.json({ 
        success: true,
        url: urlData.publicUrl 
      });
    } catch (uploadError: any) {
      console.error('Erro no upload:', uploadError);
      return NextResponse.json({ 
        error: 'Falha no upload: ' + (uploadError.message || uploadError) 
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Erro no processamento do upload:', error);
    return NextResponse.json({ 
      error: 'Falha no processamento do upload: ' + (error.message || 'Erro desconhecido') 
    }, { status: 500 });
  }
} 