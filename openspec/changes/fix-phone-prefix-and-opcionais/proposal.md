# Change: Remover Prefixo +55 Automático e Verificar Opcionais

## Why

Existem dois problemas de UX reportados pelos usuários:

1. **Prefixo +55 aparece automaticamente no campo de telefone**: A função `formatBrazilianPhoneInput` retorna `"+55 "` mesmo quando o campo está vazio, fazendo o prefixo aparecer antes do usuário começar a digitar. O comportamento esperado é que o campo comece vazio e só mostre o prefixo após o usuário começar a digitar.

2. **Opcionais não aparecem em lugar nenhum**: Os opcionais estão implementados corretamente (carregados via API baseado no tipo de veículo), mas podem não estar visíveis em alguns cenários. Necessário verificar se todos os fluxos (web filters, mobile filters, criação de intenção) estão funcionando corretamente.

## What Changes

### 1. Remover Prefixo +55 Automático
- Modificar `formatBrazilianPhoneInput` em `teachei-web/lib/utils.ts` para retornar string vazia quando não há dígitos
- Modificar `formatBrazilianPhoneInput` em `teachei-mobile/utils/format.ts` para retornar string vazia quando não há dígitos
- Atualizar validações `isValidBrazilianPhone` e `getBrazilianPhoneError` para tratar string vazia corretamente

### 2. Verificar Exibição de Opcionais
- Verificar se `filter-panel.tsx` está usando corretamente `filteredOptions?.opcionais`
- Verificar se `FilterModal` no mobile está carregando opcionais via `vehiclesService.getOpcionais`
- Verificar se `create/specs/page.tsx` está exibindo opcionais após carregar
- Adicionar logs de debug se necessário para identificar falhas silenciosas

## Impact

- **Affected specs**: phone-formatting, feed-filters
- **Affected code**:
  - `teachei-web/lib/utils.ts` - formatBrazilianPhoneInput, isValidBrazilianPhone, getBrazilianPhoneError
  - `teachei-mobile/utils/format.ts` - formatBrazilianPhoneInput, isValidBrazilianPhone, getBrazilianPhoneError
  - Verificar: `teachei-web/components/layout/filter-panel.tsx`
  - Verificar: `teachei-mobile/components/layout/filter-modal.tsx`
  - Verificar: `teachei-web/app/create/specs/page.tsx`
- **Migration**: Nenhuma - mudanças apenas de comportamento de UI
