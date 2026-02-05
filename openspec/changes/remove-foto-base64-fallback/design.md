# Design: Remove Base64 Photo Fallback

## Context
Profile photos were originally stored as Base64 in PostgreSQL (`foto_base64` column). Later, Azure Blob Storage was added with `foto_url` column, but Base64 was kept as a fallback. This creates:
- Database bloat (Base64 images are ~33% larger than binary)
- Inconsistent data (some users have URL, some have Base64)
- Complex frontend logic (must check both fields)

## Goals / Non-Goals
- **Goals:**
  - Single source of truth for profile photos (Blob Storage only)
  - Simplified codebase (remove dual-path logic)
  - Reduced database size
  - Fix remove photo button functionality

- **Non-Goals:**
  - Migrate existing Base64 photos to Blob (out of scope - users can re-upload)
  - Change Blob Storage container structure
  - Add image compression/resizing (separate enhancement)

## Decisions

### Decision 1: Drop Column Without Data Migration
**What:** Remove `foto_base64` column directly without migrating existing data to Blob.

**Why:** 
- Few users have Base64 photos (mostly early testers)
- Users can easily re-upload their photo
- Simplifies migration and reduces risk

**Alternatives considered:**
- Migrate existing Base64 to Blob: Complex, requires running migration job, potential failures
- Keep column but deprecate: Leaves technical debt

### Decision 2: Fail Fast on Blob Upload Error
**What:** If Blob Storage upload fails, return error to user instead of falling back.

**Why:**
- Clear feedback to user about the issue
- Consistent storage strategy
- Blob Storage has high availability (99.9%+ SLA)

**Alternatives considered:**
- Retry with exponential backoff: Adds complexity, delays response
- Queue for later: Requires background job infrastructure

### Decision 3: Field Rename (fotoBase64 -> foto)
**What:** Rename `fotoBase64` field in request DTO to just `foto` since it's always Base64 from frontend but stored as URL.

**Why:**
- The field name was misleading (implies it stays as Base64)
- Clearer API contract

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users lose existing Base64 photos | Document in release notes, photos are easily re-uploaded |
| Blob Storage downtime | Azure SLA is 99.9%, errors show friendly message |
| Breaking API change | Version in path is v1, clients must update |

## Migration Plan

1. **Prepare:** Ensure Blob Storage is properly configured in all environments
2. **Deploy backend:** New version with updated logic
3. **Deploy frontend:** Updated web/mobile apps
4. **Run migration:** Drop `foto_base64` column (can be done after deploy since code no longer reads it)
5. **Rollback:** If issues, revert deployments; column drop is non-reversible but data was already deprecated

## Open Questions
- None - straightforward removal of deprecated feature
