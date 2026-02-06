## ADDED Requirements

### Requirement: Centered Prominent Search in Feed Header
The search input in the header SHALL be visually prominent and centered within the header bar. On desktop, the search input MUST use `flex-1` with adequate `max-w` to fill the available center space. The search MUST navigate to `/feed?search=...` (not `/?search=...`).

#### Scenario: User searches from header on feed page
- **WHEN** the user types a search query in the header search input
- **THEN** the search input is visually centered and prominent in the header
- **AND** the browser navigates to `/feed?search=<query>`

#### Scenario: User searches from header on any page
- **WHEN** the user types a search query in the header search input from any page
- **THEN** the browser navigates to `/feed?search=<query>`
