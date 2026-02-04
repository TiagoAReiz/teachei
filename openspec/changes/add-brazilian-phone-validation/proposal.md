# Change: Add Brazilian Phone Number Validation

## Why
Currently, the WhatsApp field accepts any international phone number format. Since the platform operates in Brazil and requires the country code, we should validate that the number follows the Brazilian format (+55 + DDD + 9 digits for mobile).

## What Changes
- Update the WhatsApp validation regex to specifically validate Brazilian phone numbers
- Format: `+55` (country code) + 2 digit DDD (11-99) + 9 digit mobile number (starting with 9)
- Example valid format: `+5511999998888`
- Apply validation in profile settings and intention creation review

## Impact
- Affected specs: phone-validation (new)
- Affected code:
  - `teachei-web/app/(main)/settings/page.tsx` - Update whatsapp regex validation
  - `teachei-web/app/create/review/page.tsx` - Add phone format validation before submit
