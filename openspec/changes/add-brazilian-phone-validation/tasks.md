## 1. Create Validation Helper
- [x] 1.1 Create `isValidBrazilianPhone` function in `teachei-web/lib/utils.ts`
- [x] 1.2 Regex pattern: `^\+55[1-9][0-9]9[0-9]{8}$` (matches +55 + DDD + 9-digit mobile)

## 2. Update Profile Settings Validation
- [x] 2.1 Update whatsapp field validation in `teachei-web/app/(main)/settings/page.tsx`
- [x] 2.2 Use Brazilian phone format regex
- [x] 2.3 Update error message to be more specific

## 3. Update Intention Creation Validation
- [x] 3.1 Add phone format validation in `teachei-web/app/create/review/page.tsx` before submit
- [x] 3.2 Show clear error message if format is invalid

## 4. Verification
- [x] 4.1 Test valid numbers: +5511999998888, +5521987654321
- [x] 4.2 Test invalid numbers: 11999998888 (no +55), +1234567890 (not BR), +55119999988 (wrong length)
- [x] 4.3 Run lint and build
