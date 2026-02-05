## ADDED Requirements

### Requirement: Profile Photo Upload via Blob Storage
The system SHALL upload profile photos exclusively to Azure Blob Storage.

#### Scenario: Successful photo upload
- **GIVEN** a user is authenticated
- **WHEN** the user uploads a profile photo (JPEG, PNG, or WebP, max 5MB)
- **THEN** the system uploads the photo to Azure Blob Storage
- **AND** stores the resulting URL in the `foto_url` field
- **AND** returns success response with updated profile

#### Scenario: Photo upload fails due to Blob Storage error
- **GIVEN** a user is authenticated
- **WHEN** the user uploads a profile photo
- **AND** Azure Blob Storage is unavailable or returns an error
- **THEN** the system SHALL return an error response to the user
- **AND** SHALL NOT store the photo in any fallback location

#### Scenario: Photo upload replaces existing photo
- **GIVEN** a user has an existing profile photo in Blob Storage
- **WHEN** the user uploads a new photo
- **THEN** the system deletes the old photo from Blob Storage
- **AND** uploads the new photo
- **AND** updates `foto_url` with the new URL

### Requirement: Profile Photo Removal
The system SHALL allow users to remove their profile photo.

#### Scenario: Successful photo removal
- **GIVEN** a user has a profile photo stored in Blob Storage
- **WHEN** the user requests to remove their photo
- **THEN** the system deletes the photo from Blob Storage
- **AND** sets `foto_url` to null
- **AND** returns success response

#### Scenario: Photo removal with no existing photo
- **GIVEN** a user has no profile photo
- **WHEN** the user requests to remove their photo
- **THEN** the system returns success (idempotent operation)

### Requirement: Profile Photo Display
The system SHALL display profile photos from Blob Storage URLs only.

#### Scenario: Display photo from URL
- **GIVEN** a user profile has a `foto_url` value
- **WHEN** the profile is displayed
- **THEN** the avatar component loads the image from the Blob Storage URL

#### Scenario: Display fallback when no photo
- **GIVEN** a user profile has no `foto_url` (null or empty)
- **WHEN** the profile is displayed
- **THEN** the avatar component shows initials or default avatar

## REMOVED Requirements

### Requirement: Base64 Photo Storage Fallback
**Reason**: Base64 storage in database is inefficient and redundant with Blob Storage.
**Migration**: Users with existing Base64 photos will need to re-upload their photo. The `foto_base64` column will be dropped from the database.
