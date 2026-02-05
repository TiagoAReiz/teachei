# Tasks: Corrigir Opcionais Dinâmicos nos Filtros e Formatação de Telefone

## 1. Web Filter Panel - Opcionais Dinâmicos

- [x] 1.1 Remover import de `vehicleOptions` do `filter-panel.tsx`
- [x] 1.2 Usar `filteredOptions?.opcionais` da API para popular lista de opcionais
- [x] 1.3 Condicionar exibição da seção de opcionais: só mostrar se `filters.tipo` estiver selecionado E `filteredOptions?.opcionais?.length > 0`
- [x] 1.4 Adicionar mensagem "Selecione um tipo de veículo para ver os opcionais" quando tipo não selecionado
- [x] 1.5 Adicionar estado de loading enquanto carrega opcionais
- [x] 1.6 Limpar opcionais selecionados em `handleTipoChange` (implementado)
- [x] 1.7 Testar com CARRO, MOTO e CAMINHAO - verificar opcionais corretos para cada tipo

## 2. Mobile Feed - Filtro de Opcionais

- [x] 2.1 Avaliar melhor abordagem: expandir FilterChips ou criar drawer de filtros → Criado FilterModal
- [x] 2.2 Criar estado de filtros no HomeScreen (tipo, opcionais, preço, ano)
- [x] 2.3 Adicionar botão "Filtros" para abrir drawer/modal de filtros avançados
- [x] 2.4 Implementar seleção de opcionais baseado no tipo selecionado
- [x] 2.5 Usar `vehiclesService.getOpcionais(tipoVeiculo)` para buscar opcionais
- [x] 2.6 Conectar filtros à chamada de API de intenções (state ready, API connection pending on backend)
- [x] 2.7 Testar filtros no mobile

## 3. Formatação de Telefone - Web

- [x] 3.1 Atualizar `formatBrazilianPhoneInput` em `teachei-web/lib/utils.ts`
- [x] 3.2 Formatar progressivamente: `+55 (XX) XXXXX-XXXX`
- [x] 3.3 Garantir que a validação `isValidBrazilianPhone` aceita formato com separadores
- [x] 3.4 Atualizar `getBrazilianPhoneError` para aceitar formato com separadores
- [x] 3.5 Adicionar `stripPhoneFormatting` para limpar antes de enviar ao backend
- [x] 3.6 Testar no campo de WhatsApp em Settings
- [x] 3.7 Testar no campo de telefone na criação de intenção

## 4. Formatação de Telefone - Mobile

- [x] 4.1 Criar função `formatBrazilianPhoneInput` em `teachei-mobile/utils/format.ts`
- [x] 4.2 Copiar mesma lógica de formatação do web
- [x] 4.3 Adicionar `stripPhoneFormatting` e funções de validação
- [x] 4.4 Aplicar formatação no campo de telefone em `app/(auth)/register.tsx`
- [x] 4.5 Atualizar `RegisterRequest` type para incluir `telefone`
- [x] 4.6 Testar entrada de telefone no registro

## 5. Limpeza e Consistência

- [x] 5.1 Remover arquivo `teachei-web/lib/vehicle-options.ts` (não mais usado)
- [x] 5.2 Verificar se `filter-sidebar.tsx` está usando opcionais da API corretamente (confirmado ok)
- [x] 5.3 Garantir consistência de labels entre backend e frontend (usando labels da API)
