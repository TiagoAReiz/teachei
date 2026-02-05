## ADDED Requirements

### Requirement: Filtros Avançados no Feed Mobile

O aplicativo mobile SHALL permitir filtrar intenções de compra por opcionais de veículos, além do tipo de veículo já existente.

#### Scenario: Acessar filtros avançados
- **WHEN** usuário está no feed de intenções
- **AND** toca em botão "Filtros" ou ícone de filtro
- **THEN** o sistema SHALL abrir um drawer/modal com opções de filtro avançadas
- **AND** SHALL exibir filtros para: tipo de veículo, opcionais, faixa de preço, faixa de ano

#### Scenario: Filtrar por opcionais no mobile
- **WHEN** usuário selecionou um tipo de veículo
- **AND** seleciona opcionais desejados
- **THEN** os opcionais disponíveis SHALL be específicos para o tipo selecionado
- **AND** os opcionais SHALL be buscados da API `GET /v1/anuncios/filtros?tipo={tipo}`

#### Scenario: Nenhum tipo selecionado no mobile
- **WHEN** usuário não selecionou tipo de veículo
- **THEN** a seção de opcionais SHALL exibir mensagem "Selecione um tipo de veículo para ver os opcionais"
- **AND** a seleção de opcionais SHALL estar desabilitada

#### Scenario: Aplicar filtros no mobile
- **WHEN** usuário configura filtros e toca em "Aplicar"
- **THEN** o sistema SHALL fechar o drawer/modal
- **AND** SHALL buscar intenções com os filtros aplicados
- **AND** SHALL exibir indicador visual de filtros ativos

#### Scenario: Limpar filtros no mobile
- **WHEN** usuário toca em "Limpar filtros"
- **THEN** todos os filtros SHALL be resetados
- **AND** a lista de intenções SHALL mostrar todas as intenções
