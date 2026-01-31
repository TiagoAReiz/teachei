## Context

The profile editing page allows users to update their information, including uploading a profile photo. Currently, when a photo is uploaded, it's sent as a separate API call with only the `fotoBase64` field. The backend's domain model overwrites all profile fields with the request values, causing existing data to be lost when null values are received.

Additionally, the UI has inconsistencies:
- The favorites icon varies between Bookmark (mobile-nav) and Heart (header), but should use Flag to match the save/bookmark icon on intention cards
- Validation errors show only "Erro de validação" without specifying which field failed and why

## Goals / Non-Goals

**Goals:**
- Profile photo upload should not affect other profile fields
- Favorites icon should be consistent (Flag) across all navigation elements
- Validation errors should show specific field names and messages

**Non-Goals:**
- Changing the profile photo upload mechanism (still uses base64)
- Changing the validation rules themselves
- Adding new profile fields

## Decisions

### 1. Partial Update Pattern for Profile
**Decision**: Modify the domain model's `atualizar` method to only update fields when the new value is not null.

**Rationale**: This follows the null-as-undefined pattern common in partial update APIs. The frontend already sends partial payloads (e.g., only `fotoBase64` for photo uploads), so the backend should preserve existing values for unspecified fields.

**Alternative considered**: Create separate endpoints for photo upload and profile data update. Rejected because it adds complexity and the partial update pattern is more flexible.

### 2. Flag Icon for Favorites
**Decision**: Use `Flag` icon from lucide-react for favorites in all navigation elements.

**Rationale**: The intention cards already use Flag for the save/bookmark action. Users expect consistency - if they click a flag to save an intention, the "Salvos" section should also show a flag.

### 3. Field-Specific Validation Errors
**Decision**: Parse the `fieldErrors` array from backend validation responses and display specific messages.

**Rationale**: The backend already returns detailed field errors in the response. The frontend just needs to extract and display them properly, improving user experience without backend changes.

## Risks / Trade-offs

- **Risk**: Partial updates might make it impossible to explicitly set a field to null/empty.
  - **Mitigation**: Use empty string ("") instead of null when user wants to clear a field. The backend can distinguish between null (not provided) and empty string (explicitly cleared).

## Migration Plan

No migration needed. These are backwards-compatible changes:
1. Backend change is purely behavioral (null handling)
2. Frontend changes are UI-only

## Open Questions

None - all requirements are clear.
