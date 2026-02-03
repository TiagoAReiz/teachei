# Spec: Intention Edit

## ADDED Requirements

### Requirement: Edit Intention API
O sistema deve permitir que o dono de uma intenção edite campos permitidos.

#### Scenario: Usuário edita intenção com sucesso
- Given: usuário autenticado é dono da intenção
- When: PUT /v1/anuncios/{id} com campos válidos
- Then: intenção é atualizada e retornada

#### Scenario: Usuário tenta editar intenção de outro
- Given: usuário autenticado não é dono da intenção
- When: PUT /v1/anuncios/{id}
- Then: retorna 403 Forbidden

### Requirement: Campos Editáveis
O sistema deve permitir edição dos seguintes campos:
- versoes (lista de versões selecionadas)
- todasVersoes (boolean)
- anos (lista de anos)
- cores (lista de cores)
- precoMaximo (decimal)
- quilometragemMinima (integer)
- quilometragemMaxima (integer)
- opcionais (lista de strings)
- observacoes (string)
- cidade (string)
- estado (UF válida)

#### Scenario: Editar versões
- Given: intenção com versões ["Onix LT", "Onix LTZ"]
- When: usuário atualiza para todasVersoes = true
- Then: intenção salva com todasVersoes = true e versões vazias

#### Scenario: Editar localização
- Given: intenção em São Paulo, SP
- When: usuário atualiza para Rio de Janeiro, RJ
- Then: intenção salva com nova localização

### Requirement: Campos Não Editáveis
O sistema NÃO deve permitir edição de:
- tipoVeiculo
- marcaCodigo / marcaNome
- modeloCodigo / modeloNome / modeloBaseNome

#### Scenario: Campos imutáveis não estão no request
- Given: request de atualização
- When: request contém apenas campos editáveis
- Then: marca e modelo permanecem inalterados

### Requirement: Interface de Edição
O frontend deve fornecer página de edição acessível de "Minhas Intenções".

#### Scenario: Acessar edição
- Given: usuário na lista "Minhas Intenções"
- When: clica em "Editar" em uma intenção
- Then: navega para /intention/{id}/edit com dados preenchidos

#### Scenario: Formulário de edição
- Given: usuário na página de edição
- When: página carrega
- Then: exibe marca/modelo (readonly) e campos editáveis preenchidos

#### Scenario: Salvar edição
- Given: usuário alterou campos
- When: clica em "Salvar"
- Then: PUT para API, mostra sucesso, redireciona para detalhes
