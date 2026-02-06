import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui";

export const metadata: Metadata = {
  title: "Política de Privacidade - TeAchei",
  description: "Política de privacidade do TeAchei",
};

export default function PrivacidadePage() {
  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">
        Política de Privacidade
      </h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              1. Informações que Coletamos
            </h2>
            <p className="text-muted leading-relaxed">
              Coletamos informações que você nos fornece diretamente, como nome,
              e-mail, telefone e informações de perfil quando você se cadastra
              no TeAchei. Também coletamos informações sobre suas intenções de
              compra de veículos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              2. Como Usamos suas Informações
            </h2>
            <p className="text-muted leading-relaxed">
              Utilizamos suas informações para facilitar a conexão entre
              compradores e vendedores de veículos, melhorar nossos serviços,
              enviar comunicações relevantes e garantir a segurança da
              plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              3. Compartilhamento de Informações
            </h2>
            <p className="text-muted leading-relaxed">
              Suas informações de contato são compartilhadas apenas com
              vendedores quando você publica uma intenção de compra. Não
              vendemos suas informações pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              4. Segurança
            </h2>
            <p className="text-muted leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para
              proteger suas informações pessoais contra acesso não autorizado,
              alteração ou destruição.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              5. Seus Direitos
            </h2>
            <p className="text-muted leading-relaxed">
              Você tem direito a acessar, corrigir ou excluir suas informações
              pessoais a qualquer momento. Entre em contato conosco para exercer
              esses direitos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              6. Contato
            </h2>
            <p className="text-muted leading-relaxed">
              Para dúvidas sobre esta política de privacidade, entre em contato
              pelo e-mail:{" "}
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
