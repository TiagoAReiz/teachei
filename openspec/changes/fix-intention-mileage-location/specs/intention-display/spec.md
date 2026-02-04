## ADDED Requirements

### Requirement: Mileage Display in Intention Card
The intention card component SHALL display the mileage range when available.

#### Scenario: Display mileage range
- **WHEN** an intention has both quilometragemMinima and quilometragemMaxima
- **THEN** the card SHALL display the range formatted as "X - Y km"

#### Scenario: Display minimum mileage only
- **WHEN** an intention has only quilometragemMinima
- **THEN** the card SHALL display "A partir de X km"

#### Scenario: Display maximum mileage only
- **WHEN** an intention has only quilometragemMaxima
- **THEN** the card SHALL display "Até X km"

#### Scenario: No mileage specified
- **WHEN** an intention has neither quilometragemMinima nor quilometragemMaxima
- **THEN** the card SHALL NOT display the mileage field

### Requirement: Mileage Display in Intention Detail
The intention detail screen SHALL display the mileage in the vehicle specifications section.

#### Scenario: Display mileage in specs
- **WHEN** an intention has quilometragem values
- **THEN** the detail screen SHALL show a "Quilometragem" item in the specs list with a Gauge icon

#### Scenario: No mileage in detail
- **WHEN** an intention has no quilometragem values
- **THEN** the detail screen SHALL NOT show the quilometragem spec item

### Requirement: Location Selector State Change
The location selector in intention creation SHALL clear the city when the state changes.

#### Scenario: State change clears city
- **WHEN** user selects a new state in the intention creation location picker
- **THEN** the city field SHALL be cleared
- **AND** the city dropdown SHALL load cities for the new state

#### Scenario: Independent city selection
- **WHEN** user selects a city
- **THEN** only the city field SHALL be updated
- **AND** the state field SHALL remain unchanged
