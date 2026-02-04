## ADDED Requirements

### Requirement: Brazilian Phone Number Validation
The WhatsApp phone field SHALL only accept valid Brazilian mobile phone numbers in international format.

#### Scenario: Valid Brazilian mobile number
- **WHEN** user enters "+5511999998888" in the WhatsApp field
- **THEN** the validation SHALL pass
- **AND** the number SHALL be accepted

#### Scenario: Valid Brazilian mobile number with different DDD
- **WHEN** user enters "+5521987654321" in the WhatsApp field
- **THEN** the validation SHALL pass

#### Scenario: Missing country code
- **WHEN** user enters "11999998888" (without +55)
- **THEN** the validation SHALL fail
- **AND** error message SHALL indicate the required format

#### Scenario: Non-Brazilian country code
- **WHEN** user enters "+1234567890" (US format)
- **THEN** the validation SHALL fail
- **AND** error message SHALL indicate only Brazilian numbers are accepted

#### Scenario: Wrong number length
- **WHEN** user enters "+55119999988" (missing digit)
- **THEN** the validation SHALL fail
- **AND** error message SHALL indicate the correct format

#### Scenario: Empty value allowed
- **WHEN** user leaves the WhatsApp field empty
- **THEN** the validation SHALL pass (field is optional in profile)
