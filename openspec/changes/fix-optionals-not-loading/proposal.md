# Change: Corrigir Opcionais Não Carregando no Frontend

## Why

Os opcionais de veículos não estão sendo exibidos corretamente tanto nos filtros do feed quanto na criação de intenções. Apesar de o código estar estruturado corretamente (backend com enum `OpcionalVeiculo` e endpoint `/api/v1/anuncios/filtros`, frontend com hook `useAvailableFilters`), os opcionais não aparecem na interface.

## What Changes

### Investigação Necessária

1. **Verificar comunicação Frontend-Backend:**
   - Confirmar se o parâmetro `tipo` está sendo enviado corretamente na URL
   - Verificar se o backend está recebendo e interpretando o parâmetro
   - Validar se a resposta JSON inclui o campo `opcionais`

2. **Correções Identificadas:**
   - O `filter-panel.tsx` faz duas chamadas: uma com `tipo=null` (para tipos) e outra com `filters.tipo` (para opcionais)
   - Verificar se `filters.tipo` está sendo passado corretamente quando selecionado
   - O `specs/page.tsx` usa `tipoVeiculo || null` que pode estar retornando null incorretamente

3. **Possíveis Problemas:**
   - Conversão de enum case-sensitive (CARRO vs carro)
   - URL encode de parâmetros
   - Resposta do backend não incluindo `opcionais` quando tipo não é passado

### Mudanças Técnicas

- Adicionar logs de debug para rastrear fluxo de dados
- Verificar e corrigir parsing de parâmetros no backend
- Garantir que a resposta JSON sempre inclui o array `opcionais`
- Adicionar tratamento de erro quando API falha

## Impact

- **Affected specs**: vehicle-optionals (do change add-vehicle-type-optionals)
- **Affected code**:
  - `teachei-web/lib/intentions.ts` - função `getAvailableFilters`
  - `teachei-web/hooks/use-intentions.ts` - hook `useAvailableFilters`
  - `teachei-web/components/layout/filter-panel.tsx` - uso do hook
  - `teachei-web/app/create/specs/page.tsx` - uso do hook
  - `TeAchei/src/main/java/com/teachei/api/adapter/in/web/controller/AnuncioController.java` - endpoint `/filtros`
  - `TeAchei/src/main/java/com/teachei/api/application/usecase/BuscarFiltrosDisponiveisUseCaseImpl.java` - lógica de filtragem
