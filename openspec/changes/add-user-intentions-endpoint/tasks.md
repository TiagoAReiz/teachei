## 1. Backend - Criar endpoint público de intenções por usuário

- [x] 1.1 Adicionar GET `/v1/anuncios/usuario/{usuarioId}` em `AnuncioController.java`
- [x] 1.2 Filtrar apenas intenções ATIVAS
- [x] 1.3 Aplicar lógica de `contatoOculto` (bypass por agora com TODO)
- [x] 1.4 Testar endpoint retorna intenções corretas

## 2. Frontend - Adicionar função de busca

- [x] 2.1 Adicionar endpoint `INTENTIONS_BY_USER` em `config/env.ts`
- [x] 2.2 Criar função `getIntentionsByUserId(userId)` em `lib/intentions.ts`

## 3. Frontend - Atualizar página de perfil público

- [x] 3.1 Buscar intenções do usuário na página `/profile/[id]`
- [x] 3.2 Exibir usando `IntentionCard` em grid responsivo
- [x] 3.3 Mostrar estado vazio se não tiver intenções
- [x] 3.4 Adicionar TODO para ocultar quando cobrar assinatura
