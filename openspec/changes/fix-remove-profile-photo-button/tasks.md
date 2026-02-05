## 1. Fix Race Condition in Photo Removal

- [x] 1.1 Adicionar state `isPhotoRemoved` para controlar quando a foto foi removida localmente
- [x] 1.2 Modificar `handleRemovePhoto` para setar `isPhotoRemoved = true` antes da chamada API
- [x] 1.3 Atualizar o `useEffect` para não restaurar `photoPreview` quando `isPhotoRemoved` for true
- [x] 1.4 Resetar `isPhotoRemoved = false` apenas quando o cache do usuário for atualizado (após mutation success)

## 2. Fix Avatar Display Logic

- [x] 2.1 Modificar props do Avatar para não exibir `fotoUrl` quando `isPhotoRemoved` for true
- [x] 2.2 Garantir que `hasPhoto` considere `isPhotoRemoved` para esconder o botão de remover

## 3. Testing

- [ ] 3.1 Testar remoção de foto - verificar que a foto desaparece imediatamente
- [ ] 3.2 Testar que a foto não reaparece após remoção
- [ ] 3.3 Testar upload de nova foto após remoção - verificar que funciona normalmente
- [ ] 3.4 Testar refresh da página após remoção - verificar que a foto continua removida
