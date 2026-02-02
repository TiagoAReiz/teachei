## ADDED Requirements

### Requirement: Toast Mobile Positioning
The system SHALL position toast notifications above the mobile navigation menu.

#### Scenario: Toast appears above mobile nav
- **WHEN** a toast notification is displayed on mobile
- **THEN** it MUST appear above the bottom navigation (not behind it)
- **AND** it MUST be horizontally centered on mobile
- **AND** it MUST remain in bottom-right on desktop

### Requirement: Mobile Navigation Sizing
The system SHALL provide a larger mobile navigation for better touch targets.

#### Scenario: Navigation height on mobile
- **WHEN** viewing the app on mobile
- **THEN** the bottom navigation MUST have a height of at least 80px (h-20)
- **AND** icons MUST be at least 26px
- **AND** labels MUST be readable (text-sm)

### Requirement: Hide Hamburger on Mobile
The system SHALL hide the hamburger menu icon on mobile since bottom navigation exists.

#### Scenario: Hamburger visibility
- **WHEN** viewing on mobile (< lg breakpoint)
- **THEN** the hamburger menu button MUST be hidden
- **AND** the bottom navigation provides all navigation options

### Requirement: Responsive Intention Chips
The system SHALL display intention specification chips responsively.

#### Scenario: Chips on mobile
- **WHEN** viewing intention details on mobile
- **THEN** each spec chip MUST occupy full width (grid-cols-1)
- **AND** text MUST NOT be truncated or overflow

#### Scenario: Chips on desktop
- **WHEN** viewing intention details on desktop
- **THEN** specs MUST display in 2-3 columns grid

### Requirement: Profile Photo Display
The system SHALL display the user's profile photo correctly.

#### Scenario: Own profile photo
- **WHEN** viewing own profile page
- **THEN** the Avatar component MUST receive both `src` and `fotoBase64` props
- **AND** the photo MUST be displayed if available

### Requirement: Seller Profile Link
The system SHALL display seller information in intention contact section with link to profile.

#### Scenario: Seller info in contact section
- **WHEN** viewing an intention's contact section
- **THEN** the seller's photo MUST be displayed
- **AND** the seller's name MUST be displayed
- **AND** clicking on photo or name MUST navigate to seller's public profile

### Requirement: Public Profile Page
The system SHALL provide a public profile page viewable by any user.

#### Scenario: View public profile
- **WHEN** navigating to `/profile/{userId}`
- **THEN** the system MUST display the user's public information (name, city, photo)
- **AND** the system MUST list the user's active intentions
- **AND** private information (email, phone) MUST NOT be displayed

### Requirement: Subscription Bypass for Free Mode
The system SHALL bypass subscription checks for seller profile visibility while app is free.

#### Scenario: Free mode - seller info always visible
- **WHEN** the app is in free mode (current state)
- **THEN** seller photo and name MUST be visible in intention contact section
- **AND** profile link MUST be accessible without subscription
- **AND** code MUST include TODO comments for easy reversal

#### Scenario: Easy reversal to monetization
- **WHEN** the business decides to enable subscriptions
- **THEN** the reversal MUST require uncommenting/enabling subscription checks
- **AND** seller info visibility MUST be consistent with `contatoOculto` logic
- **AND** profile access MUST require active subscription
