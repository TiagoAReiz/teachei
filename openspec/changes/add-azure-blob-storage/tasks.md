# Tasks: Azure Blob Storage Integration

## 1. Backend - Dependências e Configuração
- [x] 1.1 Adicionar dependência `azure-storage-blob` no `pom.xml`
- [x] 1.2 Adicionar dependência `azure-identity` no `pom.xml`
- [x] 1.3 Criar configuração em `application.yml` para Azure Storage
- [x] 1.4 Criar `application-local.yml` com configuração do Azurite

## 2. Backend - Blob Storage Service
- [x] 2.1 Criar `BlobStoragePort` (interface em `application/ports/out`)
- [x] 2.2 Criar `BlobStorageAdapter` (implementação em `adapter/out/storage`)
- [x] 2.3 Criar `BlobStorageConfig` para configurar o client
- [x] 2.4 Implementar método `uploadProfilePhoto(userId, base64Image)`
- [x] 2.5 Implementar método `uploadIntentionPhoto(intentionId, base64Image)`
- [x] 2.6 Implementar método `deleteProfilePhoto(userId)`
- [x] 2.7 Implementar método `deleteIntentionPhoto(intentionId)`

## 3. Backend - Foto de Perfil
- [x] 3.1 Adicionar coluna `foto_url` na migration SQL
- [x] 3.2 Atualizar `PerfilEntity` com campo `fotoUrl`
- [x] 3.3 Atualizar `Perfil` (domain) com campo `fotoUrl`
- [x] 3.4 Atualizar `PerfilResponse` para incluir `fotoUrl`
- [x] 3.5 Atualizar `PerfilPublicoResponse` para incluir `fotoUrl`
- [x] 3.6 Modificar `GerenciarPerfilUseCaseImpl` para:
  - Receber Base64
  - Fazer upload para Blob Storage
  - Salvar URL no banco ao invés de Base64
  - Suporte para remover foto (flag `removerFoto`)
- [x] 3.7 Atualizar mapper para retornar `fotoUrl` com prioridade sobre `fotoBase64`

## 4. Backend - Foto de Referência na Intenção
- [x] 4.1 Adicionar campo `fotoReferenciaUrl` em `VeiculoInfo` (domain)
- [x] 4.2 Adicionar campo `fotoReferenciaUrl` em `VeiculoInfoDocument` (Cosmos)
- [x] 4.3 Adicionar campo `fotoReferenciaBase64` no request de criação de intenção
- [x] 4.4 Atualizar `CriarAnuncioUseCaseImpl` para fazer upload da foto (se fornecida)
- [x] 4.5 Atualizar `AtualizarAnuncioUseCaseImpl` para permitir atualizar foto
- [x] 4.6 Atualizar `AnuncioResponse` para incluir `fotoReferenciaUrl`
- [x] 4.7 Ao excluir intenção, deletar foto do Blob Storage

## 5. Frontend Web - Ajustes de Upload
- [x] 5.1 Atualizar tipo `Perfil` em `types/index.ts` com `fotoUrl`
- [x] 5.2 Atualizar `Avatar` component para priorizar `fotoUrl` sobre `fotoBase64`
- [x] 5.3 Atualizar `settings/page.tsx` - manter upload como Base64 (backend converte)
- [x] 5.4 Atualizar tipo `Intention` com `fotoReferenciaUrl`
- [x] 5.5 Adicionar campo de upload de foto em `create/specs/page.tsx`
- [x] 5.6 Atualizar `create-intention-store.ts` com campo `fotoReferenciaBase64`
- [x] 5.7 Exibir foto de referência na página de detalhes da intenção
- [x] 5.8 Adicionar upload/alteração de foto em `intention/[id]/edit/page.tsx`
- [x] 5.9 Adicionar opção de remover foto de perfil em `settings/page.tsx`

## 6. Frontend Mobile - Ajustes de Upload
- [ ] 6.1 Atualizar tipos com `fotoUrl` e `fotoReferenciaUrl`
- [ ] 6.2 Atualizar Avatar component para priorizar `fotoUrl`
- [ ] 6.3 Adicionar upload de foto na criação de intenção (opcional)
- [ ] 6.4 Exibir foto de referência na tela de detalhes

## 7. Docker Compose - Documentação
- [ ] 7.1 Verificar que Azurite está funcionando corretamente
- [ ] 7.2 Adicionar script/instrução para criar containers locais
- [ ] 7.3 Atualizar README com instruções de uso do Azurite

## 8. Testes
- [ ] 8.1 Criar teste unitário para `BlobStorageAdapter` (mock)
- [ ] 8.2 Criar teste de integração com Azurite (Testcontainers)
- [ ] 8.3 Testar upload de foto de perfil (web)
- [ ] 8.4 Testar upload de foto de referência na intenção (web)
- [ ] 8.5 Testar exibição de fotos antigas (fallback Base64)

## 9. Deploy
- [ ] 9.1 Adicionar secrets no GitHub Actions:
  - `AZURE_STORAGE_ACCOUNT_NAME`
  - `AZURE_STORAGE_CONNECTION_STRING`
  - `AZURE_STORAGE_BLOB_ENDPOINT`
- [x] 9.2 Criar containers no Azure Blob Storage (manual via portal)
- [x] 9.3 Configurar CORS no Azure Storage para frontend
- [ ] 9.4 Deploy e teste em produção
