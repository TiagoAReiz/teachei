# Tasks: Adicionar Opcionais Específicos para Motos e Caminhões

## 1. Backend - Refatoração do Enum

- [x] 1.1 Criar enum `TipoVeiculo` se não existir (CARRO, MOTO, CAMINHAO) - já existia
- [x] 1.2 Adicionar campo `Set<TipoVeiculo> tiposAplicaveis` no enum `OpcionalVeiculo`
- [x] 1.3 Adicionar os 17 novos opcionais para MOTO com labels em português
- [x] 1.4 Adicionar os 12 novos opcionais para CAMINHÃO com labels em português
- [x] 1.5 Atualizar opcionais existentes com seus tipos aplicáveis
- [x] 1.6 Adicionar método `getOpcionaisPorTipo(TipoVeiculo tipo)` para filtrar opcionais

## 2. Backend - API de Filtros

- [x] 2.1 Atualizar endpoint `GET /api/filtros` para aceitar query param `tipo` (CARRO, MOTO, CAMINHAO)
- [x] 2.2 Retornar apenas opcionais aplicáveis ao tipo selecionado
- [ ] 2.3 Adicionar testes unitários para filtragem por tipo

## 3. Frontend Mobile - Seletor de Opcionais

- [x] 3.1 Ocultar seção de opcionais até que tipo de veículo seja selecionado
- [x] 3.2 Exibir mensagem "Selecione o tipo de veículo para ver os opcionais" quando tipo não selecionado
- [x] 3.3 Atualizar componente de seleção de opcionais para receber prop `tipoVeiculo`
- [x] 3.4 Filtrar lista de opcionais baseado no tipo selecionado
- [x] 3.5 Limpar opcionais selecionados ao trocar tipo de veículo
- [ ] 3.6 Testar fluxo completo de criação de intenção para cada tipo

## 4. Frontend Web - Seletor de Opcionais

- [x] 4.1 Ocultar seção de opcionais até que tipo de veículo seja selecionado
- [x] 4.2 Exibir mensagem "Selecione o tipo de veículo para ver os opcionais" quando tipo não selecionado
- [x] 4.3 Atualizar componente de seleção de opcionais para receber prop `tipoVeiculo`
- [x] 4.4 Filtrar lista de opcionais baseado no tipo selecionado
- [x] 4.5 Limpar opcionais selecionados ao trocar tipo de veículo
- [ ] 4.6 Testar fluxo completo de criação de intenção para cada tipo

## 5. Frontend - Filtros do Feed

- [x] 5.1 Ocultar filtro de opcionais até que tipo de veículo seja selecionado no filtro
- [x] 5.2 Exibir filtro de opcionais somente após selecionar tipo
- [x] 5.3 Limpar opcionais filtrados ao trocar tipo de veículo
- [ ] 5.4 Testar filtro no mobile e web

## 6. Validação e Testes

- [x] 6.1 Adicionar validação no backend: opcionais devem ser compatíveis com o tipo do veículo
- [x] 6.2 Retornar erro 400 se opcional incompatível for enviado
- [ ] 6.3 Criar testes de integração para validação
- [ ] 6.4 Testar retrocompatibilidade com intenções existentes

## 7. Documentação

- [ ] 7.1 Atualizar documentação da API com novos opcionais
- [ ] 7.2 Documentar regras de compatibilidade tipo x opcional

## Resumo de Implementação

### Arquivos Backend Modificados:
- `OpcionalVeiculo.java` - Refatorado para incluir tipos aplicáveis e novos opcionais
- `AnuncioService.java` - Adicionada validação de opcionais compatíveis
- `CriarAnuncioUseCaseImpl.java` - Adicionada chamada de validação
- `AtualizarAnuncioUseCaseImpl.java` - Adicionada chamada de validação
- `BuscarFiltrosDisponiveisUseCase.java` - Adicionado retorno de opcionais
- `BuscarFiltrosDisponiveisUseCaseImpl.java` - Implementada filtragem de opcionais por tipo
- `FiltrosDisponiveisResponse.java` - Adicionado campo opcionais
- `BeanConfiguration.java` - Atualizada injeção de dependências

### Arquivos Frontend Mobile Modificados:
- `types/index.ts` - Adicionados tipos OpcionalOption e FiltrosDisponiveis
- `stores/create-intention-store.ts` - Adicionado suporte a opcionais
- `constants/config.ts` - Adicionado endpoint de filtros
- `services/vehicles.ts` - Adicionado método getOpcionais
- `app/create/specs.tsx` - Implementada seção de opcionais condicionada

### Arquivos Frontend Web Modificados:
- `types/index.ts` - Adicionado tipo AvailableOpcional
- `stores/create-intention-store.ts` - Limpar opcionais ao trocar tipo
- `app/create/specs/page.tsx` - Implementada seção de opcionais condicionada
- `components/intentions/filter-sidebar.tsx` - Implementado filtro de opcionais condicionado
