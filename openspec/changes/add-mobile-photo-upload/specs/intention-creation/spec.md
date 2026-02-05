## ADDED Requirements

### Requirement: Mobile Photo Upload
O app mobile MUST permitir que o usuário adicione uma foto de referência ao criar uma intenção de compra, com paridade funcional ao app web.

#### Scenario: Usuário seleciona foto da galeria
- **WHEN** usuário está na tela de especificações (specs.tsx)
- **AND** toca no botão de adicionar foto
- **THEN** sistema abre o seletor de imagens do dispositivo
- **AND** ao selecionar uma imagem válida (<2MB, formato imagem)
- **THEN** a imagem é convertida para base64 e armazenada no store

#### Scenario: Usuário tira foto com câmera
- **WHEN** usuário está na tela de especificações
- **AND** toca no botão de tirar foto
- **THEN** sistema abre a câmera do dispositivo
- **AND** ao capturar uma imagem válida
- **THEN** a imagem é convertida para base64 e armazenada no store

#### Scenario: Validação de tamanho da imagem
- **WHEN** usuário seleciona uma imagem maior que 2MB
- **THEN** sistema exibe alerta "A imagem deve ter no máximo 2MB"
- **AND** a imagem NÃO é armazenada no store

#### Scenario: Remover foto selecionada
- **WHEN** usuário tem uma foto selecionada
- **AND** toca no botão de remover foto
- **THEN** o campo `fotoReferenciaBase64` é limpo do store
- **AND** o preview da foto é removido da tela

#### Scenario: Preview na tela de revisão
- **WHEN** usuário navega para a tela de revisão
- **AND** existe uma foto de referência selecionada
- **THEN** sistema exibe thumbnail da foto na seção de detalhes

#### Scenario: Envio da foto ao criar intenção
- **WHEN** usuário confirma a criação da intenção
- **AND** existe uma foto de referência selecionada
- **THEN** sistema envia `fotoReferenciaBase64` no request para o backend
- **AND** backend faz upload para Azure Blob Storage
- **AND** URL da foto é salva no VeiculoInfo

#### Scenario: Criação sem foto (opcional)
- **WHEN** usuário confirma a criação da intenção
- **AND** NÃO existe foto de referência selecionada
- **THEN** sistema cria a intenção normalmente sem foto
- **AND** campo `fotoReferenciaUrl` permanece nulo

### Requirement: Mobile Photo Upload Store State
O store de criação de intenção mobile SHALL incluir estado para gerenciar a foto de referência.

#### Scenario: Estado inicial
- **GIVEN** store está em estado inicial
- **THEN** `fotoReferenciaBase64` é `null`

#### Scenario: Reset limpa foto
- **WHEN** action `reset()` é chamada
- **THEN** `fotoReferenciaBase64` volta para `null`
