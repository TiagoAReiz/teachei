# Tasks: Remover Prefixo +55 Automático e Verificar Opcionais

## 1. Corrigir Formatação de Telefone - Web

- [x] 1.1 Modificar `formatBrazilianPhoneInput` em `teachei-web/lib/utils.ts` para retornar `""` quando `limitedDigits.length === 0`
- [x] 1.2 Verificar se `isValidBrazilianPhone` trata string vazia corretamente (já aceita)
- [x] 1.3 Verificar se `getBrazilianPhoneError` trata string vazia corretamente (já aceita)
- [ ] 1.4 Testar no campo de WhatsApp em Settings (campo deve iniciar vazio)
- [ ] 1.5 Testar no campo de telefone na criação de intenção

## 2. Corrigir Formatação de Telefone - Mobile

- [x] 2.1 Modificar `formatBrazilianPhoneInput` em `teachei-mobile/utils/format.ts` para retornar `""` quando `limitedDigits.length === 0`
- [x] 2.2 Verificar se `isValidBrazilianPhone` trata string vazia corretamente (já aceita)
- [x] 2.3 Verificar se `getBrazilianPhoneError` trata string vazia corretamente (já aceita)
- [ ] 2.4 Testar campo de telefone no registro mobile

## 3. Verificar Opcionais - Web Feed Filters

- [x] 3.1 Verificar se `filter-panel.tsx` está usando `filteredOptions?.opcionais` corretamente
- [x] 3.2 Verificar se a chamada `useAvailableFilters(filters.tipo || null, ...)` está retornando opcionais
- [x] 3.3 Verificar se a mensagem "Selecione um tipo de veículo para ver os opcionais" aparece quando tipo não selecionado
- [ ] 3.4 Selecionar CARRO, MOTO, CAMINHAO e verificar se opcionais aparecem para cada tipo
- [ ] 3.5 Se opcionais não aparecem, verificar resposta da API `/api/v1/anuncios/filtros?tipo=CARRO`

## 4. Verificar Opcionais - Mobile Feed Filters

- [x] 4.1 Verificar se `FilterModal` no mobile está usando `vehiclesService.getOpcionais(localFilters.tipo)`
- [ ] 4.2 Abrir modal de filtros, selecionar tipo de veículo e verificar se opcionais carregam
- [ ] 4.3 Se não carregam, verificar chamada de API e resposta

## 5. Corrigir Opcionais - Criação de Intenção Web

- [x] 5.1 Refatorar `create/specs/page.tsx` para usar hook `useAvailableFilters` ao invés de chamada direta
- [x] 5.2 Remover useEffect manual de carregamento de opcionais
- [x] 5.3 Usar `availableFilters?.opcionais` do hook para popular lista de opcionais
- [ ] 5.4 Criar intenção, chegar na página de specs e verificar se opcionais aparecem
- [ ] 5.5 Verificar se opcionais selecionados são salvos na intenção criada
