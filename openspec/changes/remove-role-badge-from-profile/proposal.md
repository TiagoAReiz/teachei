# Change: Remove Role Badge from Profile Pages

## Why
The platform no longer distinguishes between buyers and sellers - all users are both. The "Comprador" / "Lojista" badge displayed on profile pages is now obsolete and should be removed to avoid confusion.

## What Changes
- Remove the role badge (Comprador/Lojista) from all profile pages
- Keep the role field in the data model for potential future use, but stop displaying it

## Impact
- Affected specs: profile-display (new)
- Affected code:
  - `teachei-web/app/(main)/profile/page.tsx` - Remove role badge (lines 80-83)
  - `teachei-web/app/profile/[id]/page.tsx` - Remove role badge (lines 109-114)
  - `teachei-web/app/user/[id]/client.tsx` - Remove role badge (lines 56-58)
