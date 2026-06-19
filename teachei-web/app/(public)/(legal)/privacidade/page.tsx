import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade",
    description: "Política de Privacidade do TeAchei. Saiba como coletamos e protegemos seus dados.",
};

export default function PrivacyPage() {
    return (
        <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Política de Privacidade</h1>
            <p className="lead">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <h2>1. Introdução</h2>
            <p>
                O TeAchei respeita a sua privacidade e está comprometido em proteger os dados pessoais que você compartilha conosco.
                Esta política descreve como coletamos, usamos e protegemos suas informações ao utilizar nossa plataforma.
            </p>

            <h2>2. Coleta de Dados</h2>
            <p>Coletamos as seguintes informações:</p>
            <ul>
                <li><strong>Informações de Cadastro:</strong> Nome, e-mail, telefone e senha.</li>
                <li><strong>Informações de Veículos:</strong> Dados sobre os veículos que você deseja comprar ou vender.</li>
                <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador e páginas visitadas (via Cookies).</li>
            </ul>

            <h2>3. Uso das Informações</h2>
            <p>Utilizamos seus dados para:</p>
            <ul>
                <li>Conectar compradores e vendedores.</li>
                <li>Melhorar nossa plataforma e experiência do usuário.</li>
                <li>Enviar notificações importantes sobre sua conta ou negociações.</li>
                <li>Exibir anúncios personalizados (Google AdSense).</li>
            </ul>

            <h2>4. Cookies e Tecnologias de Rastreamento</h2>
            <p>
                Utilizamos cookies para melhorar a funcionalidade do site e para fins publicitários.
                Nossos parceiros de publicidade, como o Google AdSense, podem usar cookies para exibir anúncios com base em suas visitas a este e outros sites.
            </p>
            <p>
                Você pode desativar os cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.
            </p>

            <h2>5. Compartilhamento de Dados</h2>
            <p>
                Não vendemos seus dados pessoais. Compartilhamos informações apenas com:
            </p>
            <ul>
                <li><strong>Outros Usuários:</strong> Apenas as informações necessárias para a negociação (ex: contato para vendedores).</li>
                <li><strong>Prestadores de Serviço:</strong> Empresas que nos ajudam a operar o site (ex: processamento de pagamentos).</li>
                <li><strong>Obrigações Legais:</strong> Quando exigido por lei.</li>
            </ul>

            <h2>6. Seus Direitos (LGPD)</h2>
            <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
            </p>
            <ul>
                <li>Acessar seus dados.</li>
                <li>Corrigir dados incompletos ou desatualizados.</li>
                <li>Solicitar a exclusão de seus dados.</li>
                <li>Revogar seu consentimento.</li>
            </ul>

            <h2>7. Contato</h2>
            <p>
                Para exercer seus direitos ou tirar dúvidas, entre em contato conosco pelo e-mail: <strong>app.teachei.shop@gmail.com</strong>
            </p>
        </article>
    );
}
