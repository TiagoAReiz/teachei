## ADDED Requirements

### Requirement: Mileage Input Formatting
The mileage input component SHALL automatically format numeric values with thousand separators in Brazilian locale.

#### Scenario: Format while typing
- **WHEN** user types "50000" in the mileage input
- **THEN** the display SHALL show "50.000"
- **AND** the stored numeric value SHALL be 50000

#### Scenario: Display suffix
- **WHEN** mileage input has a value
- **THEN** the input SHALL display "km" suffix

#### Scenario: Empty value
- **WHEN** user clears the mileage input
- **THEN** the display SHALL be empty
- **AND** the stored value SHALL be null

#### Scenario: Only numeric input
- **WHEN** user attempts to type non-numeric characters
- **THEN** the input SHALL ignore non-numeric characters
- **AND** only allow digits

### Requirement: Mileage Input Integration
The mileage input component SHALL be used in intention creation and edit forms.

#### Scenario: Creation form uses formatted input
- **WHEN** user is on the intention creation specs page
- **THEN** the mileage fields SHALL use the formatted MileageInput component

#### Scenario: Edit form uses formatted input
- **WHEN** user is on the intention edit page
- **THEN** the mileage fields SHALL use the formatted MileageInput component
- **AND** existing values SHALL be displayed with formatting
