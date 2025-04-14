# Configuração do Sistema - Turatti Store

Este documento contém instruções para configurar e inicializar o Turatti Store, um sistema de e-commerce para uma loja de materiais de construção.

## Requisitos

- Node.js 16.x ou superior
- NPM 7.x ou superior
- Uma conta no [Supabase](https://supabase.com/)

## Configuração do Banco de Dados

### Opção 1: Usando o Painel Administrativo do Supabase

1. Acesse o painel do Supabase: [https://app.supabase.com/](https://app.supabase.com/)
2. Crie um novo projeto ou selecione um projeto existente
3. Navegue até SQL Editor
4. Execute o script `src/supabase/schema.sql` para criar todas as tabelas
5. Execute o script `src/supabase/seed.sql` para popular o banco com dados iniciais

### Opção 2: Usando o Utilitário de Inicialização

Alternativa para quem não possui acesso ao painel administrativo do Supabase:

1. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

2. No arquivo `src/app/page.tsx`, adicione o seguinte código (temporariamente):
   ```jsx
   import { useEffect } from 'react';
   import { initSupabaseData } from '@/utils/initSupabase';

   // Em algum lugar dentro do componente:
   useEffect(() => {
     // Descomentar para inicializar o banco (use apenas uma vez)
     // initSupabaseData();
   }, []);
   ```

3. Descomente a linha `initSupabaseData()`, salve o arquivo e execute o aplicativo
4. Após a inicialização bem-sucedida, comente novamente ou remova o código

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/turatti-store.git
   cd turatti-store
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente criando um arquivo `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
   ```

4. Inicie o servidor de desenvolvimento:
   ```
   npm run dev
   ```

5. Acesse o aplicativo em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

- `src/app/`: Contém todas as páginas da aplicação (utilizando o App Router do Next.js)
- `src/components/`: Componentes reutilizáveis
- `src/data/`: Tipos de dados e dados de exemplo
- `src/lib/`: Utilitários e configurações
- `src/services/`: Serviços para comunicação com o backend
- `src/supabase/`: Scripts SQL para o Supabase
- `src/utils/`: Funções utilitárias

## Áreas do Sistema

- **Loja (Frontend)**: Acessível em `/`
- **Produtos**: Acessível em `/products`
- **Administração**: Acessível em `/admin` (requer autenticação)

## Criando um Usuário Administrador

1. Acesse o painel do Supabase
2. Navegue até Authentication > Users
3. Clique em "Add User"
4. Preencha email e senha
5. Use essas credenciais para acessar a área administrativa do site

## Modo de Desenvolvimento Local

O sistema oferece duas opções para desenvolvimento:

1. **Modo Online**: Conecta-se ao Supabase
   - Use `import { servico } from '@/services/servicoService';`

2. **Modo Offline**: Usa dados mockados localmente
   - Use `import { servico } from '@/services/localDataService';`

## Solução de Problemas

### Erro de conexão com o Supabase
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Confirme se o projeto no Supabase está ativo
- Verifique se as políticas de segurança (RLS) estão configuradas corretamente

### Erro ao inicializar o banco de dados
- Verifique os logs no console para identificar o erro específico
- Confirme se você tem permissões para criar/alterar tabelas no Supabase

### Problemas de autenticação
- Verifique se o usuário foi criado corretamente no Supabase
- Limpe os cookies do navegador e tente novamente
- Confira as políticas de RLS no Supabase 