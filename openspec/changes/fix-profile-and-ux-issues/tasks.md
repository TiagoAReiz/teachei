## 1. Backend - Partial Profile Update

- [x] 1.1 Modify `Perfil.atualizar()` method to only update fields when the new value is not null
- [x] 1.2 Verify that empty strings are treated differently from null (allow explicit clearing)
- [x] 1.3 Test photo upload preserves other profile fields

## 2. Frontend - Favorites Icon Consistency

- [x] 2.1 Update `mobile-nav.tsx` to use `Flag` icon instead of `Bookmark` for favorites
- [x] 2.2 Update `header.tsx` to use `Flag` icon instead of `Heart` for favorites

## 3. Frontend - Validation Error Messages

- [x] 3.1 Update `lib/api.ts` to parse and format fieldErrors from validation responses
- [x] 3.2 Update `settings/page.tsx` to display specific validation error messages
- [x] 3.3 Format error messages to include field name and specific message (e.g., "WhatsApp: deve estar no formato internacional")

## 4. Testing

- [x] 4.1 Test profile photo upload - verify other fields are preserved
- [x] 4.2 Test profile form submission with validation errors - verify specific messages shown
- [x] 4.3 Verify favorites icon is Flag in both mobile nav and desktop header
