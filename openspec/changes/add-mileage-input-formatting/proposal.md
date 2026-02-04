# Change: Add Automatic Thousand Separator Formatting to Mileage Inputs

## Why
Currently, mileage inputs use `type="number"` which does not format values with thousand separators. Users must type raw numbers (e.g., "50000") without visual feedback. Adding automatic formatting (e.g., "50.000 km") improves usability and makes it easier to read larger values.

## What Changes
- Create a new `MileageInput` component (similar to existing `CurrencyInput`) with automatic thousand separator formatting
- Replace existing mileage inputs in creation and edit forms with the new component
- Display values with dots as thousand separators while storing the raw numeric value

## Impact
- Affected specs: mileage-input (new)
- Affected code:
  - `teachei-web/components/ui/mileage-input.tsx` - New component (create)
  - `teachei-web/components/ui/index.ts` - Export new component
  - `teachei-web/app/create/specs/page.tsx` - Use MileageInput
  - `teachei-web/app/intention/[id]/edit/page.tsx` - Use MileageInput
