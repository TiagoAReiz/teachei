# Change: Add Searchable Autocomplete for Vehicle Selection

## Why

Currently, when creating an intention, users must scroll through long lists of brands (~90+ items) and models (~100+ items) to find their desired vehicle. This is slow and frustrating. Adding a search/autocomplete input allows users to type and instantly filter options, significantly improving the creation UX.

## What Changes

- Add searchable input field for brand selection with real-time filtering
- Add searchable input field for model selection with real-time filtering  
- Add searchable input field for version selection with real-time filtering
- Maintain backward compatibility with current list selection (filtered list remains clickable)
- Apply same pattern to both web and mobile apps

## Impact

- Affected specs: intention-creation (new capability)
- Affected code:
  - `teachei-web/app/create/vehicle/page.tsx` - Main vehicle selection page
  - `teachei-web/components/ui/` - Potential new SearchableSelect component
  - `teachei-mobile/app/create/vehicle.tsx` - Mobile vehicle selection
