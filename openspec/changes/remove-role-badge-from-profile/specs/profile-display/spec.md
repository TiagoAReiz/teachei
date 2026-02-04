## REMOVED Requirements

### Requirement: Role Badge Display
The profile pages SHALL NOT display a role badge (Comprador/Lojista).

**Reason**: The platform no longer distinguishes between buyers and sellers - all users can both create purchase intentions and respond to them.

**Migration**: Remove the Badge component that displays the role from all profile page variants.

#### Scenario: Own profile without role badge
- **WHEN** user views their own profile page
- **THEN** no role badge (Comprador/Lojista) SHALL be displayed

#### Scenario: Public profile without role badge
- **WHEN** user views another user's profile
- **THEN** no role badge (Comprador/Lojista) SHALL be displayed
