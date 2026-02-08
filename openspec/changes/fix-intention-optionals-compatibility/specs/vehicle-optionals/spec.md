## MODIFIED Requirements

### Requirement: Opcionais Condicionados à Seleção de Tipo

O sistema SHALL exibir o seletor de opcionais SOMENTE após o usuário selecionar um tipo de veículo, tanto na criação de intenção quanto nos filtros do feed. Quando um tipo está selecionado, o sistema MUST carregar os opcionais apenas a partir de `/api/v1/anuncios/filtros?tipo={TIPO}` e MUST NOT permitir a seleção de opcionais incompatíveis com o tipo escolhido.

#### Scenario: Opcionais ocultos antes de selecionar tipo na criação
- **GIVEN** o comprador está na tela de criação de intenção
- **WHEN** nenhum tipo de veículo foi selecionado
- **THEN** a seção de opcionais NÃO é exibida
- **AND** uma mensagem indica "Selecione o tipo de veículo para ver os opcionais disponíveis"

#### Scenario: Opcionais aparecem após selecionar tipo na criação
- **GIVEN** o comprador está na tela de criação de intenção
- **WHEN** seleciona um tipo de veículo (CARRO, MOTO ou CAMINHAO)
- **THEN** a seção de opcionais é exibida com os itens aplicáveis ao tipo selecionado
- **AND** os opcionais são carregados de `/api/v1/anuncios/filtros?tipo={TIPO}`

#### Scenario: Falha ao carregar opcionais por tipo
- **GIVEN** o comprador selecionou um tipo de veículo
- **WHEN** a requisição de opcionais por tipo falha
- **THEN** nenhuma opção é exibida para seleção
- **AND** o sistema exibe a mensagem "Erro ao carregar opcionais. Verifique sua conexão."
- **AND** opcionais previamente selecionados são limpos

#### Scenario: Lista vazia de opcionais por tipo
- **GIVEN** o comprador selecionou um tipo de veículo
- **WHEN** a API retorna lista vazia de opcionais
- **THEN** nenhuma opção é exibida para seleção
- **AND** o sistema exibe a mensagem "Nenhum opcional disponível para este tipo de veículo."
- **AND** opcionais previamente selecionados são limpos

#### Scenario: Sem fallback para opcionais de outros tipos
- **GIVEN** o comprador selecionou um tipo de veículo
- **WHEN** a consulta por tipo falha ou retorna vazio
- **THEN** o sistema NÃO exibe opcionais de outros tipos
