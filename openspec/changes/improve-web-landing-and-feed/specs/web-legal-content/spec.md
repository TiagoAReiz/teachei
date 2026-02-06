## ADDED Requirements

### Requirement: Free Platform Terms of Use
The Terms of Use page SHALL clearly state that the TeAchei platform is 100% free for all users. The terms MUST NOT reference any payment, subscription, or fee. The contact email MUST be `app.teachei.shop@gmail.com`.

#### Scenario: User views terms of use
- **WHEN** the user navigates to `/termos`
- **THEN** the page displays terms of use with no mention of payments, fees, or Mercado Pago
- **AND** the contact section shows the email `app.teachei.shop@gmail.com`

### Requirement: Updated Privacy Policy Contact
The Privacy Policy page SHALL display the correct contact email `app.teachei.shop@gmail.com`.

#### Scenario: User views privacy policy
- **WHEN** the user navigates to `/privacidade`
- **THEN** the contact section displays `app.teachei.shop@gmail.com`
