## 1. Backend - Expandir Request e UseCase

- [x] 1.1 Atualizar `AtualizarAnuncioRequest` com novos campos (versoes, todasVersoes, quilometragemMinima, quilometragemMaxima, opcionais, cidade, estado)
- [x] 1.2 Atualizar `AtualizarAnuncioUseCase.AtualizarAnuncioCommand` com mesmos campos
- [x] 1.3 Atualizar `AtualizarAnuncioUseCaseImpl` para aplicar todos os campos
- [x] 1.4 Atualizar `AnuncioController.atualizar()` para mapear novos campos
- [x] 1.5 Atualizar `VeiculoInfo.atualizar()` para receber novos campos

## 2. Frontend - API e Types

- [x] 2.1 Adicionar type `UpdateAnuncioRequest` em types/index.ts
- [x] 2.2 Atualizar função `updateIntention` em lib/intentions.ts
- [x] 2.3 Atualizar hook `useUpdateIntention` em hooks/use-intentions.ts

## 3. Frontend - Página de Edição

- [x] 3.1 Criar página `/intention/[id]/edit/page.tsx`
- [x] 3.2 Carregar dados da intenção existente
- [x] 3.3 Exibir marca/modelo como readonly
- [x] 3.4 Implementar formulário com campos editáveis (anos, cores, preço, km, opcionais, localização, observações)
- [x] 3.5 Implementar submit com PUT para API
- [x] 3.6 Mostrar toast de sucesso e redirecionar

## 4. Frontend - Navegação

- [x] 4.1 Adicionar botão "Editar" em cada card de "Minhas Intenções"
- [x] 4.2 Link para /intention/{id}/edit
