# Spec Delta: theme

**Capability**: Visual Theme

## MODIFIED Requirements

### Requirement: Background Color

O fundo do app deve usar cor creme suave para harmonizar com a logo da marca.

#### Scenario: Light mode background
**Given** usuário está no modo claro
**When** qualquer página é renderizada
**Then** o fundo deve ser cor creme `#faf8f5`
**And** elementos de superfície (cards) devem ser brancos `#ffffff`

### Requirement: Logo Container Style

A logo deve ter container visual consistente em toda aplicação.

#### Scenario: Logo no header
**Given** usuário visualiza o header
**When** a logo é renderizada
**Then** ela aparece com container branco
**And** com bordas arredondadas (rounded-2xl)
**And** com padding interno (px-4 py-2)
**And** com sombra sutil (shadow-sm)

#### Scenario: Logo em outras páginas
**Given** usuário está em landing, auth ou 404
**When** a logo é renderizada
**Then** segue o mesmo padrão visual do header
