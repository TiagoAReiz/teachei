## ADDED Requirements

### Requirement: Public User Intentions Endpoint
The system SHALL provide a public endpoint to list active intentions of any user.

#### Scenario: Fetch user intentions
- **WHEN** a request is made to GET `/v1/anuncios/usuario/{usuarioId}`
- **THEN** the system MUST return all ATIVO intentions created by that user
- **AND** the response MUST follow the same format as the main intentions list
- **AND** contact visibility MUST follow the same rules as other intention endpoints

#### Scenario: User has no active intentions
- **WHEN** the user has no ATIVO intentions
- **THEN** the system MUST return an empty array

#### Scenario: User does not exist
- **WHEN** the userId does not correspond to any user
- **THEN** the system MUST return an empty array (not an error)

### Requirement: Display User Intentions on Profile
The system SHALL display a user's active intentions on their public profile page.

#### Scenario: Profile shows intentions
- **WHEN** viewing a user's public profile at `/profile/{id}`
- **THEN** the page MUST fetch and display the user's active intentions
- **AND** each intention MUST be displayed as a card with vehicle info and price

#### Scenario: User has no intentions
- **WHEN** the user has no active intentions
- **THEN** the page MUST show an appropriate empty state message

### Requirement: Subscription Bypass for User Intentions
The system SHALL bypass subscription checks while app is free.

#### Scenario: Free mode
- **WHEN** the app is in free mode (current state)
- **THEN** user intentions MUST be visible to everyone
- **AND** code MUST include TODO comments for easy reversal
