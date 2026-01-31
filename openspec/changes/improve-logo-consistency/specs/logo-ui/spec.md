# Spec Delta: logo-ui

**Capability**: UI Components - Logo

## MODIFIED Requirements

### Requirement: Logo Component Usage

O componente Logo deve ser usado consistentemente em toda a aplicação, com tamanhos apropriados para cada contexto.

#### Scenario: Header principal
**Given** usuário está em qualquer página autenticada
**When** o header é renderizado
**Then** a logo aparece com tamanho `sm` no desktop e `xs` no mobile
**And** a logo não tem container adicional (sem rounded/bg-white)

#### Scenario: Página 404
**Given** usuário acessa uma URL inexistente
**When** a página 404 é exibida
**Then** a logo é renderizada usando o componente `Logo`
**And** não usa ícones ou texto legado

#### Scenario: Auth layout desktop
**Given** usuário está na página de login ou registro em desktop
**When** o layout é renderizado
**Then** a logo aparece com tamanho `xl` sobre o fundo com overlay

#### Scenario: Auth layout mobile
**Given** usuário está na página de login ou registro em mobile
**When** o layout é renderizado
**Then** a logo aparece com tamanho `md` dentro de container com backdrop

#### Scenario: Landing page
**Given** usuário está na landing page
**When** a página é renderizada
**Then** a logo aparece no header e footer com tamanho `md`

## REMOVED Requirements

### Requirement: Logo com ícone Car + texto
A logo antiga usando ícone Lucide `Car` + texto "TeAchei" não deve mais ser utilizada em nenhum lugar da aplicação.
