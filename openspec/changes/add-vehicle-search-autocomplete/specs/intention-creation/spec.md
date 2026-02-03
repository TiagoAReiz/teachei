## ADDED Requirements

### Requirement: Searchable Brand Selection

The system SHALL provide a searchable input field for brand selection that filters the brand list in real-time as the user types.

#### Scenario: User searches for a brand by name
- **GIVEN** the user is on the vehicle selection step
- **WHEN** the user types "vol" in the brand search field
- **THEN** only brands containing "vol" are displayed (e.g., "Volkswagen", "Volvo")
- **AND** the search is case-insensitive

#### Scenario: User clears the search
- **GIVEN** the user has typed a search term
- **WHEN** the user clears the search field
- **THEN** all brands are displayed again

#### Scenario: No matching brands
- **GIVEN** the user is searching for a brand
- **WHEN** no brands match the search term
- **THEN** a message "Nenhuma marca encontrada" is displayed

### Requirement: Searchable Model Selection

The system SHALL provide a searchable input field for model selection that filters the model list in real-time as the user types.

#### Scenario: User searches for a model by name
- **GIVEN** the user has selected a brand
- **AND** the user is on the model selection step
- **WHEN** the user types "civic" in the model search field
- **THEN** only models containing "civic" are displayed
- **AND** the search is case-insensitive

#### Scenario: Search matches across model versions
- **GIVEN** the user is searching for a model
- **WHEN** the search term matches multiple grouped versions
- **THEN** the model group is displayed with all matching versions

### Requirement: Searchable Version Selection

The system SHALL provide a searchable input field for version selection that filters versions in real-time while maintaining multi-select capability.

#### Scenario: User filters versions
- **GIVEN** the user has selected a model base
- **AND** multiple versions are displayed
- **WHEN** the user types "LTZ" in the version filter
- **THEN** only versions containing "LTZ" are displayed
- **AND** the user can still select multiple versions

#### Scenario: Select all with active filter
- **GIVEN** the user has filtered the versions list
- **WHEN** the user clicks "Selecionar todas as versões"
- **THEN** all VISIBLE (filtered) versions are selected
- **AND** hidden versions remain in their previous state
