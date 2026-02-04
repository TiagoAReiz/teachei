# Change: Fix Mileage Display and Location Selector in Intention Creation

## Why
The mileage (quilometragem) is captured when creating an intention but not displayed in the grid/feed cards or the intention detail screen, making it invisible to sellers. Additionally, the city/state selector in the intention creation flow is broken due to a closure bug, while the same component works correctly in the profile settings.

## What Changes
- Add mileage display to intention cards in the grid/feed view (web and mobile)
- Add mileage display to the intention detail screen (web)
- Fix the city/state selector closure bug in the intention creation review page

## Impact
- Affected specs: intention-display (new)
- Affected code:
  - `teachei-web/components/intentions/intention-card.tsx` - Add mileage to card
  - `teachei-web/app/intention/[id]/client.tsx` - Add mileage to detail view
  - `teachei-mobile/components/intentions/intention-card.tsx` - Add mileage to mobile card
  - `teachei-web/app/create/review/page.tsx` - Fix location picker callback
