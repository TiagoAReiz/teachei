# Change: Add Full Intention Edit Feature

## Why
Atualmente o usuário só pode editar anos, cores, preço máximo e observações de uma intenção. O usuário quer poder editar todos os campos exceto marca e modelo base, incluindo:
- Versões selecionadas
- Anos (min/max)
- Cores
- Preço máximo
- Quilometragem (min/max)
- Opcionais
- Observações
- Cidade e estado

Marca e modelo não podem ser alterados porque mudariam fundamentalmente a intenção.

## What Changes

### Backend
1. Expandir `AtualizarAnuncioRequest` para incluir:
   - `versoes` (List<VersaoRequest>)
   - `todasVersoes` (boolean)
   - `quilometragemMinima` (Integer)
   - `quilometragemMaxima` (Integer)
   - `opcionais` (List<String>)
   - `cidade` (String)
   - `estado` (String com validação UF)

2. Expandir `AtualizarAnuncioUseCase.AtualizarAnuncioCommand` com os mesmos campos

3. Atualizar `AtualizarAnuncioUseCaseImpl` para aplicar todos os campos

4. Remover restrição de status (permitir editar mesmo após ATIVO)

### Frontend
1. Criar página `/intention/[id]/edit` para edição
2. Criar store `edit-intention-store` similar ao `create-intention-store`
3. Criar hook `useUpdateIntention` para chamada API
4. Adicionar botão "Editar" na listagem de "Minhas Intenções"
5. Reusar componentes de especificação (anos, cores, km, opcionais)

## Impact
- Affected specs: `intention-edit`
- Affected code:
  - Backend: `AtualizarAnuncioRequest`, `AtualizarAnuncioUseCase`, `AtualizarAnuncioUseCaseImpl`, `AnuncioController`
  - Frontend: nova página edit, novo store, novo hook, updates em my-intentions
