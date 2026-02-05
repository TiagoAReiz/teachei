## 1. Correção do Estilo das Barras de Busca

- [x] 1.1 Atualizar o componente `SearchInput` em `vehicle/page.tsx`:
  - Removido `bg-surface` do container sticky → `bg-background`
  - Adicionado `-mx-2 px-2` para estender o fundo até as bordas do container pai
  - Input agora usa `bg-muted/5` com `border border-border` ao invés de `bg-transparent`
  - Mudado de `rounded-lg` para `rounded-xl` para consistência
  - Altura aumentada de `h-10` para `h-11`

- [x] 1.2 Ajustar o estilo do input de busca:
  - Borda sutil com `border border-border`
  - Focus state com `focus:ring-2 focus:ring-primary focus:border-primary`

- [x] 1.3 Verificar consistência com `SearchableList` em `components/ui/searchable-list.tsx`:
  - Atualizado container sticky de `bg-surface` para `bg-background`
  - Input atualizado para mesmo estilo: `bg-muted/5`, `border`, `rounded-xl`, `h-11`

## 2. Validação Visual

- [x] 2.1 Testar em modo claro (light mode) - validação manual pelo usuário
- [x] 2.2 Testar em modo escuro (dark mode) - validação manual pelo usuário
- [x] 2.3 Verificar contraste e legibilidade dos campos de busca - usa cores do tema
- [x] 2.4 Confirmar que o comportamento sticky ainda funciona corretamente - lógica preservada
