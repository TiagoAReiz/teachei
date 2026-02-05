# Tasks: Adicionar upload de foto no mobile

## 1. Atualizar Store do Mobile
- [ ] 1.1 Adicionar campo `fotoReferenciaBase64: string | null` no estado
- [ ] 1.2 Adicionar action `setFotoReferencia: (foto: string | null) => void`
- [ ] 1.3 Resetar campo no `reset()` e `initialState`

## 2. Atualizar Tipos
- [ ] 2.1 Adicionar `fotoReferenciaBase64?: string` em `CreateAnuncioRequest` (`types/index.ts`)

## 3. Implementar Input de Foto (specs.tsx)
- [ ] 3.1 Adicionar import de `expo-image-picker`
- [ ] 3.2 Criar função `handlePhotoSelect` com validação (2MB, tipo imagem)
- [ ] 3.3 Criar função `removePhoto` para remover foto selecionada
- [ ] 3.4 Adicionar componente de preview/upload na UI (após opcionais ou observações)
- [ ] 3.5 Exibir thumbnail quando foto selecionada com botão de remover

## 4. Atualizar Review (review.tsx)
- [ ] 4.1 Obter `fotoReferenciaBase64` do store
- [ ] 4.2 Adicionar preview da foto na tela de revisão
- [ ] 4.3 Incluir `fotoReferenciaBase64` no request de criação

## 5. Atualizar Hook de Criação
- [ ] 5.1 Verificar que `useCreateIntention` passa o campo corretamente para a API

## 6. Testes
- [ ] 6.1 Testar seleção de foto da galeria
- [ ] 6.2 Testar tirar foto com câmera
- [ ] 6.3 Testar validação de tamanho (>2MB deve mostrar erro)
- [ ] 6.4 Testar remoção de foto
- [ ] 6.5 Testar criação de intenção com foto (verificar upload no blob storage)
- [ ] 6.6 Testar criação sem foto (funcionalidade opcional)
