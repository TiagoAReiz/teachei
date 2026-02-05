## MODIFIED Requirements

### Requirement: Formatação Visual de Telefone Brasileiro

O sistema SHALL formatar números de telefone brasileiro com separadores visuais (parênteses e traços) conforme o usuário digita, seguindo o padrão `+55 (XX) XXXXX-XXXX`.

#### Scenario: Usuário começa a digitar telefone
- **WHEN** usuário foca no campo de telefone
- **THEN** o campo SHALL exibir `+55` como prefixo inicial

#### Scenario: Usuário digita DDD
- **WHEN** usuário digita os 2 primeiros dígitos após +55 (ex: "11")
- **THEN** o campo SHALL exibir `+55 (11) `
- **AND** o cursor SHALL estar posicionado após o parênteses de fechamento e espaço

#### Scenario: Usuário digita número completo
- **WHEN** usuário digita todos os 11 dígitos (DDD + 9 dígitos)
- **THEN** o campo SHALL exibir no formato `+55 (11) 99999-8888`
- **AND** o traço SHALL ser inserido automaticamente após o 5º dígito do número

#### Scenario: Formatação progressiva
- **GIVEN** campo vazio
- **WHEN** usuário digita "11999998888"
- **THEN** o sistema SHALL formatar progressivamente:
  - Após "11": `+55 (11) `
  - Após "11999": `+55 (11) 999`
  - Após "1199999": `+55 (11) 99999-`
  - Após "11999998888": `+55 (11) 99999-8888`

#### Scenario: Validação aceita formato com separadores
- **WHEN** telefone está no formato `+55 (11) 99999-8888`
- **THEN** a validação SHALL considerar o telefone como válido
- **AND** ao salvar no backend, os separadores SHALL be removidos (armazenar como `+5511999998888`)

#### Scenario: Cola de número sem formatação
- **WHEN** usuário cola um número como "5511999998888" ou "11999998888"
- **THEN** o sistema SHALL formatar automaticamente para `+55 (11) 99999-8888`

#### Scenario: Formatação no mobile
- **WHEN** usuário digita telefone no app mobile
- **THEN** o mesmo comportamento de formatação SHALL be aplicado
- **AND** o teclado numérico SHALL be exibido

#### Scenario: Limite de caracteres
- **WHEN** usuário tenta digitar mais de 11 dígitos (após +55)
- **THEN** o sistema SHALL ignorar dígitos adicionais
- **AND** SHALL manter o formato `+55 (XX) XXXXX-XXXX`
