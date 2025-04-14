import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies | Turatti - Materiais para Construção',
  description: 'Saiba como utilizamos cookies e outras tecnologias de rastreamento para melhorar sua experiência em nosso site.',
};

export default function PoliticaDeCookiesPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. O que são cookies?</h2>
        <p>
          Cookies são pequenos arquivos de texto que são armazenados no seu computador, 
          smartphone ou outro dispositivo quando você visita o nosso site. Eles permitem 
          que o site lembre suas ações e preferências (como login, idioma, tamanho da fonte 
          e outras preferências de exibição) por um período de tempo, para que você não 
          precise reinserir essas informações toda vez que retornar ao site ou navegar de 
          uma página para outra.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Como utilizamos os cookies?</h2>
        <p>
          Utilizamos cookies para diversos fins, incluindo:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>
            <strong>Cookies necessários:</strong> São essenciais para que você possa navegar 
            pelo site e utilizar seus recursos, como acesso a áreas seguras do site. Sem estes 
            cookies, não podemos fornecer os serviços que você solicitou.
          </li>
          <li>
            <strong>Cookies analíticos/de desempenho:</strong> Permitem-nos reconhecer e contar 
            o número de visitantes e ver como os visitantes se movem pelo nosso site quando o utilizam. 
            Isso nos ajuda a melhorar o funcionamento do site, garantindo que os usuários encontrem 
            facilmente o que procuram.
          </li>
          <li>
            <strong>Cookies de funcionalidade:</strong> Usados para reconhecê-lo quando você retorna 
            ao nosso site. Isso nos permite personalizar nosso conteúdo para você, cumprimentá-lo pelo 
            nome e lembrar suas preferências (por exemplo, sua escolha de idioma ou região).
          </li>
          <li>
            <strong>Cookies de direcionamento:</strong> Registram sua visita ao nosso site, as páginas 
            que você visitou e os links que seguiu. Utilizamos essas informações para tornar o nosso 
            site e a publicidade exibida nele mais relevantes para os seus interesses.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Quais tipos de cookies utilizamos?</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">3.1. Cookies Necessários</h3>
        <p>
          Esses cookies são essenciais para o funcionamento básico do site e não podem ser desativados.
          Incluem cookies que permitem que você navegue pelo site e utilize recursos essenciais, como 
          áreas seguras e carrinho de compras.
        </p>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nome do Cookie</th>
              <th className="border p-2 text-left">Finalidade</th>
              <th className="border p-2 text-left">Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">session_id</td>
              <td className="border p-2">Mantém o estado da sessão do usuário entre as páginas</td>
              <td className="border p-2">Sessão</td>
            </tr>
            <tr>
              <td className="border p-2">cookie-consent</td>
              <td className="border p-2">Armazena suas preferências de cookies</td>
              <td className="border p-2">1 ano</td>
            </tr>
            <tr>
              <td className="border p-2">csrf_token</td>
              <td className="border p-2">Protege contra ataques de falsificação de solicitação entre sites</td>
              <td className="border p-2">Sessão</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.2. Cookies Analíticos</h3>
        <p>
          Esses cookies nos ajudam a entender como os visitantes interagem com o site, fornecendo 
          informações sobre as áreas visitadas, o tempo gasto no site e quaisquer problemas encontrados, 
          como mensagens de erro. Isso nos ajuda a melhorar o desempenho do site.
        </p>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nome do Cookie</th>
              <th className="border p-2 text-left">Finalidade</th>
              <th className="border p-2 text-left">Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">_ga</td>
              <td className="border p-2">Registra um ID único para gerar dados estatísticos sobre como o visitante usa o site</td>
              <td className="border p-2">2 anos</td>
            </tr>
            <tr>
              <td className="border p-2">_gid</td>
              <td className="border p-2">Registra um ID único para gerar dados estatísticos sobre como o visitante usa o site</td>
              <td className="border p-2">24 horas</td>
            </tr>
            <tr>
              <td className="border p-2">_gat</td>
              <td className="border p-2">Usado pelo Google Analytics para acelerar a taxa de solicitação</td>
              <td className="border p-2">1 minuto</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.3. Cookies de Marketing</h3>
        <p>
          Esses cookies são utilizados para rastrear visitantes em sites. A intenção é exibir anúncios 
          que sejam relevantes e envolventes para o usuário individual e, portanto, mais valiosos para 
          editores e anunciantes terceirizados.
        </p>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nome do Cookie</th>
              <th className="border p-2 text-left">Finalidade</th>
              <th className="border p-2 text-left">Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">_fbp</td>
              <td className="border p-2">Usado pelo Facebook para entregar uma série de produtos publicitários</td>
              <td className="border p-2">3 meses</td>
            </tr>
            <tr>
              <td className="border p-2">ads/ga-audiences</td>
              <td className="border p-2">Usado pelo Google AdWords para reconquistar visitantes com base em seu comportamento online</td>
              <td className="border p-2">Sessão</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-xl font-semibold mt-6 mb-3">3.4. Cookies de Preferências</h3>
        <p>
          Esses cookies permitem que o site lembre escolhas que você faz para fornecer uma 
          experiência mais personalizada.
        </p>
        <table className="w-full border-collapse my-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nome do Cookie</th>
              <th className="border p-2 text-left">Finalidade</th>
              <th className="border p-2 text-left">Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">user_pref</td>
              <td className="border p-2">Armazena preferências de exibição como cor do tema ou tamanho da fonte</td>
              <td className="border p-2">1 ano</td>
            </tr>
            <tr>
              <td className="border p-2">lang</td>
              <td className="border p-2">Lembra a preferência de idioma do usuário</td>
              <td className="border p-2">1 ano</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Como gerenciar cookies?</h2>
        <p>
          A maioria dos navegadores permite que você controle cookies através das suas configurações. 
          No entanto, se você limitar a capacidade dos sites de definir cookies, isso pode afetar sua 
          experiência geral de usuário. Você pode encontrar mais informações sobre cookies e como gerenciá-los 
          nos seguintes links:
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/pt-BR/kb/cookies-informacoes-armazenadas-por-sites-em-seu-computador" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Safari</a></li>
          <li><a href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
        </ul>
        <p>
          Além disso, nosso site oferece um painel de preferências de cookies, que pode ser acessado 
          a qualquer momento clicando no botão "Preferências de Cookies" no rodapé do site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies de terceiros</h2>
        <p>
          Em alguns casos especiais, também utilizamos cookies fornecidos por terceiros confiáveis. 
          A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.
        </p>
        <ul className="list-disc pl-6 my-4 space-y-2">
          <li>
            Este site utiliza o Google Analytics, que é uma das soluções de análise mais difundidas 
            e confiáveis da Web, para nos ajudar a entender como você usa o site e como podemos melhorar 
            sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site 
            e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.
          </li>
          <li>
            Também utilizamos cookies de redes sociais para permitir que você compartilhe conteúdo 
            diretamente em plataformas de mídia social, como Facebook e Twitter. Estes cookies não 
            estão sob nosso controle. Consulte as respectivas políticas de privacidade desses sites 
            para saber como seus cookies funcionam.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Alterações nesta política</h2>
        <p>
          Podemos atualizar esta Política de Cookies periodicamente para refletir, por exemplo, 
          mudanças nos cookies que utilizamos ou por outros motivos operacionais, legais ou regulatórios. 
          Assim, visite esta página regularmente para se manter informado sobre o uso de cookies e 
          tecnologias relacionadas.
        </p>
        <p>
          A data no topo desta Política indica quando ela foi atualizada pela última vez.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contato</h2>
        <p>
          Se você tiver dúvidas sobre como utilizamos cookies, entre em contato conosco:
        </p>
        <p className="mb-8">
          <strong>E-mail:</strong> contato@turatti.com.br<br />
          <strong>Telefone:</strong> (00) 0000-0000
        </p>

        <div className="mt-10 mb-6 py-4 border-t border-gray-200">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
} 