# Change: Add IBGE Location API

## Why
Atualmente os campos de cidade e estado são inputs de texto livre, permitindo erros de digitação e inconsistências. Queremos usar a API oficial do IBGE para:
- Exibir lista de estados brasileiros (dropdown)
- Ao selecionar estado, carregar cidades correspondentes
- Garantir dados padronizados e válidos
- Validar no backend que estado/cidade são válidos

## API do IBGE

**Estados:**
```
GET https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome
```

**Cidades por Estado (UF):**
```
GET https://servicodados.ibge.gov.br/api/v1/localidades/estados/{UF}/municipios
```

## What Changes

### Frontend - Componente LocationPicker
- Criar componente `LocationPicker` com dois selects: estado e cidade
- Buscar estados da API do IBGE no mount
- Ao selecionar estado, buscar cidades
- Cachear respostas para evitar requisições repetidas
- Usar em: settings, create/review

### Frontend - Integração
- Substituir inputs de texto por `LocationPicker` nas páginas:
  - `app/(main)/settings/page.tsx`
  - `app/create/review/page.tsx`

### Backend - Validação
- Adicionar validação de estado (sigla UF válida)
- Validação de cidade é opcional (lista muito grande para cachear)

## Impact
- Affected specs: `location-picker`
- Affected code:
  - `teachei-web/components/ui/location-picker.tsx` (novo)
  - `teachei-web/lib/ibge.ts` (novo)
  - `teachei-web/app/(main)/settings/page.tsx`
  - `teachei-web/app/create/review/page.tsx`
  - `AtualizarPerfilRequest.java` (validação)
  - `CriarAnuncioRequest.java` (validação)
