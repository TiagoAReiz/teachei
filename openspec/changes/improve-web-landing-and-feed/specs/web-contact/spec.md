## ADDED Requirements

### Requirement: Contact Page
The system SHALL provide a `/contato` page ("Fale Conosco") that displays the following contact channels as direct, clickable links:
- **Phone/WhatsApp**: `11944434123` — opens WhatsApp via `https://wa.me/5511944434123`
- **Email**: `app.teachei.shop@gmail.com` — opens default mail client via `mailto:` link
- **Instagram**: `@teacheiapp` — opens Instagram profile via `https://www.instagram.com/teacheiapp`

The page MUST follow the site's existing visual pattern (cards, surface backgrounds, consistent typography).

#### Scenario: User accesses contact page
- **WHEN** the user navigates to `/contato`
- **THEN** the page displays WhatsApp, email, and Instagram as clickable links
- **AND** clicking WhatsApp opens `https://wa.me/5511944434123`
- **AND** clicking email opens `mailto:app.teachei.shop@gmail.com`
- **AND** clicking Instagram opens `https://www.instagram.com/teacheiapp`

### Requirement: Contact Link in Header
The header SHALL display a contact icon (e.g., phone or headphones icon) that links to `/contato`. The icon MUST be visible to all users (authenticated and unauthenticated).

#### Scenario: User clicks contact icon in header
- **WHEN** the user clicks the contact icon in the header
- **THEN** the user is navigated to the `/contato` page

### Requirement: Contact Link in Footer
The footer SHALL include a "Fale Conosco" link pointing to `/contato`, replacing the current dead `/suporte` link. This applies to both the layout footer component and the landing page embedded footer.

#### Scenario: User clicks Fale Conosco in footer
- **WHEN** the user clicks "Fale Conosco" in the footer
- **THEN** the user is navigated to the `/contato` page
