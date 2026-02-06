## 1. Fix Race Condition in Photo Removal

- [x] 1.1 Adicionar state `isPhotoRemoved` para controlar quando a foto foi removida localmente
- [x] 1.2 Modificar `handleRemovePhoto` para setar `isPhotoRemoved = true` antes da chamada API
- [x] 1.3 Atualizar o `useEffect` para resetar `isPhotoRemoved` quando cache confirma remoção
- [x] 1.4 Reverter `isPhotoRemoved = false` em caso de erro na API

## 2. Fix Avatar Display Logic

- [x] 2.1 Modificar props do Avatar para não exibir `fotoUrl` quando `isPhotoRemoved` for true
- [x] 2.2 Garantir que `hasPhoto` considere `isPhotoRemoved` para esconder o botão de remover
- [x] 2.3 Adicionar key dinâmica no Avatar para forçar re-render quando foto é removida

## 3. Handle New Photo Upload

- [x] 3.1 Resetar `isPhotoRemoved = false` quando usuário faz upload de nova foto

## 4. Testing

- [ ] 4.1 Testar remoção de foto - verificar que a foto desaparece imediatamente
- [ ] 4.2 Testar que a foto não reaparece após remoção
- [ ] 4.3 Testar upload de nova foto após remoção - verificar que funciona normalmente
- [ ] 4.4 Testar refresh da página após remoção - verificar que a foto continua removida
