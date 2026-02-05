# Change: Remove Base64 Photo Fallback and Use Only Blob Storage

## Why
Currently, profile photos are sent to Azure Blob Storage, but if the upload fails, the system falls back to storing the photo as Base64 directly in the PostgreSQL database. This is inefficient (bloats the database), inconsistent (two storage methods), and the `foto_base64` column is no longer needed. The system should exclusively use Blob Storage for profile photos.

## What Changes
- **BREAKING**: Remove `foto_base64` column from `perfis` table via migration
- Remove Base64 fallback logic from backend upload flow
- Remove Base64 handling from frontend components
- Update domain model and DTOs to remove `fotoBase64` field
- Fix remove photo button not working (ensure proper API flow)

## Impact
- Affected specs: `user-profile` (new capability)
- Affected code:
  - `TeAchei/src/main/resources/db/migration/` - new migration to drop column
  - `TeAchei/src/main/java/com/teachei/api/application/usecase/GerenciarPerfilUseCaseImpl.java` - remove fallback
  - `TeAchei/src/main/java/com/teachei/api/domain/model/Perfil.java` - remove fotoBase64 field
  - `TeAchei/src/main/java/com/teachei/api/adapter/out/persistence/postgres/entity/PerfilEntity.java` - remove column mapping
  - `TeAchei/src/main/java/com/teachei/api/adapter/in/web/dto/` - update DTOs
  - `teachei-web/app/(main)/settings/page.tsx` - simplify photo handling
  - `teachei-web/components/ui/avatar.tsx` - remove fotoBase64 support
  - `teachei-web/types/index.ts` - remove fotoBase64 from User type
