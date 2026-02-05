# Capability: Blob Storage for Photos

## ADDED Requirements

### Requirement: Profile Photo Upload to Blob Storage
The system SHALL upload profile photos to Azure Blob Storage instead of storing as Base64 in PostgreSQL.

#### Scenario: Upload new profile photo
- **GIVEN** an authenticated user
- **WHEN** user uploads a profile photo (Base64)
- **THEN** the system SHALL upload the image to `profile-photos/users/{userId}/avatar.jpg`
- **AND** store the resulting URL in the `foto_url` field
- **AND** return the URL in the response

#### Scenario: Delete profile photo
- **GIVEN** an authenticated user with a profile photo
- **WHEN** user deletes their profile photo
- **THEN** the system SHALL delete the blob from storage
- **AND** clear the `foto_url` field

### Requirement: Profile Photo Display with Fallback
The system SHALL display profile photos with fallback to Base64 for backward compatibility.

#### Scenario: Display photo from URL
- **GIVEN** a user profile with `fotoUrl` set
- **WHEN** displaying the user's avatar
- **THEN** the system SHALL use the `fotoUrl` as image source

#### Scenario: Fallback to Base64
- **GIVEN** a user profile with `fotoUrl` empty but `fotoBase64` set
- **WHEN** displaying the user's avatar
- **THEN** the system SHALL use the `fotoBase64` as image source

#### Scenario: Default avatar
- **GIVEN** a user profile with no photo
- **WHEN** displaying the user's avatar
- **THEN** the system SHALL display initials-based avatar

### Requirement: Intention Reference Photo
The system SHALL allow buyers to optionally upload a reference photo when creating a purchase intention.

#### Scenario: Create intention with reference photo
- **GIVEN** an authenticated buyer
- **WHEN** creating a new intention with a reference photo
- **THEN** the system SHALL upload the image to `vehicle-photos/intentions/{intentionId}/reference.jpg`
- **AND** store the URL in `veiculoInfo.fotoReferenciaUrl`

#### Scenario: Create intention without reference photo
- **GIVEN** an authenticated buyer
- **WHEN** creating a new intention without a reference photo
- **THEN** the system SHALL create the intention normally
- **AND** `veiculoInfo.fotoReferenciaUrl` SHALL be null

#### Scenario: Update intention reference photo
- **GIVEN** an existing intention owned by the user
- **WHEN** user updates the intention with a new reference photo
- **THEN** the system SHALL replace the existing photo in blob storage
- **AND** update the URL if changed

#### Scenario: Delete intention with photo
- **GIVEN** an intention with a reference photo
- **WHEN** the intention is deleted
- **THEN** the system SHALL delete the associated photo from blob storage

### Requirement: Local Development with Azurite
The system SHALL support local development using Azurite emulator.

#### Scenario: Local blob storage
- **GIVEN** the application running in local/dev profile
- **WHEN** uploading or retrieving photos
- **THEN** the system SHALL use Azurite endpoint (`http://127.0.0.1:10000/devstoreaccount1`)

#### Scenario: Production blob storage
- **GIVEN** the application running in production profile
- **WHEN** uploading or retrieving photos
- **THEN** the system SHALL use Azure Blob Storage endpoint

### Requirement: Image Size Limits
The system SHALL enforce size limits for uploaded images.

#### Scenario: Image within size limit
- **GIVEN** an image upload request
- **WHEN** the image is 2MB or less
- **THEN** the system SHALL accept and process the upload

#### Scenario: Image exceeds size limit
- **GIVEN** an image upload request
- **WHEN** the image exceeds 2MB
- **THEN** the system SHALL reject the upload
- **AND** return error 400 with message "Imagem deve ter no máximo 2MB"
