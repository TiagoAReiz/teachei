## MODIFIED Requirements

### Requirement: Root URL Shows Landing Page

The root URL (`/`) SHALL always display the landing page, regardless of authentication status.

This allows:
- Consistent URL behavior (same URL, same content)
- Shareable landing page links
- Clear separation between marketing (landing) and app (feed) pages

#### Scenario: Unauthenticated user visits root

- **WHEN** an unauthenticated user navigates to `/`
- **THEN** the landing page SHALL be displayed
- **AND** login/register CTAs SHALL be visible

#### Scenario: Authenticated user visits root

- **WHEN** an authenticated user navigates to `/`
- **THEN** the landing page SHALL be displayed
- **AND** a "Go to Feed" or similar CTA MAY be shown to navigate to `/feed`

### Requirement: Feed URL for Authenticated Users

The feed of intentions SHALL be accessible at `/feed`.

Authenticated users SHALL be redirected to `/feed` after successful login.

#### Scenario: Authenticated user accesses feed

- **WHEN** an authenticated user navigates to `/feed`
- **THEN** the feed of intentions SHALL be displayed
- **AND** filters and sorting options SHALL be available

#### Scenario: Unauthenticated user accesses feed

- **WHEN** an unauthenticated user navigates to `/feed`
- **THEN** the feed MAY be displayed (public intentions are viewable)
- **OR** the user MAY be redirected to `/login` if feed requires authentication

### Requirement: Post-Login Redirect

After successful login or registration, authenticated users SHALL be redirected to `/feed` instead of `/`.

#### Scenario: Successful login redirects to feed

- **WHEN** a user successfully logs in
- **THEN** the user SHALL be redirected to `/feed`
- **AND** the feed content SHALL be displayed

#### Scenario: Successful registration redirects to feed

- **WHEN** a user successfully registers
- **THEN** the user SHALL be redirected to `/feed`
- **AND** the feed content SHALL be displayed
