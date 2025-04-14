import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Endpoint para configurar políticas de armazenamento no Supabase
export async function GET() {
  try {
    // Configuração do cliente Supabase com chave de serviço
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Variáveis de ambiente do Supabase não configuradas corretamente');
      return NextResponse.json({ error: 'Erro na configuração do servidor' }, { status: 500 });
    }
    
    // Criar cliente com permissões elevadas (papel de serviço)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 1. Verificar e criar o bucket "images" se não existir
    const { data: buckets } = await supabase.storage.listBuckets();
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
    
    if (!imagesBucket) {
      // Criar o bucket
      const { data: newBucket, error: bucketError } = await supabase.storage.createBucket('images', {
        public: true
      });
      
      if (bucketError) {
        console.error('Erro ao criar bucket:', bucketError);
        return NextResponse.json({ error: 'Erro ao criar bucket: ' + bucketError.message }, { status: 500 });
      }
      
      console.log('Bucket criado com sucesso:', newBucket);
    } else if (imagesBucket.public === false) {
      // Atualizar o bucket para público
      const { error: updateError } = await supabase.storage.updateBucket('images', {
        public: true
      });
      
      if (updateError) {
        console.error('Erro ao atualizar bucket para público:', updateError);
        return NextResponse.json({ error: 'Erro ao atualizar bucket: ' + updateError.message }, { status: 500 });
      }
      
      console.log('Bucket atualizado para público com sucesso');
    }
    
    // 2. Executar SQL para criar políticas de acesso
    // Isso é necessário porque a API Supabase JS não tem métodos para gerenciar políticas de storage diretamente
    
    try {
      // Política para permitir SELECT (leitura) para todos
      const { error: selectPolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'images',
        policy_name: 'Allow Public Read',
        definition: 'true',
        operation: 'SELECT',
        role_name: 'anon'
      });
      
      if (selectPolicyError) {
        console.error('Erro ao criar política SELECT:', selectPolicyError);
      }
      
      // Política para permitir INSERT (upload) para usuários autenticados
      const { error: insertPolicyError } = await supabase.rpc('create_storage_policy', {
        bucket_name: 'images',
        policy_name: 'Allow Authenticated Upload',
        definition: 'auth.role() = \'authenticated\'',
        operation: 'INSERT',
        role_name: 'authenticated'
      });
      
      if (insertPolicyError) {
        console.error('Erro ao criar política INSERT:', insertPolicyError);
      }
      
      // Alternativa: executar SQL direto se o RPC não existir
      if (selectPolicyError || insertPolicyError) {
        console.log('Tentando método alternativo para criar políticas via SQL...');
        
        // SQL para habilitar acesso público
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql: `
            -- Permitir leitura pública
            CREATE POLICY "Allow Public Select" ON storage.objects
              FOR SELECT USING (bucket_id = 'images');
            
            -- Permitir upload para todos (incluindo anônimos)
            CREATE POLICY "Allow Public Insert" ON storage.objects
              FOR INSERT WITH CHECK (bucket_id = 'images');
              
            -- Permitir atualização e remoção para serviço
            CREATE POLICY "Allow Service Update" ON storage.objects
              FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'service_role');
              
            CREATE POLICY "Allow Service Delete" ON storage.objects
              FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'service_role');
          `
        });
        
        if (sqlError) {
          console.error('Erro ao executar SQL para políticas:', sqlError);
        }
      }
      
    } catch (policyError) {
      console.error('Erro ao configurar políticas:', policyError);
      // Continuar mesmo se configuração de políticas falhar
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Configuração de armazenamento concluída' 
    });
    
  } catch (error: any) {
    console.error('Erro ao configurar armazenamento:', error);
    return NextResponse.json({ 
      error: 'Falha na configuração: ' + (error.message || 'Erro desconhecido') 
    }, { status: 500 });
  }
} 