package com.teachei.api.adapter.in.web.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/legal")
public class LegalController {

    @Value("${app.base-url}")
    private String baseUrl;

    @GetMapping(value = "/politica-privacidade", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> politicaPrivacidade() {
        return ResponseEntity.ok(buildPoliticaPrivacidade());
    }

    @GetMapping(value = "/termos-uso", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> termosUso() {
        return ResponseEntity.ok(buildTermosUso());
    }

    @GetMapping(value = "/politica-privacidade/json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> politicaPrivacidadeJson() {
        return ResponseEntity.ok(Map.of(
            "titulo", "Política de Privacidade - TeAchei",
            "ultimaAtualizacao", "2026-03-22",
            "url", baseUrl + "/api/v1/legal/politica-privacidade",
            "conteudo", getPoliticaPrivacidadeTexto()
        ));
    }

    @GetMapping(value = "/termos-uso/json", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> termosUsoJson() {
        return ResponseEntity.ok(Map.of(
            "titulo", "Termos de Uso - TeAchei",
            "ultimaAtualizacao", "2026-03-22",
            "url", baseUrl + "/api/v1/legal/termos-uso",
            "conteudo", getTermosUsoTexto()
        ));
    }

    private String getPoliticaPrivacidadeTexto() {
        return """
            1. INFORMAÇÕES GERAIS

            A TeAchei ("nós", "nosso") opera o aplicativo TeAchei, um marketplace invertido para veículos. \
            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, \
            em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).

            2. DADOS QUE COLETAMOS

            2.1 Dados fornecidos por você:
            - Email e senha (para criação de conta)
            - Nome completo
            - Número de WhatsApp
            - Perfis de redes sociais (Instagram, Facebook)
            - Cidade e estado
            - Foto de perfil
            - Informações sobre veículos de interesse (marca, modelo, ano, preço)
            - Fotos de referência de veículos

            2.2 Dados coletados automaticamente:
            - Endereço IP
            - Tipo de dispositivo e sistema operacional
            - Dados de uso do aplicativo
            - Identificadores de publicidade (Google Advertising ID / IDFA)

            2.3 Dados coletados por terceiros:
            - Google OAuth: email, nome e foto do perfil (quando você faz login com Google)
            - Google AdMob: identificadores de dispositivo, dados de interação com anúncios publicitários
            - Mercado Pago: dados de transações de pagamento

            3. COMO USAMOS SEUS DADOS

            Utilizamos seus dados para:
            - Criar e gerenciar sua conta
            - Exibir anúncios de intenção de compra de veículos
            - Facilitar o contato entre compradores e vendedores
            - Processar pagamentos e assinaturas
            - Exibir anúncios publicitários personalizados (Google AdMob)
            - Melhorar nossos serviços e experiência do usuário
            - Cumprir obrigações legais

            4. ANÚNCIOS PUBLICITÁRIOS (GOOGLE ADMOB)

            Utilizamos o Google AdMob para exibir anúncios publicitários em nosso aplicativo. O Google AdMob pode coletar:
            - Identificadores de publicidade do dispositivo
            - Dados de interação com anúncios
            - Informações do dispositivo

            Você pode optar por anúncios não personalizados a qualquer momento nas configurações do aplicativo. \
            Para mais informações sobre como o Google usa seus dados, visite: https://policies.google.com/privacy

            5. COMPARTILHAMENTO DE DADOS

            Compartilhamos seus dados com:
            - Google (AdMob, OAuth): para autenticação e publicidade
            - Mercado Pago: para processamento de pagamentos
            - Microsoft Azure: para armazenamento seguro de dados e fotos

            Não vendemos seus dados pessoais a terceiros.

            6. ARMAZENAMENTO E SEGURANÇA

            Seus dados são armazenados em servidores seguros na nuvem (Microsoft Azure) com:
            - Criptografia em trânsito (HTTPS/TLS)
            - Criptografia em repouso
            - Senhas armazenadas com hash BCrypt
            - Controle de acesso baseado em tokens JWT

            7. SEUS DIREITOS (LGPD)

            Você tem direito a:
            - Confirmar a existência de tratamento de dados
            - Acessar seus dados pessoais
            - Corrigir dados incompletos ou desatualizados
            - Solicitar a exclusão de seus dados pessoais
            - Revogar o consentimento para tratamento de dados
            - Solicitar a portabilidade dos dados
            - Obter informações sobre compartilhamento de dados

            Para exercer esses direitos, utilize a opção "Excluir minha conta" no aplicativo \
            ou entre em contato pelo email: privacidade@teachei.com.br

            8. RETENÇÃO DE DADOS

            - Dados de conta: mantidos enquanto a conta estiver ativa
            - Anúncios de veículos: expiram automaticamente após 60 dias
            - Dados de pagamento: mantidos pelo período exigido por lei (5 anos)
            - Após exclusão da conta: dados são removidos em até 30 dias, exceto quando exigido por lei

            9. MENORES DE IDADE

            O TeAchei não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores. \
            Se identificarmos que um menor criou uma conta, ela será removida imediatamente.

            10. ALTERAÇÕES NESTA POLÍTICA

            Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas \
            através do aplicativo ou por email.

            11. CONTATO

            Para dúvidas sobre esta política ou seus dados pessoais:
            Email: privacidade@teachei.com.br

            Última atualização: 22 de março de 2026.""";
    }

    private String getTermosUsoTexto() {
        return """
            1. ACEITAÇÃO DOS TERMOS

            Ao acessar e usar o TeAchei, você concorda com estes Termos de Uso. \
            Se não concordar, não utilize o aplicativo.

            2. DESCRIÇÃO DO SERVIÇO

            O TeAchei é um marketplace invertido para veículos, onde compradores publicam suas intenções \
            de compra e vendedores podem entrar em contato. Não somos parte nas negociações entre usuários.

            3. CADASTRO E CONTA

            3.1 Você deve ter pelo menos 18 anos para usar o TeAchei.
            3.2 Você é responsável por manter a segurança de sua conta e senha.
            3.3 As informações fornecidas devem ser verdadeiras e atualizadas.
            3.4 Uma pessoa pode ter apenas uma conta no TeAchei.

            4. USO ACEITÁVEL

            Ao usar o TeAchei, você concorda em NÃO:
            - Publicar informações falsas ou enganosas
            - Usar o serviço para atividades ilegais
            - Assediar, ameaçar ou intimidar outros usuários
            - Enviar spam ou mensagens não solicitadas
            - Tentar acessar contas de outros usuários
            - Manipular preços ou criar anúncios fraudulentos
            - Publicar conteúdo ofensivo, discriminatório ou ilegal
            - Usar bots ou scripts automatizados

            5. CONTEÚDO DO USUÁRIO

            5.1 Você é responsável por todo conteúdo que publica (textos, fotos, informações de contato).
            5.2 Ao publicar conteúdo, você garante que tem os direitos necessários sobre ele.
            5.3 Reservamo-nos o direito de remover conteúdo que viole estes termos.

            6. ANÚNCIOS PUBLICITÁRIOS

            6.1 O TeAchei exibe anúncios publicitários de terceiros (Google AdMob).
            6.2 Não somos responsáveis pelo conteúdo dos anúncios de terceiros.
            6.3 A interação com anúncios é de sua responsabilidade.

            7. PAGAMENTOS E ASSINATURAS

            7.1 Alguns recursos podem requerer pagamento ou assinatura.
            7.2 Os pagamentos são processados pelo Mercado Pago.
            7.3 Política de cancelamento: assinaturas podem ser canceladas a qualquer momento.
            7.4 Reembolsos seguem a política do Mercado Pago e a legislação vigente.

            8. ISENÇÃO DE RESPONSABILIDADE

            8.1 O TeAchei é uma plataforma de intermediação. Não garantimos a qualidade, \
            segurança ou legalidade dos veículos anunciados.
            8.2 Não somos responsáveis por negociações, acordos ou transações entre usuários.
            8.3 Recomendamos que todas as transações sejam realizadas com cautela e verificação presencial.

            9. PROPRIEDADE INTELECTUAL

            9.1 O TeAchei e todo seu conteúdo original são de nossa propriedade.
            9.2 Você não pode copiar, modificar ou distribuir nosso conteúdo sem autorização.

            10. SUSPENSÃO E ENCERRAMENTO

            10.1 Podemos suspender ou encerrar sua conta por violação destes termos.
            10.2 Você pode encerrar sua conta a qualquer momento através do aplicativo.

            11. ALTERAÇÕES NOS TERMOS

            Podemos alterar estes termos a qualquer momento. Mudanças significativas serão \
            comunicadas pelo aplicativo ou por email.

            12. LEI APLICÁVEL

            Estes termos são regidos pela legislação brasileira. Qualquer disputa será resolvida \
            no foro da comarca do usuário consumidor.

            13. CONTATO

            Email: contato@teachei.com.br

            Última atualização: 22 de março de 2026.""";
    }

    private String buildPoliticaPrivacidade() {
        return buildHtmlPage("Política de Privacidade - TeAchei", getPoliticaPrivacidadeTexto());
    }

    private String buildTermosUso() {
        return buildHtmlPage("Termos de Uso - TeAchei", getTermosUsoTexto());
    }

    private String buildHtmlPage(String titulo, String conteudo) {
        String htmlConteudo = conteudo
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("(https?://[^\\s]+)", "<a href=\"$1\">$1</a>")
            .replaceAll("(?m)^\\s*(\\d+\\.\\s+[A-ZÁÉÍÓÚÀÂÊÔÃÕÇ][A-ZÁÉÍÓÚÀÂÊÔÃÕÇ\\s/()]+)$", "<h2>$1</h2>")
            .replaceAll("(?m)^\\s*(\\d+\\.\\d+\\s+.+)$", "<p class=\"sub\">$1</p>")
            .replaceAll("(?m)^\\s*-\\s+(.+)$", "<li>$1</li>")
            .replaceAll("(<li>.*</li>)", "<ul>$1</ul>")
            .replaceAll("</ul>\\s*<ul>", "");

        return """
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                           max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
                    h1 { color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px; }
                    h2 { color: #1a73e8; margin-top: 30px; font-size: 1.1em; }
                    .sub { margin-left: 20px; }
                    ul { margin-left: 40px; }
                    li { margin-bottom: 5px; }
                    a { color: #1a73e8; }
                    .updated { color: #666; font-style: italic; margin-top: 40px; }
                </style>
            </head>
            <body>
                <h1>%s</h1>
                %s
            </body>
            </html>
            """.formatted(titulo, titulo, htmlConteudo);
    }
}
