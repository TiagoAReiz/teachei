## MODIFIED Requirements

### Requirement: API Error Handling and Automatic Logout

The system SHALL handle authentication errors (401 and 403) by automatically logging out the user and redirecting to the login page.

When an API request returns a 401 (Unauthorized) or 403 (Forbidden) status code, the system SHALL:
1. Remove the authentication token from storage
2. Redirect the user to the login page
3. Throw an appropriate error for the calling code to handle

#### Scenario: 401 Unauthorized triggers logout

- **WHEN** an API request returns status code 401
- **THEN** the authentication token SHALL be removed from cookies/storage
- **AND** the user SHALL be redirected to `/login` (web) or `/(auth)/login` (mobile)
- **AND** an "Unauthorized" error SHALL be thrown

#### Scenario: 403 Forbidden triggers logout

- **WHEN** an API request returns status code 403
- **THEN** the authentication token SHALL be removed from cookies/storage
- **AND** the user SHALL be redirected to `/login` (web) or `/(auth)/login` (mobile)
- **AND** a "Forbidden" error SHALL be thrown

#### Scenario: Other errors do not trigger logout

- **WHEN** an API request returns a non-401/403 error status code (e.g., 400, 404, 500)
- **THEN** the authentication token SHALL NOT be removed
- **AND** the user SHALL NOT be redirected
- **AND** the error SHALL be propagated to the calling code
