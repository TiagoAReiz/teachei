# Change: Fix Profile Photo Upload and UX Issues

## Why

Users are experiencing several issues that impact the profile editing experience:
1. When uploading a new profile photo, all other profile information (name, bio, whatsapp, etc.) is lost because the backend overwrites fields with null values from partial updates
2. The favorites icon uses inconsistent icons (Bookmark/Heart) instead of the Flag icon used on intention cards
3. Validation error messages are too generic ("Erro de validação") instead of showing specific field errors

## What Changes

- **Backend**: Fix the domain model's `atualizar` method to support partial updates (only update fields that are not null)
- **Frontend - Favorites Icon**: Change the favorites icon from Bookmark/Heart to Flag in both `mobile-nav.tsx` and `header.tsx`
- **Frontend - Validation Errors**: Improve error handling to parse and display field-specific validation errors instead of generic messages

## Impact

- Affected specs: web-profile
- Affected code:
  - `TeAchei/src/main/java/com/teachei/api/domain/model/Perfil.java` (atualizar method)
  - `teachei-web/app/(main)/settings/page.tsx` (error display)
  - `teachei-web/lib/api.ts` (error parsing)
  - `teachei-web/components/layout/mobile-nav.tsx` (favorites icon)
  - `teachei-web/components/layout/header.tsx` (favorites icon)
