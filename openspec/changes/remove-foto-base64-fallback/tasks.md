# Tasks: Remove Base64 Photo Fallback

## 1. Database Migration
- [x] 1.1 Create migration `V5__remove_foto_base64_from_perfis.sql` to drop `foto_base64` column

## 2. Backend Changes
- [x] 2.1 Remove `fotoBase64` field from `Perfil` domain model
- [x] 2.2 Remove `fotoBase64` field from `PerfilEntity`
- [x] 2.3 Update `PerfilMapper` to remove Base64 mapping (not needed - MapStruct auto-maps)
- [x] 2.4 Remove fallback logic from `GerenciarPerfilUseCaseImpl.atualizar()` - on Blob failure, throw error instead of fallback
- [x] 2.5 Rename `fotoBase64` to `foto` in `AtualizarPerfilRequest` DTO
- [x] 2.6 Remove `fotoBase64` from `PerfilResponse` DTO
- [x] 2.7 Update `GerenciarPerfilUseCase.AtualizarPerfilCommand` record (renamed to `foto`)
- [x] 2.8 Remove `fotoBase64` from `PerfilPublicoResponse` DTO
- [x] 2.9 Update `PerfilController` to use new `foto` field

## 3. Frontend Web Changes
- [x] 3.1 Remove `fotoBase64` from `Perfil`, `User`, and `AtualizarPerfilRequest` types in `teachei-web/types/index.ts`
- [x] 3.2 Update `Avatar` component to only use `fotoUrl` (removed `fotoBase64` prop)
- [x] 3.3 Simplify `settings/page.tsx` photo upload to send as `foto` field
- [x] 3.4 Remove `photoPreview` and `isPhotoRemoved` state - simplified to just `isUploadingPhoto`
- [x] 3.5 Fix remove photo button to use simpler callback pattern
- [x] 3.6 Update `profile/[id]/page.tsx` Avatar usage
- [x] 3.7 Update `header.tsx` Avatar usage
- [x] 3.8 Update `intention/[id]/client.tsx` Avatar usage
- [x] 3.9 Update `profile/page.tsx` Avatar usage

## 4. Frontend Mobile Changes
- [x] 4.1 Verify mobile types don't reference `fotoBase64` (confirmed - not used)

## 5. Testing & Validation
- [x] 5.1 No linter errors after changes
