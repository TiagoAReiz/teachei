## ADDED Requirements

### Requirement: Require Authentication for Intention Details
The system SHALL require users to be authenticated to view intention details.

#### Scenario: Unauthenticated user tries to view intention
- **GIVEN** a user is not logged in
- **WHEN** they navigate to `/intention/{id}`
- **THEN** they MUST be redirected to `/login`
- **AND** the redirect URL MUST preserve the original intention URL

#### Scenario: Authenticated user views intention
- **GIVEN** a user is logged in
- **WHEN** they navigate to `/intention/{id}`
- **THEN** the intention details MUST be displayed normally

#### Scenario: Redirect after login
- **GIVEN** a user was redirected to login from an intention page
- **WHEN** they complete login
- **THEN** they MUST be redirected back to the original intention page

#### Scenario: Loading state during auth check
- **GIVEN** a user navigates to `/intention/{id}`
- **WHEN** the authentication status is being verified
- **THEN** a loading indicator MUST be shown
