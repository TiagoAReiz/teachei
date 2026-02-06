## ADDED Requirements

### Requirement: City and UF Filter
The feed filter sidebar SHALL include a location filter (city/UF) displayed ABOVE the vehicle type filter. The filter SHALL present all distinct city/state combinations from existing active intentions. The user MUST be able to select a city and UF to narrow down the feed results.

#### Scenario: User filters by city and UF
- **WHEN** the user opens the filter sidebar on the feed page
- **THEN** a location selector is displayed above the vehicle type selector
- **AND** the selector shows all cities and UFs that have at least one active intention
- **WHEN** the user selects a city/UF combination and applies filters
- **THEN** the feed shows only intentions matching the selected location
- **AND** the URL is updated with `cidade` and `estado` query parameters

#### Scenario: Active filter chip for location
- **WHEN** a city/UF filter is active
- **THEN** an active filter chip is displayed showing the selected city/UF
- **AND** the user can remove the location filter by clicking the chip's X button

### Requirement: Backend Location Filter Options
The available-filters API endpoint SHALL return a `localizacoes` field containing a list of distinct `{cidade, estado}` objects from active intentions.

#### Scenario: Frontend requests available location filters
- **WHEN** the frontend calls `GET /v1/anuncios/filtros`
- **THEN** the response includes a `localizacoes` array with distinct city/state pairs
- **AND** each item has `cidade` (string) and `estado` (string) fields
