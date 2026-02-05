## MODIFIED Requirements

### Requirement: Phone Number Input Formatting

The system SHALL format Brazilian phone numbers as the user types, applying visual separators progressively.

When the input field is empty or contains no digits, the field SHALL remain empty (no automatic prefix).

When the user starts typing digits, the system SHALL:
- Add the `+55` country code prefix
- Format progressively as: `+55 (XX) XXXXX-XXXX`

#### Scenario: Empty phone field initialization

- **WHEN** the phone input field is focused with no prior value
- **THEN** the field SHALL display empty (no text)
- **AND** placeholder text MAY indicate the expected format

#### Scenario: User begins typing digits

- **WHEN** the user types the first digit (e.g., "1")
- **THEN** the field SHALL display `+55 (1`
- **AND** continue formatting as more digits are entered

#### Scenario: Full phone number entry

- **WHEN** the user enters all 11 digits (DDD + 9-digit number)
- **THEN** the field SHALL display formatted as `+55 (XX) XXXXX-XXXX`
- **AND** the stored value for backend submission SHALL be `+55XXXXXXXXXXX` (digits only with + prefix)

#### Scenario: Empty field validation

- **WHEN** the phone field is empty and optional
- **THEN** validation SHALL pass (no error)
- **AND** the value sent to backend SHALL be empty string or null
