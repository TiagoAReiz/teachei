import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso",
    description: "Termos e Condições de Uso da plataforma TeAchei.",
};

export default function TermsPage() {
    return (
        <article className="prose prose-slate dark:prose-invert max-w-none">
            <h1>Termos de Uso</h1>
            <p className="lead">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <h2>1. Aceitação dos Termos</h2>
            <p>
                Ao acessar e utilizar o TeAchei, você concorda com estes Termos de Uso e com nossa Política de Privacidade.
                Se você não concordar, não utilize a plataforma.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
                O TeAchei é uma plataforma que conecta compradores (que publicam intenções de compra) a vendedores (que possuem veículos compatíveis).
                Nós não vendemos veículos diretamente e não garantimos o sucesso das negociações.
            </p>

            <h2>3. Cadastro e Segurança</h2>
            <p>
                Você é responsável por manter a confidencialidade de sua senha e conta.
                O TeAchei não se responsabiliza por qualquer perda decorrente do uso não autorizado de sua conta.
            </p>

            <h2>4. Regras de Conduta</h2>
            <p>É proibido:</p>
            <ul>
                <li>Publicar intenções falsas ou fraudulentas.</li>
                <li>Usar a plataforma para qualquer fim ilegal.</li>
                <li>Desrespeitar outros usuários.</li>
                <li>Tentar burlar o sistema de segurança do site.</li>
            </ul>

            <h2>5. Limitação de Responsabilidade</h2>
            <p>
                O TeAchei atua apenas como intermediário na aproximação entre as partes.
                Não nos responsabilizamos pela qualidade, procedência ou entrega dos veículos negociados entre os usuários.
                Toda negociação é de responsabilidade exclusiva de compradores e vendedores.
            </p>

            <h2>6. Planos e Pagamentos</h2>
            <p>
                Alguns recursos da plataforma podem ser pagos. Os preços e condições estão descritos nas páginas específicas de cada plano.
                Reservamo-nos o direito de alterar os preços a qualquer momento, mediante aviso prévio.
            </p>

            <h2>7. Alterações nos Termos</h2>
            <p>
                Podemos atualizar estes termos periodicamente. Recomendamos que você os revise regularmente.
                O uso contínuo da plataforma após as alterações constitui aceitação dos novos termos.
            </p>

            <h2>8. Lei Aplicável</h2>
            <p>
                Estes termos são regidos pelas leis da República Federativa do Brasil.
                Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer dúvidas.
            </p>
        </article>
    );
}
