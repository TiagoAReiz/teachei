## ADDED Requirements

### Requirement: Mobile Filter/Sort Bar
The system SHALL display a sticky filter/sort bar on mobile devices.

#### Scenario: Bar visibility on mobile
- **GIVEN** a user is on the feed page on a mobile device
- **WHEN** the page loads
- **THEN** a sticky bar MUST appear below the search input
- **AND** the bar MUST contain "Filtrar" and "Ordenar" buttons
- **AND** the bar MUST be hidden on desktop (`lg:hidden`)

#### Scenario: Filter button opens sidebar
- **WHEN** the user taps "Filtrar"
- **THEN** the existing filter sidebar MUST open

#### Scenario: Sort button opens dropdown
- **WHEN** the user taps "Ordenar"
- **THEN** a bottom sheet/dropdown MUST appear with sort options

### Requirement: Sort Options
The system SHALL provide multiple sort options for intentions.

#### Scenario: Available sort options
- **WHEN** the user opens the sort dropdown
- **THEN** the following options MUST be available:
  - Mais recentes (default)
  - Menor preço
  - Maior preço
  - Menor km
  - Ano mais novo
  - A-Z (alfabético)

#### Scenario: Sort persists in URL
- **WHEN** the user selects a sort option
- **THEN** the `ordenar` query param MUST update in the URL
- **AND** the feed MUST reload with the new sort order

### Requirement: Backend Sort Support
The system SHALL support sorting intentions via API.

#### Scenario: Sort parameter in API
- **GIVEN** a request to GET `/v1/anuncios`
- **WHEN** the `ordenar` parameter is provided
- **THEN** results MUST be sorted according to the value
- **AND** valid values are: `recente`, `preco_asc`, `preco_desc`, `km_asc`, `ano_desc`, `nome_asc`

#### Scenario: Default sort order
- **WHEN** no `ordenar` parameter is provided
- **THEN** results MUST be sorted by `criadoEm DESC` (most recent first)
