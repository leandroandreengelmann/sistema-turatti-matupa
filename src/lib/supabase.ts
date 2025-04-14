// Arquivo mock do cliente Supabase para desenvolvimento local
// Este arquivo é criado para evitar erros de build, mas não se conecta a um banco de dados real

import { createClient } from '@supabase/supabase-js';

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do Supabase não estão configuradas corretamente.');
}

// Criação do cliente Supabase
export const supabase = createClient(
  supabaseUrl || 'https://iknsgexblnnngjqopkui.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbnNnZXhibG5ubmdqcW9wa3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Nzc0MDcsImV4cCI6MjA2MDA1MzQwN30.J97WpgDY5js1ewjqXVakl_1egbXo95v9nqJ0IQ48Jp4'
); 