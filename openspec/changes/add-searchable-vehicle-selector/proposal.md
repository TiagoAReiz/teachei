# Change: Add Searchable Vehicle Selector

## Why
Atualmente, ao criar uma intenção, a seleção de marca/modelo/versão usa listas scrolláveis. Com muitas opções (50+ marcas, dezenas de modelos), encontrar o veículo desejado pode ser demorado.

O usuário quer poder **digitar para buscar** dentro dessas listas, mantendo a UI visual atual de seleção.

## What Changes

### Componente SearchableList
Criar um componente reutilizável que combina:
- Campo de busca no topo (input com ícone de lupa)
- Lista filtrada conforme digitação
- Mantém o visual atual (cards/botões de seleção)
- Destaca o texto que corresponde à busca
- Mostra mensagem quando não há resultados

### UX Improvements
1. **Busca instantânea**: Filtra enquanto digita (sem delay)
2. **Case-insensitive**: Ignora maiúsculas/minúsculas
3. **Accent-insensitive**: "Corolla" encontra "Corolla" mesmo digitando "corolla"
4. **Placeholder contextual**: "Buscar marca...", "Buscar modelo..."
5. **Clear button**: Botão X para limpar busca
6. **Focus automático**: Foca no campo de busca ao abrir seção

### Onde aplicar
1. **Marca**: Lista de marcas (Toyota, Honda, Chevrolet...)
2. **Modelo**: Lista de modelos agrupados (Onix, Corolla, Civic...)
3. **Versões**: Lista de versões (já é menor, mas consistência)

## Visual Design

```
┌─────────────────────────────────────┐
│ 🔍 Buscar marca...              [X] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Chevrolet                     → │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Honda                         → │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Toyota                        → │ │
│ └─────────────────────────────────┘ │
│           ... scroll ...            │
└─────────────────────────────────────┘
```

Quando digitando "toy":
```
┌─────────────────────────────────────┐
│ 🔍 toy                          [X] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ **Toy**ota                    → │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Impact
- Affected specs: `searchable-selector`
- Affected code:
  - `components/ui/searchable-list.tsx` (novo)
  - `app/create/vehicle/page.tsx` (integração)
