## MODIFIED Requirements

### Requirement: Filtro de Opcionais Dinâmico no Feed Web

O sistema SHALL exibir opcionais de veículos nos filtros do feed baseado no tipo de veículo selecionado, buscando dados da API `/v1/anuncios/filtros?tipo={tipo}`.

#### Scenario: Nenhum tipo de veículo selecionado
- **WHEN** usuário não selecionou nenhum tipo de veículo (ou selecionou "Todos")
- **THEN** a seção de opcionais SHALL NOT be displayed
- **AND** uma mensagem "Selecione um tipo de veículo para ver os opcionais" SHALL be displayed

#### Scenario: Tipo CARRO selecionado
- **WHEN** usuário seleciona tipo "Carros"
- **THEN** o sistema SHALL buscar opcionais via API com `tipo=CARRO`
- **AND** SHALL exibir apenas opcionais aplicáveis a CARRO (ar condicionado, vidro elétrico, teto solar, etc.)
- **AND** SHALL NOT exibir opcionais de MOTO (partida elétrica, baú traseiro, etc.)

#### Scenario: Tipo MOTO selecionado
- **WHEN** usuário seleciona tipo "Motos"
- **THEN** o sistema SHALL buscar opcionais via API com `tipo=MOTO`
- **AND** SHALL exibir apenas opcionais aplicáveis a MOTO (partida elétrica, freio a disco, baú traseiro, etc.)
- **AND** SHALL NOT exibir opcionais de CARRO (vidro elétrico, teto solar, etc.)

#### Scenario: Tipo CAMINHAO selecionado
- **WHEN** usuário seleciona tipo "Caminhões"
- **THEN** o sistema SHALL buscar opcionais via API com `tipo=CAMINHAO`
- **AND** SHALL exibir apenas opcionais aplicáveis a CAMINHAO (cabine leito, retarder, tacógrafo, etc.)

#### Scenario: Trocar tipo de veículo limpa opcionais
- **WHEN** usuário tinha opcionais selecionados para um tipo
- **AND** usuário troca para outro tipo de veículo
- **THEN** os opcionais previamente selecionados SHALL be cleared
- **AND** novos opcionais do novo tipo SHALL be loaded
