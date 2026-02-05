# Design: Diagnóstico e Correção dos Opcionais

## Context

O sistema TeAchei permite que compradores especifiquem opcionais desejados em suas intenções de compra de veículos. Os opcionais são específicos por tipo de veículo (CARRO, MOTO, CAMINHAO) e são carregados dinamicamente quando o tipo é selecionado.

Apesar da implementação existente (change `add-vehicle-type-optionals`), os opcionais não estão aparecendo na interface.

## Goals / Non-Goals

**Goals:**
- Identificar a causa raiz do problema de opcionais não carregando
- Corrigir o fluxo de dados entre frontend e backend
- Garantir que opcionais funcionem na criação de intenções e nos filtros

**Non-Goals:**
- Adicionar novos opcionais (já existem 44 opcionais definidos)
- Modificar a estrutura de dados dos opcionais
- Alterar a lógica de validação de compatibilidade

## Fluxo de Dados Atual

```
Frontend                                    Backend
========                                    =======
1. Usuário seleciona tipo de veículo
   |
2. useAvailableFilters(tipo)
   |
3. getAvailableFilters(tipo)
   |
4. GET /api/v1/anuncios/filtros?tipo=CARRO -----> 5. AnuncioController.filtrosDisponiveis()
                                                     |
                                              6. buscarFiltrosDisponiveisUseCase.buscar(tipo)
                                                     |
                                              7. OpcionalVeiculo.getOpcionaisPorTipo(tipo)
                                                     |
                                              8. FiltrosDisponiveisResponse com opcionais
   <-------------------------------------------------|
9. Renderizar lista de opcionais
```

## Pontos de Falha Potenciais

### 1. Frontend - Hook não está chamando a API

**Verificar em `useAvailableFilters`:**
- O `enabled` condition pode estar desabilitando a query
- O `queryKey` pode estar cacheando resultado antigo

### 2. Frontend - Parâmetro não sendo enviado

**Verificar em `getAvailableFilters`:**
- Se `tipo` é `undefined` ou string vazia, não é adicionado ao params
- Verificar se tipo está em uppercase

### 3. Backend - Parâmetro não sendo recebido

**Verificar em `AnuncioController`:**
- Verificar logs do Spring para ver se request chega
- Verificar se `@RequestParam` está correto

### 4. Backend - Lógica retornando vazio

**Verificar em `BuscarFiltrosDisponiveisUseCaseImpl`:**
```java
List<OpcionalOption> opcionais = tipo != null
    ? OpcionalVeiculo.getOpcionaisPorTipo(tipo)...
    : List.of();  // <-- Se tipo é null, retorna vazio
```

## Decisões

1. **Adicionar logs de debug** temporários para rastrear o fluxo
2. **Verificar com curl/postman** se o endpoint funciona isoladamente
3. **Verificar Network tab** do browser para ver a requisição real

## Risks / Trade-offs

- **Risco**: Problema pode ser de configuração de ambiente (CORS, proxy)
- **Mitigação**: Testar em ambiente local com backend e frontend rodando

## Open Questions

1. O backend está rodando e respondendo?
2. A URL base da API está configurada corretamente no frontend?
3. Há algum proxy (Next.js) interceptando as requisições?
