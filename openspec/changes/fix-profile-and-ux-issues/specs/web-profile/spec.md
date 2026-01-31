## ADDED Requirements

### Requirement: Partial Profile Update Support
The backend profile update API SHALL preserve existing field values when the request contains null values for those fields.

#### Scenario: Photo upload preserves other fields
- **WHEN** user uploads a new profile photo
- **AND** the request contains only `fotoBase64` field
- **THEN** existing profile fields (nome, bio, whatsapp, etc.) SHALL remain unchanged
- **AND** only the `fotoBase64` field SHALL be updated

#### Scenario: Explicit field clearing
- **WHEN** user submits profile update with an empty string for a field
- **THEN** that field SHALL be updated to empty/cleared
- **AND** null fields SHALL be ignored

---

### Requirement: Consistent Favorites Icon
The favorites navigation item SHALL use the Flag icon across all navigation elements for consistency with the intention card save button.

#### Scenario: Mobile navigation favorites icon
- **WHEN** user views the mobile bottom navigation
- **THEN** the "Salvos" item SHALL display a Flag icon

#### Scenario: Desktop header favorites icon
- **WHEN** user views the desktop header navigation
- **THEN** the "Favoritos" item SHALL display a Flag icon

---

### Requirement: Specific Validation Error Messages
The frontend SHALL display specific field validation errors instead of generic messages when profile update validation fails.

#### Scenario: Display field-specific error
- **WHEN** profile update fails due to validation error
- **AND** backend returns fieldErrors array
- **THEN** the error message SHALL include the field name and specific validation message
- **AND** the toast message SHALL be descriptive (e.g., "WhatsApp: deve estar no formato internacional")

#### Scenario: Multiple validation errors
- **WHEN** profile update fails with multiple field errors
- **THEN** all field errors SHALL be displayed
- **OR** the first error SHALL be shown with indication of additional errors
