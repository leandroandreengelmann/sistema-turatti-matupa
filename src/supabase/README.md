# Integração com Supabase

Este projeto está configurado para usar o Supabase como backend para armazenamento de dados e autenticação.

## Configuração inicial

1. O projeto está configurado com as seguintes credenciais:
   - URL: `https://iknsgexblnnngjqopkui.supabase.co`
   - Chave anônima: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrbnNnZXhibG5ubmdqcW9wa3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0Nzc0MDcsImV4cCI6MjA2MDA1MzQwN30.J97WpgDY5js1ewjqXVakl_1egbXo95v9nqJ0IQ48Jp4`

2. Se precisar alterar estas credenciais, edite o arquivo `src/lib/supabase.ts`.

## Esquema do banco de dados

O esquema completo do banco de dados está definido no arquivo `schema.sql`. Ele inclui todas as tabelas necessárias para o funcionamento do sistema:

- `products`: Produtos
- `categories`: Categorias
- `subcategories`: Subcategorias
- `color_collections`: Coleções de cores
- `colors`: Cores
- `banners`: Banners
- `stores`: Lojas
- `sellers`: Vendedores
- `logos`: Logos
- `footer_images`: Imagens do rodapé
- `social_links`: Links de redes sociais

## Inicialização do banco de dados

Para configurar o banco de dados completo, siga os passos abaixo:

1. **Aplicar o esquema**: Primeiro, aplique o esquema para criar todas as tabelas
   - Acesse o painel do Supabase: [https://app.supabase.com/](https://app.supabase.com/)
   - Selecione o projeto `siteturatti`
   - Navegue até SQL Editor
   - Copie o conteúdo do arquivo `schema.sql`
   - Cole no editor SQL e execute

2. **Popular o banco com dados iniciais**:
   - Após aplicar o esquema, execute o script de seed para popular o banco com dados iniciais
   - Navegue até SQL Editor
   - Copie o conteúdo do arquivo `seed.sql`
   - Cole no editor SQL e execute

Os dados iniciais incluem:
- Categorias e subcategorias de produtos
- Coleções de cores e cores
- Produtos de exemplo
- Lojas e vendedores
- Banners e logos

## Alternativa de desenvolvimento local

Se preferir usar dados locais para desenvolvimento, o projeto inclui dois serviços:
- `localDataService.ts`: Utiliza dados mockados em memória
- `productService.ts`: Se conecta ao Supabase

Para alternar entre eles, basta mudar a importação nos componentes.

## Autenticação

### Criando usuários

Para criar um usuário administrador:

1. Acesse o painel do Supabase: [https://app.supabase.com/](https://app.supabase.com/)
2. Selecione o projeto `siteturatti`
3. Navegue até Authentication > Users
4. Clique em "Add User"
5. Preencha email e senha

### Login no sistema

O sistema possui uma página de login em `/admin/login` que permite que usuários cadastrados façam login.

## Políticas de segurança (RLS)

O esquema inclui políticas de Row Level Security (RLS) que:

1. Permitem acesso público (anônimo) para leitura de registros ativos
2. Restringem operações de criação, atualização e exclusão apenas para usuários autenticados

## Serviços disponíveis

Os seguintes serviços estão implementados para interagir com o Supabase:

- `authService`: Autenticação
- `productService`: Produtos
- `categoryService`: Categorias e subcategorias
- `colorService`: Cores
- `colorCollectionService`: Coleções de cores
- `bannerService`: Banners
- `storeService`: Lojas
- `sellerService`: Vendedores

## Estrutura dos arquivos

- `src/lib/supabase.ts`: Configuração do cliente Supabase
- `src/services/*`: Serviços para cada entidade
- `src/components/auth/AuthGuard.tsx`: Componente para proteger rotas que exigem autenticação
- `src/app/admin/login/page.tsx`: Página de login
- `src/app/admin/layout.tsx`: Layout da área administrativa com menu lateral 