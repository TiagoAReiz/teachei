## ADDED Requirements

### Requirement: Google AdSense Integration
O sistema web DEVE incluir o script do Google AdSense para exibição de anúncios e monetização do tráfego.

#### Scenario: AdSense carregado em produção
- **GIVEN** o ambiente é produção (`NODE_ENV=production`)
- **AND** a variável `NEXT_PUBLIC_ADSENSE_ID` está configurada
- **WHEN** um usuário acessa qualquer página do site
- **THEN** o script do AdSense é carregado no `<head>` com strategy `afterInteractive`
- **AND** o script usa o atributo `crossOrigin="anonymous"`

#### Scenario: AdSense não carrega em desenvolvimento
- **GIVEN** o ambiente é desenvolvimento (`NODE_ENV=development`)
- **WHEN** um desenvolvedor acessa qualquer página localmente
- **THEN** o script do AdSense NÃO é carregado
- **AND** nenhum request é feito para `pagead2.googlesyndication.com`

### Requirement: Arquivo ads.txt
O sistema DEVE disponibilizar um arquivo `ads.txt` na raiz pública para verificação de autorização do Google AdSense.

#### Scenario: ads.txt acessível
- **GIVEN** o site está publicado
- **WHEN** o Google crawler acessa `/ads.txt`
- **THEN** o arquivo retorna o publisher ID no formato correto
- **AND** o status HTTP é 200
