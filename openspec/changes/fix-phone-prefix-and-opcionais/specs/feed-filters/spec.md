## MODIFIED Requirements

### Requirement: Vehicle Optional Features Filter

The system SHALL display optional features (opcionais) for filtering intentions based on the selected vehicle type.

Optional features MUST be fetched dynamically from the API endpoint `/api/v1/anuncios/filtros?tipo={TipoVeiculo}`.

The optionals section SHALL only appear after a vehicle type is selected.

#### Scenario: No vehicle type selected

- **WHEN** no vehicle type filter is active
- **THEN** the optionals section SHALL display a message: "Selecione um tipo de veículo para ver os opcionais"
- **AND** no optional checkboxes SHALL be displayed

#### Scenario: Vehicle type selected shows optionals

- **WHEN** the user selects a vehicle type (CARRO, MOTO, or CAMINHAO)
- **THEN** the system SHALL fetch optionals from the API for that vehicle type
- **AND** display loading state while fetching
- **AND** display the list of optionals as selectable checkboxes once loaded

#### Scenario: Vehicle type changed clears optionals

- **WHEN** the user changes the vehicle type filter
- **THEN** previously selected optionals SHALL be cleared
- **AND** new optionals for the selected type SHALL be loaded

#### Scenario: API returns empty optionals

- **WHEN** the API returns an empty list of optionals for a vehicle type
- **THEN** the system SHALL display a message: "Nenhum opcional disponível para este tipo de veículo"
