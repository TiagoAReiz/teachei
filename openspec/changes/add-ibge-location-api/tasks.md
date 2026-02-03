## 1. Frontend - Criar lib/ibge.ts

- [x] 1.1 Criar funções para buscar estados do IBGE
- [x] 1.2 Criar funções para buscar cidades por UF
- [x] 1.3 Definir types para Estado e Cidade

## 2. Frontend - Criar componente LocationPicker

- [x] 2.1 Criar componente com select de estado
- [x] 2.2 Adicionar select de cidade (carrega após selecionar estado)
- [x] 2.3 Usar React Query para cache
- [x] 2.4 Estilizar consistente com outros inputs
- [x] 2.5 Exportar em components/ui/index.ts

## 3. Frontend - Integrar nas páginas

- [x] 3.1 Substituir inputs em `settings/page.tsx`
- [x] 3.2 Substituir inputs em `create/review/page.tsx`
- [x] 3.3 Testar fluxo de seleção

## 4. Backend - Validação

- [x] 4.1 Adicionar validação de UF válida em `AtualizarPerfilRequest`
- [x] 4.2 Adicionar validação de UF válida em `CriarAnuncioRequest`
