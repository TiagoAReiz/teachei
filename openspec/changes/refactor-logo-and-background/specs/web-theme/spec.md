## MODIFIED Requirements

### Requirement: App Background Color

O app SHALL usar uma cor de fundo creme que harmonize com o logo TeAchei.

#### Scenario: Fundo creme consistente
- **WHEN** qualquer página do app é carregada
- **THEN** o fundo MUST ser `#f8f6f0` (creme suave similar ao logo)
- **AND** elementos de superfície (cards, modais) MUST manter `#ffffff` (branco)

### Requirement: Logo Container Styling

O componente Logo SHALL exibir a imagem com bordas arredondadas e espaçamento adequado.

#### Scenario: Logo no header
- **WHEN** o logo é renderizado no header
- **THEN** MUST ter bordas arredondadas (`rounded-2xl`)
- **AND** MUST ter padding interno proporcional ao tamanho
- **AND** MUST ter overflow hidden para garantir arredondamento
- **AND** NÃO MUST ter fundo branco que destoe do background

#### Scenario: Logo em diferentes contextos
- **WHEN** o logo aparece em landing page, auth layout ou página 404
- **THEN** SHALL seguir o mesmo padrão visual do header
- **AND** o tamanho pode variar (xs, sm, md, lg, xl) mas o estilo MUST ser consistente
