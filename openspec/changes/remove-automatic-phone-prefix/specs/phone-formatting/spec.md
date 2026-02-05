## MODIFIED Requirements

### Requirement: Phone Number Input Formatting

The system SHALL NOT automatically add the "+55" country code prefix when the user types digits. The user is responsible for entering the complete phone number including the country code.

The system SHALL apply visual formatting (spaces, parentheses, dashes) only to numbers that already include the "+55" prefix.

#### Scenario: Empty phone field initialization

- **WHEN** the phone input field is focused with no prior value
- **THEN** the field SHALL display empty (no text)
- **AND** placeholder text SHALL indicate the expected format (e.g., "+5511999998888")

#### Scenario: User types digits without country code

- **WHEN** the user types "11999998888" (without +55)
- **THEN** the field SHALL display "11999998888" as typed
- **AND** the system SHALL NOT automatically prepend "+55"

#### Scenario: User types with country code

- **WHEN** the user types "+5511999998888" (with +55)
- **THEN** the field SHALL format to "+55 (11) 99999-8888"
- **AND** visual separators SHALL be applied progressively

#### Scenario: Validation requires country code

- **WHEN** the user attempts to save a phone without +55 prefix
- **THEN** validation SHALL fail
- **AND** error message SHALL indicate the required format: "Use o formato com código do país: +5511999998888"

#### Scenario: Existing phone with +55 loaded from profile

- **WHEN** a phone number "+5511999998888" is loaded from user profile
- **THEN** the field SHALL display formatted as "+55 (11) 99999-8888"

#### Scenario: Strip formatting preserves original format

- **WHEN** phone is saved to backend
- **THEN** the system SHALL remove only visual separators (spaces, parentheses, dashes)
- **AND** SHALL NOT add "+55" if it was not present in the input
