## ADDED Requirements

### Requirement: IBGE States API Integration
The system SHALL fetch Brazilian states from the IBGE API.

#### Scenario: Load states on mount
- **GIVEN** the LocationPicker component mounts
- **WHEN** states have not been fetched yet
- **THEN** the system MUST fetch states from IBGE API
- **AND** display them in a dropdown ordered alphabetically

#### Scenario: States are cached
- **GIVEN** states have been fetched previously
- **WHEN** the component mounts again
- **THEN** the cached states MUST be used

### Requirement: IBGE Cities API Integration
The system SHALL fetch cities based on selected state.

#### Scenario: Load cities when state is selected
- **GIVEN** a user selects a state
- **WHEN** the state selection changes
- **THEN** the system MUST fetch cities for that state from IBGE API
- **AND** display them in a dropdown ordered alphabetically

#### Scenario: Clear city when state changes
- **GIVEN** a user has selected a city
- **WHEN** the state selection changes
- **THEN** the city selection MUST be cleared

### Requirement: LocationPicker Component
The system SHALL provide a reusable location picker component.

#### Scenario: Display state selector
- **GIVEN** the component renders
- **THEN** a state dropdown MUST be displayed with placeholder "Selecione o estado"

#### Scenario: Display city selector
- **GIVEN** a state has been selected
- **THEN** a city dropdown MUST be displayed with placeholder "Selecione a cidade"
- **AND** cities MUST be loaded from IBGE API

#### Scenario: City selector disabled without state
- **GIVEN** no state has been selected
- **THEN** the city dropdown MUST be disabled

### Requirement: Backend UF Validation
The system SHALL validate that estado is a valid Brazilian UF.

#### Scenario: Valid UF accepted
- **GIVEN** a request with estado="SP"
- **THEN** the request MUST be accepted

#### Scenario: Invalid UF rejected
- **GIVEN** a request with estado="XX"
- **THEN** the request MUST be rejected with validation error
