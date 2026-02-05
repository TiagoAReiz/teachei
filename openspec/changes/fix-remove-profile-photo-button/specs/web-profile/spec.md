## MODIFIED Requirements

### Requirement: Profile Photo Removal
The system SHALL allow users to remove their profile photo with immediate visual feedback.

#### Scenario: Remove profile photo successfully
- **GIVEN** an authenticated user with a profile photo
- **WHEN** user clicks "Remover foto"
- **THEN** the photo SHALL disappear immediately from the UI
- **AND** the system SHALL call the backend to delete the photo
- **AND** the "Remover foto" button SHALL be hidden

#### Scenario: Photo does not reappear after removal
- **GIVEN** an authenticated user who just removed their profile photo
- **WHEN** the backend confirms deletion
- **THEN** the photo SHALL NOT reappear in the UI
- **AND** the Avatar SHALL display the user's initials fallback

#### Scenario: Upload new photo after removal
- **GIVEN** an authenticated user who previously removed their photo
- **WHEN** user uploads a new profile photo
- **THEN** the new photo SHALL be displayed immediately
- **AND** the "Remover foto" button SHALL reappear
