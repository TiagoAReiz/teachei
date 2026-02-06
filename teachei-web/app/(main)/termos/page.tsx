import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Termos de Uso - TeAchei",
  description: "Termos de uso do TeAchei",
};

export default function TermosPage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Termos de Uso</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Aceitação dos Termos
            </h2>
            <p className="text-muted leading-relaxed">
              Ao acessar e usar o TeAchei, você concorda em cumprir estes termos
              de uso. Se você não concordar com qualquer parte destes termos,
              não deve usar nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Descrição do Serviço
            </h2>
            <p className="text-muted leading-relaxed">
              O TeAchei é uma plataforma gratuita que conecta compradores e
              vendedores de veículos. Compradores podem publicar intenções de
              compra sem nenhum custo e vendedores podem entrar em contato para
              oferecer veículos que atendam aos critérios especificados. Todos os
              recursos da plataforma são oferecidos de forma gratuita.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Cadastro e Conta
            </h2>
            <p className="text-muted leading-relaxed">
              Para usar o TeAchei, você deve criar uma conta fornecendo
              informações verdadeiras e completas. Você é responsável por manter
              a confidencialidade de sua senha e por todas as atividades que
              ocorram em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Uso Adequado
            </h2>
            <p className="text-muted leading-relaxed">
              Você concorda em usar o TeAchei apenas para fins legítimos e de
              acordo com estes termos. É proibido publicar conteúdo falso,
              enganoso ou fraudulento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Limitação de Responsabilidade
            </h2>
            <p className="text-muted leading-relaxed">
              O TeAchei atua apenas como intermediário entre compradores e
              vendedores. Não somos responsáveis pela qualidade, segurança ou
              legalidade dos veículos anunciados, nem pela veracidade das
              informações fornecidas pelos usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Modificações
            </h2>
            <p className="text-muted leading-relaxed">
              Reservamos o direito de modificar estes termos a qualquer momento.
              Alterações significativas serão comunicadas por e-mail ou através
              da plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              7. Contato
            </h2>
            <p className="text-muted leading-relaxed">
              Para dúvidas sobre estes termos, entre em contato pelo e-mail:{" "}
              <a href="mailto:app.teachei.shop@gmail.com" className="text-primary hover:underline">
                app.teachei.shop@gmail.com
              </a>
            </p>
          </section>

          <p className="text-sm text-muted pt-4 border-t border-border">
            Última atualização: Fevereiro de 2026
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
