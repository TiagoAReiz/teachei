## MODIFIED Requirements

### Requirement: Estilo Visual das Barras de Busca

Os campos de busca de marca, modelo e versão SHALL have an integrated visual style with the page design, without creating excessive contrast with the creme background. The system MUST NOT display search bars with white background over the page's creme background.

#### Scenario: Busca sem fundo branco contrastante
- **WHEN** usuário visualiza a página de seleção de veículo
- **THEN** as barras de busca de marca e modelo não apresentam fundo branco que contraste com o fundo creme da página

#### Scenario: Container sticky transparente
- **WHEN** usuário rola a lista de marcas ou modelos
- **THEN** o container sticky da busca mantém o scroll funcionando sem criar uma "caixa branca" visualmente destoante

#### Scenario: Input de busca com estilo integrado
- **WHEN** usuário foca no campo de busca
- **THEN** o input apresenta borda sutil e fundo que combina com o tema
- **THEN** o estado de foco é indicado com ring na cor primária

#### Scenario: Consistência em dark mode
- **WHEN** usuário está em dark mode
- **THEN** as barras de busca mantêm consistência visual com o tema escuro
- **THEN** não há elementos com cores "vazadas" do tema claro
