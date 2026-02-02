## ADDED Requirements

### Requirement: Backend Subscription Bypass
The backend SHALL bypass subscription checks while app is free, with easy reversal.

#### Scenario: Free mode - API returns full contact
- **WHEN** the app is in free mode (current state)
- **THEN** the backend MUST set `ocultarContato = false` always
- **AND** the API response MUST include full contact (whatsapp, instagram)
- **AND** the response MUST have `contatoOculto: false`

#### Scenario: Easy reversal to monetization
- **WHEN** the business decides to enable subscriptions
- **THEN** the reversal MUST require uncommenting the subscription check in `AnuncioController.java`
- **AND** a clear TODO comment MUST document this

### Requirement: Frontend Visual Consistency
The frontend SHALL use backend's `contatoOculto` flag consistently.

#### Scenario: Single source of truth
- **WHEN** rendering the intention details page
- **THEN** both the contact section AND the fixed CTA MUST use `intention.contatoOculto`
- **AND** MUST NOT have separate hardcoded values (`false`, `true`)
