# Spec: Searchable Vehicle Selector

## ADDED Requirements

### Requirement: Searchable List Component
O sistema deve fornecer um componente de lista pesquisável reutilizável.

#### Scenario: Busca por texto
- Given: lista de marcas com 50+ opções
- When: usuário digita "chev" no campo de busca
- Then: lista mostra apenas "Chevrolet" (e outras que contenham "chev")

#### Scenario: Busca case-insensitive
- Given: marca "Toyota" na lista
- When: usuário digita "toyota" (minúsculo)
- Then: "Toyota" aparece nos resultados

#### Scenario: Busca accent-insensitive
- Given: modelo "Fusca" na lista
- When: usuário digita "fusca" ou "fúsca"
- Then: "Fusca" aparece nos resultados

#### Scenario: Nenhum resultado
- Given: nenhuma marca corresponde à busca
- When: usuário digita "xyz123"
- Then: mostra mensagem "Nenhum resultado para 'xyz123'"

#### Scenario: Limpar busca
- Given: usuário digitou algo no campo
- When: clica no botão X (clear)
- Then: campo é limpo e lista completa é exibida

### Requirement: Highlight do Match
O texto que corresponde à busca deve ser destacado visualmente.

#### Scenario: Destaque visual
- Given: usuário busca por "cor"
- When: "Corolla" aparece nos resultados
- Then: "Cor" aparece em negrito/destacado, "olla" normal

### Requirement: Integração na Criação de Intenção
A busca deve estar integrada nos seletores de marca, modelo e versão.

#### Scenario: Buscar marca
- Given: usuário na página de seleção de veículo
- When: digita no campo de busca de marca
- Then: lista de marcas é filtrada instantaneamente

#### Scenario: Buscar modelo
- Given: marca selecionada
- When: digita no campo de busca de modelo
- Then: lista de modelos agrupados é filtrada

#### Scenario: Buscar versão
- Given: modelo base selecionado
- When: digita no campo de busca de versão
- Then: lista de versões é filtrada

### Requirement: Acessibilidade e UX
O componente deve ser acessível e ter boa experiência de uso.

#### Scenario: Focus automático
- Given: seção de seleção de marca aparece
- When: componente é montado
- Then: campo de busca recebe foco (opcional baseado em device)

#### Scenario: Keyboard navigation
- Given: campo de busca em foco
- When: usuário pressiona Enter
- Then: seleciona primeiro item filtrado (se houver)

#### Scenario: Mobile-friendly
- Given: usuário em dispositivo mobile
- When: toca no campo de busca
- Then: teclado virtual abre normalmente
