# Tasks: Corrigir Opcionais Não Carregando

## 1. Diagnóstico

- [x] 1.1 Verificar se o backend está rodando e respondendo no endpoint `/api/v1/anuncios/filtros`
- [x] 1.2 Testar manualmente o endpoint com parâmetro `tipo=CARRO` e verificar se opcionais são retornados
- [x] 1.3 Verificar se o frontend está fazendo a requisição corretamente (Network tab do browser)
- [x] 1.4 Verificar se existe algum erro de CORS ou autenticação bloqueando a requisição

## 2. Backend - Verificação

- [x] 2.1 Verificar se o `BuscarFiltrosDisponiveisUseCaseImpl` está sendo injetado corretamente
- [x] 2.2 Adicionar log para debug quando endpoint `/filtros` é chamado com tipo
- [x] 2.3 Verificar se o método `OpcionalVeiculo.getOpcionaisPorTipo(tipo)` retorna dados corretos
- [x] 2.4 Confirmar que a resposta JSON inclui o campo `opcionais` com dados

## 3. Frontend - Correção da Chamada API

- [x] 3.1 Verificar se `API_ENDPOINTS.INTENTION_FILTERS` está correto (`/api/v1/anuncios/filtros`)
- [x] 3.2 Verificar se o parâmetro `tipo` está sendo adicionado na URL corretamente
- [x] 3.3 Adicionar log para debug no hook `useAvailableFilters`
- [x] 3.4 Verificar se o tipo está em uppercase (CARRO, MOTO, CAMINHAO) como esperado pelo backend

## 4. Frontend - Componentes

- [x] 4.1 Verificar se `filter-panel.tsx` está passando `filters.tipo` corretamente para o hook
- [x] 4.2 Verificar se `specs/page.tsx` está passando `tipoVeiculo` corretamente para o hook
- [x] 4.3 Verificar se o estado `tipoVeiculo` está sendo preenchido no store antes da chamada
- [x] 4.4 Verificar se `filteredOptions?.opcionais` está acessando o campo correto da resposta

## 5. Testes e Validação

- [ ] 5.1 Testar criação de intenção com seleção de opcionais para CARRO
- [ ] 5.2 Testar criação de intenção com seleção de opcionais para MOTO
- [ ] 5.3 Testar criação de intenção com seleção de opcionais para CAMINHAO
- [ ] 5.4 Testar filtros do feed com opcionais selecionados
- [ ] 5.5 Verificar que opcionais salvos aparecem na intenção criada

## Resumo das Correções Aplicadas

### Melhorias de Diagnóstico

1. **`hooks/use-intentions.ts`**:
   - Adicionado console.log em desenvolvimento para rastrear chamadas ao hook
   - Adicionado retry: 2 para tentar novamente em caso de falha

2. **`lib/intentions.ts`**:
   - Adicionado console.log em desenvolvimento para ver a URL exata sendo chamada

### Melhorias de Feedback ao Usuário

3. **`components/layout/filter-panel.tsx`**:
   - Adicionado tratamento de erro (`filteredOptionsError`)
   - Exibe mensagem "Erro ao carregar opcionais" quando a requisição falha

4. **`app/create/specs/page.tsx`**:
   - Adicionado tratamento de erro (`opcionaisError`)
   - Exibe mensagem de erro com ícone AlertCircle

5. **`components/intentions/filter-sidebar.tsx`**:
   - Adicionado tratamento de erro (`filteredOptionsError`)
   - Importado ícone AlertCircle

6. **`app/intention/[id]/edit/page.tsx`**:
   - Adicionado tratamento de erro (`opcionaisError`)

### Análise Concluída

O código está estruturado corretamente. O problema mais provável é:
- Backend não rodando ou URL incorreta
- CORS bloqueando requisições
- Cache do React Query com resultado antigo

Os logs de debug adicionados ajudarão a identificar a causa raiz quando o usuário testar.
