## MODIFIED Requirements

### Requirement: Carregamento de Opcionais por Tipo de Veículo

O sistema SHALL carregar e exibir os opcionais disponíveis quando o usuário seleciona um tipo de veículo, tanto na criação de intenções quanto nos filtros do feed.

#### Scenario: Opcionais carregados na criação de intenção

- **GIVEN** o usuário está na página de especificações de criação de intenção
- **AND** o usuário já selecionou um tipo de veículo (CARRO, MOTO ou CAMINHAO)
- **WHEN** a página carrega
- **THEN** o sistema DEVE fazer uma requisição GET para `/api/v1/anuncios/filtros?tipo={TIPO}`
- **AND** o sistema DEVE exibir a lista de opcionais compatíveis com o tipo selecionado
- **AND** a lista DEVE estar ordenada alfabeticamente pelo label

#### Scenario: Opcionais carregados nos filtros do feed

- **GIVEN** o usuário está visualizando o feed de intenções
- **AND** o usuário seleciona um tipo de veículo no filtro
- **WHEN** o tipo é selecionado
- **THEN** o sistema DEVE fazer uma requisição GET para `/api/v1/anuncios/filtros?tipo={TIPO}`
- **AND** o sistema DEVE exibir a seção de opcionais no painel de filtros
- **AND** os opcionais exibidos DEVEM ser apenas os compatíveis com o tipo selecionado

#### Scenario: Mensagem quando tipo não selecionado

- **GIVEN** o usuário não selecionou um tipo de veículo
- **WHEN** a seção de opcionais é renderizada
- **THEN** o sistema DEVE exibir a mensagem "Selecione um tipo de veículo para ver os opcionais disponíveis"
- **AND** o sistema NÃO DEVE mostrar uma lista vazia de opcionais

#### Scenario: Limpeza de opcionais ao trocar tipo

- **GIVEN** o usuário selecionou opcionais de um tipo de veículo
- **WHEN** o usuário troca para outro tipo de veículo
- **THEN** o sistema DEVE limpar a seleção de opcionais anterior
- **AND** o sistema DEVE carregar os opcionais do novo tipo selecionado
