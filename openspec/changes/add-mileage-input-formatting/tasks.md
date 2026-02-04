## 1. Create MileageInput Component
- [x] 1.1 Create `teachei-web/components/ui/mileage-input.tsx` based on `CurrencyInput` pattern
- [x] 1.2 Implement formatting logic for thousand separators (e.g., 50000 -> "50.000")
- [x] 1.3 Add "km" suffix display
- [x] 1.4 Export component from `teachei-web/components/ui/index.ts`

## 2. Update Intention Creation Form
- [x] 2.1 Replace mileage `<Input type="number">` with `<MileageInput>` in `teachei-web/app/create/specs/page.tsx`
- [x] 2.2 Test formatting and value persistence in store

## 3. Update Intention Edit Form
- [x] 3.1 Replace mileage `<Input type="number">` with `<MileageInput>` in `teachei-web/app/intention/[id]/edit/page.tsx`
- [x] 3.2 Test formatting with existing values

## 4. Verification
- [x] 4.1 Verify thousand separators appear while typing (e.g., "10000" shows as "10.000")
- [x] 4.2 Verify numeric value is correctly stored in state
- [x] 4.3 Run lint and build
