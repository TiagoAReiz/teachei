## ADDED Requirements

### Requirement: Opcionais Condicionados à Seleção de Tipo

O sistema SHALL exibir o seletor de opcionais SOMENTE após o usuário selecionar um tipo de veículo, tanto na criação de intenção quanto nos filtros do feed.

#### Scenario: Opcionais ocultos antes de selecionar tipo na criação
- **GIVEN** o comprador está na tela de criação de intenção
- **WHEN** nenhum tipo de veículo foi selecionado
- **THEN** a seção de opcionais NÃO é exibida
- **AND** uma mensagem indica "Selecione o tipo de veículo para ver os opcionais disponíveis"

#### Scenario: Opcionais aparecem após selecionar tipo na criação
- **GIVEN** o comprador está na tela de criação de intenção
- **WHEN** seleciona um tipo de veículo (CARRO, MOTO ou CAMINHAO)
- **THEN** a seção de opcionais é exibida com os itens aplicáveis ao tipo selecionado

#### Scenario: Opcionais ocultos antes de selecionar tipo no filtro
- **GIVEN** o vendedor está na tela de feed/busca
- **WHEN** nenhum tipo de veículo foi selecionado no filtro
- **THEN** o filtro de opcionais NÃO é exibido

#### Scenario: Opcionais aparecem após selecionar tipo no filtro
- **GIVEN** o vendedor está na tela de feed/busca
- **WHEN** seleciona um tipo de veículo no filtro
- **THEN** o filtro de opcionais é exibido com os itens aplicáveis ao tipo selecionado

### Requirement: Opcionais Segmentados por Tipo de Veículo

O sistema SHALL associar cada opcional a um ou mais tipos de veículo (CARRO, MOTO, CAMINHAO), permitindo que compradores selecionem apenas opcionais relevantes para o tipo de veículo desejado.

#### Scenario: Exibição de opcionais para MOTO
- **GIVEN** o comprador está criando uma intenção de compra
- **WHEN** seleciona tipo de veículo "MOTO"
- **THEN** o sistema exibe apenas opcionais aplicáveis a motos (ABS, Partida Elétrica, Freio a Disco, CBS, Controle de Tração, Painel Digital, Farol LED, Baú Traseiro, etc.)
- **AND** NÃO exibe opcionais exclusivos de carros (Vidro Elétrico, Teto Solar, Bancos de Couro, etc.)

#### Scenario: Exibição de opcionais para CAMINHÃO
- **GIVEN** o comprador está criando uma intenção de compra
- **WHEN** seleciona tipo de veículo "CAMINHAO"
- **THEN** o sistema exibe apenas opcionais aplicáveis a caminhões (Ar Condicionado, Direção Hidráulica, ABS, Cabine Leito, Retarder, Tacógrafo Digital, etc.)
- **AND** NÃO exibe opcionais exclusivos de carros (Vidro Elétrico, Teto Solar, etc.)

#### Scenario: Exibição de opcionais para CARRO
- **GIVEN** o comprador está criando uma intenção de compra
- **WHEN** seleciona tipo de veículo "CARRO"
- **THEN** o sistema exibe todos os opcionais aplicáveis a carros (Ar Condicionado, Vidro Elétrico, Teto Solar, ABS, Airbag, etc.)
- **AND** NÃO exibe opcionais exclusivos de motos ou caminhões

### Requirement: Lista de Opcionais para Motos

O sistema SHALL disponibilizar os seguintes opcionais específicos para o tipo MOTO:

| Código | Label | Descrição |
|--------|-------|-----------|
| PARTIDA_ELETRICA | Partida Elétrica | Sistema de ignição elétrica |
| INJECAO_ELETRONICA | Injeção Eletrônica | Sistema de injeção eletrônica de combustível |
| FREIO_DISCO_DIANTEIRO | Freio a Disco Dianteiro | Sistema de freio a disco na roda dianteira |
| FREIO_DISCO_TRASEIRO | Freio a Disco Traseiro | Sistema de freio a disco na roda traseira |
| CBS | Freio Combinado CBS | Combined Brake System - frenagem combinada |
| CONTROLE_TRACAO | Controle de Tração | Sistema eletrônico de controle de tração |
| PAINEL_DIGITAL | Painel Digital | Instrumentação digital ou TFT |
| FAROL_LED | Farol LED | Sistema de iluminação full-LED |
| PORTA_USB | Porta USB | Carregador USB integrado ao painel |
| BAU_TRASEIRO | Baú Traseiro | Top case ou baú para bagagem |
| PROTETOR_MOTOR | Protetor de Motor | Proteção inferior contra impactos |
| SLIDER | Slider de Proteção | Proteção lateral de carenagem |
| BAGAGEIRO | Bagageiro | Suporte traseiro para bagagem |
| PARABRISA | Para-brisa | Defletor de vento |
| QUICKSHIFTER | Quick Shifter | Sistema de troca de marcha sem embreagem |
| MODOS_PILOTAGEM | Modos de Pilotagem | Riding modes selecionáveis |
| GPS_NAVEGACAO | GPS/Navegação | Sistema de navegação integrado |

#### Scenario: Seleção de opcional específico de moto
- **GIVEN** o comprador selecionou tipo "MOTO"
- **WHEN** seleciona o opcional "Baú Traseiro"
- **THEN** o opcional é adicionado à lista de opcionais desejados da intenção

### Requirement: Lista de Opcionais para Caminhões

O sistema SHALL disponibilizar os seguintes opcionais específicos para o tipo CAMINHAO:

| Código | Label | Descrição |
|--------|-------|-----------|
| DIRECAO_ELETROHIDRAULICA | Direção Eletro-hidráulica | Sistema de direção com assistência eletro-hidráulica |
| ASR | Controle de Aderência (ASR) | Anti-Slip Regulation - controle de patinagem |
| ESC | Controle de Estabilidade (ESC) | Electronic Stability Control |
| SUSPENSAO_PNEUMATICA | Suspensão Pneumática | Sistema de suspensão a ar |
| CABINE_LEITO | Cabine Leito | Cabine com área de descanso integrada |
| TOMADA_FORCA | Tomada de Força (PTO) | Power Take-Off para implementos |
| BLOQUEIO_DIFERENCIAL | Bloqueio de Diferencial | Tração forçada para condições adversas |
| RETARDER | Freio Retarder | Freio auxiliar hidrodinâmico |
| TACOGRAFO_DIGITAL | Tacógrafo Digital | Registrador digital de jornada |
| SENSOR_FADIGA | Sensor de Fadiga | Sistema DSM de monitoramento do motorista |
| RASTREADOR | GPS/Rastreador | Sistema de rastreamento veicular |
| AR_CONDICIONADO_TETO | Ar Condicionado de Teto | AC independente na área de descanso |

#### Scenario: Seleção de opcional específico de caminhão
- **GIVEN** o comprador selecionou tipo "CAMINHAO"
- **WHEN** seleciona o opcional "Cabine Leito"
- **THEN** o opcional é adicionado à lista de opcionais desejados da intenção

### Requirement: Opcionais Compartilhados entre Tipos

O sistema SHALL manter opcionais que se aplicam a múltiplos tipos de veículos conforme a seguinte classificação:

**Universais (CARRO, MOTO, CAMINHAO):**
- ABS (Freios ABS)
- ALARME (Alarme)

**CARRO e CAMINHÃO:**
- AR_CONDICIONADO (Ar Condicionado)
- DIRECAO_HIDRAULICA (Direção Hidráulica)
- DIRECAO_ELETRICA (Direção Elétrica)
- CAMERA_RE (Câmera de Ré)
- MULTIMIDIA (Central Multimídia)
- BLUETOOTH (Bluetooth)

**Exclusivos CARRO:**
- VIDRO_ELETRICO (Vidro Elétrico)
- TETO_SOLAR (Teto Solar)
- BANCOS_COURO (Bancos de Couro)
- SENSOR_ESTACIONAMENTO (Sensor de Estacionamento)
- AIRBAG (Airbag)
- RODAS_LIGA (Rodas de Liga)
- PILOTO_AUTOMATICO (Piloto Automático)

#### Scenario: Opcional universal disponível para todos os tipos
- **GIVEN** o comprador está selecionando opcionais
- **WHEN** o tipo de veículo é qualquer um (CARRO, MOTO ou CAMINHAO)
- **THEN** o opcional "ABS" está disponível para seleção

### Requirement: Limpeza de Opcionais ao Trocar Tipo

O sistema SHALL limpar os opcionais previamente selecionados quando o usuário troca o tipo de veículo, preservando apenas os opcionais compatíveis com o novo tipo.

#### Scenario: Troca de tipo remove opcionais incompatíveis
- **GIVEN** o comprador selecionou tipo "CARRO" e marcou opcionais "Teto Solar" e "ABS"
- **WHEN** troca o tipo para "MOTO"
- **THEN** o opcional "Teto Solar" é removido da seleção
- **AND** o opcional "ABS" permanece selecionado (é universal)

### Requirement: Validação de Opcionais no Backend

O sistema SHALL validar que os opcionais enviados na criação/edição de intenção são compatíveis com o tipo de veículo selecionado.

#### Scenario: Rejeição de opcional incompatível
- **GIVEN** uma requisição de criação de intenção com tipo "MOTO"
- **WHEN** a lista de opcionais contém "TETO_SOLAR" (exclusivo de CARRO)
- **THEN** o sistema retorna erro HTTP 400 (Bad Request)
- **AND** a mensagem indica qual opcional é incompatível

#### Scenario: Aceitação de opcionais compatíveis
- **GIVEN** uma requisição de criação de intenção com tipo "MOTO"
- **WHEN** a lista de opcionais contém "ABS", "PARTIDA_ELETRICA", "FAROL_LED"
- **THEN** o sistema aceita a requisição e cria a intenção
